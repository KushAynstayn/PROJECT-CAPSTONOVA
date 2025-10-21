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

class ProcessTarSourceCode implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public function __construct(
        public User $user,
        public int $projectId,
        public array $programmingLanguages,
        public string $tempTarPath
    ) {}

    /**
     * @throws \Exception
     */
    public function handle(): void
    {
        // MODIFIED: Use the SendNotification job with a title
        SendNotification::dispatch(
            'Processing Uploaded File',
            'Your file upload is now being processed.',
            $this->user->id
        );

        $sourceTarStream = null;
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

            // --- CORRECTED SINGLE PIPELINE FOR TAR FILE ---
            // 2. Process TAR File (Stream Read -> Compress -> Encrypt -> Stream Write)

            $sourceTarStream = Storage::readStream($this->tempTarPath);
            if ($sourceTarStream === false) {
                throw new \Exception("Could not open read stream for TAR file: {$this->tempTarPath}");
            }

            $uuid = Str::uuid();
            $finalPath = "private/source_codes/{$uuid}.tar.zst.enc";
            $tempEncryptedPath = dirname($this->tempTarPath) . "/{$uuid}.enc.tmp";

            $fullTempEncryptedPath = Storage::path($tempEncryptedPath);
            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationEncryptedStream = fopen($fullTempEncryptedPath, 'wb');

            if ($destinationEncryptedStream === false) {
                throw new \Exception("Could not open a write stream to the destination path: {$fullTempEncryptedPath}");
            }

            // This single loop now handles the entire pipeline correctly.
            while (!feof($sourceTarStream)) {
                // a. Read a raw chunk from the source TAR file
                $rawChunk = fread($sourceTarStream, $chunkSize);

                // b. Compress that single chunk to create a complete zstd frame
                $compressedFrame = zstd_compress($rawChunk, 6);

                // c. Encrypt the entire compressed frame
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunk = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($compressedFrame, '', $nonce, $sodiumEncryptionKey);

                // d. Write a header and the encrypted frame to the destination
                $header = pack('N', strlen($encryptedChunk)) . $nonce;
                if (fwrite($destinationEncryptedStream, $header . $encryptedChunk) === false) {
                    throw new \Exception("Failed to write encrypted TAR chunk to storage stream.");
                }
            }
            Storage::move($tempEncryptedPath, $finalPath);

            $sizeInBytes = Storage::size($finalPath);
            $sizeInMB = round($sizeInBytes / 1024 / 1024, 2);

            // 3. Database Logic (Unchanged)
            DB::transaction(function () use ($finalPath, $sizeInMB) {
                $sourceCode = CapstoneSourceCode::create([
                    'project_id' => $this->projectId,
                    'file_path' => $finalPath,
                    'repository_url' => null,
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

            // --- ADDED: Success Notifications ---
            $project = CapstoneProject::find($this->projectId);

            $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->all();
            $adminMessage = "User {$this->user->first_name} {$this->user->last_name} has submitted a source code file for the project: '{$project->title}'.";
            SendNotification::dispatch('New Source Code Submission', $adminMessage, null, $adminIds);

            if ($this->user->userDetail && $this->user->userDetail->adviser_id) {
                $adviserMessage = "Your advisee, {$this->user->first_name} {$this->user->last_name}, has submitted a source code file for the project: '{$project->title}'.";
                SendNotification::dispatch('Advisee Source Code Submission', $adviserMessage, $this->user->userDetail->adviser_id);
            }

            SendNotification::dispatch(
                'File Processing Complete',
                "Your source code file for project '{$project->title}' has been processed successfully.",
                $this->user->id
            );
        } catch (Throwable $e) {
            Log::error("Failed processing TAR for project ID {$this->projectId}: " . $e->getMessage());
            $this->fail($e);
        } finally {
            // Ensure all file handles are closed
            if (is_resource($sourceTarStream)) fclose($sourceTarStream);
            if (is_resource($destinationEncryptedStream)) fclose($destinationEncryptedStream);

            // Clean up all temporary files
            if (Storage::exists($this->tempTarPath)) {
                Storage::delete($this->tempTarPath);
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
        // ADDED: Failure notification logic
        $project = CapstoneProject::find($this->projectId);
        SendNotification::dispatch(
            'File Processing Failed',
            "Processing your source code file for project '{$project->title}' failed. Please try again.",
            $this->user->id
        );
    }
}
