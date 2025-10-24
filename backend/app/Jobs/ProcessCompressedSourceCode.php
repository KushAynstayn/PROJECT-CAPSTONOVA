<?php

namespace App\Jobs;

use App\Models\CapstoneManuscript;
use App\Models\CapstoneSourceCode;
use App\Models\Notification;
use App\Models\ProgrammingLanguage;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;
use App\Models\CapstoneProject; // Import CapstoneProject model
use App\Jobs\SendNotification; // Import SendNotification job

class ProcessCompressedSourceCode implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public int $projectId,
        public array $programmingLanguages,
        public string $tempFilePath,
        public string $originalFilename
    ) {}

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
        // Use the SendNotification job with a title
        SendNotification::dispatch(
            'Processing Compressed File',
            'Your compressed file (zip, rar, etc.) is now being processed.',
            $this->user->id
        );

        $sourceStream = null;
        $destinationEncryptedStream = null;
        $tempEncryptedPath = null;

        try {
            // 1. Key Preparation & Validation
            if (!extension_loaded('sodium')) {
                throw new \Exception('The Sodium extension is required for encryption but is not loaded.');
            }

            $key = Config::get('app.key');
            if (str_starts_with($key, 'base64:')) {
                $key = substr($key, 7);
            }
            $sodiumEncryptionKey = base64_decode($key);

            if (strlen($sodiumEncryptionKey) !== SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES) {
                throw new \Exception('Invalid application key length for Sodium encryption.');
            }

            $chunkSize = 1048576; // 1MB

            // --- NEW PIPELINE (NO COMPRESSION) ---
            // 2. Process File (Stream Read -> Encrypt -> Stream Write)

            $sourceStream = Storage::readStream($this->tempFilePath);
            if ($sourceStream === false) {
                throw new \Exception("Could not open read stream for file: {$this->tempFilePath}");
            }

            // Get the original extension (e.g., "zip", "rar")
            $extension = pathinfo($this->originalFilename, PATHINFO_EXTENSION);
            if (empty($extension)) {
                $extension = 'zip'; // Default to .zip if extension is missing
            }

            $uuid = Str::uuid();
            // Final path includes the original extension
            $finalPath = "private/source_codes/{$uuid}.{$extension}.enc";
            $tempEncryptedPath = dirname($this->tempFilePath) . "/{$uuid}.enc.tmp";

            $fullTempEncryptedPath = Storage::path($tempEncryptedPath);
            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationEncryptedStream = fopen($fullTempEncryptedPath, 'wb');

            if ($destinationEncryptedStream === false) {
                throw new \Exception("Could not open a write stream to the destination path: {$fullTempEncryptedPath}");
            }

            // This loop handles the modified pipeline.
            while (!feof($sourceStream)) {
                // a. Read a raw chunk from the source file
                $rawChunk = fread($sourceStream, $chunkSize);

                // b. Encrypt the raw chunk
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunk = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($rawChunk, '', $nonce, $sodiumEncryptionKey);

                // c. Write a header and the encrypted chunk to the destination
                $header = pack('N', strlen($encryptedChunk)) . $nonce;
                if (fwrite($destinationEncryptedStream, $header . $encryptedChunk) === false) {
                    throw new \Exception("Failed to write encrypted chunk to storage stream.");
                }
            }
            Storage::move($tempEncryptedPath, $finalPath);

            $sizeInBytes = Storage::size($finalPath);
            $sizeInMB = round($sizeInBytes / 1024 / 1024, 2);

            // 3. Database Logic (Same as other jobs)
            DB::transaction(function () use ($finalPath, $sizeInMB) {
                $sourceCode = CapstoneSourceCode::create([
                    'project_id' => $this->projectId,
                    'file_path' => $finalPath,
                    'repository_url' => null, // No repo URL for this type
                    'upload_date' => now(),
                ]);

                $languageIds = [];
                foreach ($this->programmingLanguages as $langName) {
                    $language = ProgrammingLanguage::firstOrCreate(
                        ['language_name' => trim($langName)],
                        ['is_framework' => false]
                    );
                    $languageIds[] = $language->id;
                }
                $sourceCode->programmingLanguages()->attach($languageIds);

                CapstoneManuscript::where('project_id', $this->projectId)
                    ->update(['project_size' => $sizeInMB]);
            });

            // --- Success Notifications ---
            $project = CapstoneProject::find($this->projectId);

            $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->all();
            $adminMessage = "User {$this->user->first_name} {$this->user->last_name} has submitted a compressed file for the project: '{$project->title}'.";
            SendNotification::dispatch('New Compressed File Submission', $adminMessage, null, $adminIds);

            if ($this->user->userDetail && $this->user->userDetail->adviser_id) {
                $adviserMessage = "Your advisee, {$this->user->first_name} {$this->user->last_name}, has submitted a compressed file for the project: '{$project->title}'.";
                SendNotification::dispatch('Advisee Compressed File Submission', $adviserMessage, $this->user->userDetail->adviser_id);
            }

            SendNotification::dispatch(
                'File Processing Complete',
                "Your compressed file for project '{$project->title}' has been processed successfully.",
                $this->user->id
            );
        } catch (Throwable $e) {
            Log::error("Failed processing compressed file for project ID {$this->projectId}: " . $e->getMessage());
            $this->fail($e);
        } finally {
            // Ensure all file handles are closed
            if (is_resource($sourceStream)) fclose($sourceStream);
            if (is_resource($destinationEncryptedStream)) fclose($destinationEncryptedStream);

            // Clean up all temporary files
            if (Storage::exists($this->tempFilePath)) {
                Storage::delete($this->tempFilePath);
            }
            if ($tempEncryptedPath && Storage::exists($tempEncryptedPath)) {
                Storage::delete($tempEncryptedPath);
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        // Failure notification logic
        $project = CapstoneProject::find($this->projectId);
        SendNotification::dispatch(
            'File Processing Failed',
            "Processing your compressed file for project '{$project->title}' failed. Please try again.",
            $this->user->id
        );
    }
}
