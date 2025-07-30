<?php

namespace App\Jobs;

use App\Models\CapstoneManuscript;
use App\Models\CapstoneProject;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProcessCapstoneManuscripts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public CapstoneProject $project,
        public array $tempPaths
    ) {}

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
        // Declare stream variables here to ensure they are accessible in the 'finally' block
        $sourceManuscriptStream = null;
        $destinationEncryptedStream = null;
        $sourceAcmStream = null;
        $destinationAcmEncryptedStream = null;

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

            // --- CORRECTED SINGLE PIPELINE FOR MANUSCRIPT ---
            // 2. Process Manuscript PDF (Stream Read -> Compress -> Encrypt -> Stream Write)

            $sourceManuscriptStream = Storage::readStream($this->tempPaths['manuscript']);
            if ($sourceManuscriptStream === false) {
                throw new \Exception('Could not open a read stream for the manuscript.');
            }

            $manuscriptUuid = Str::uuid();
            $tempEncryptedPath = "private/temp/{$this->user->id}/{$manuscriptUuid}.tmp";
            $finalManuscriptPath = "private/manuscripts/{$manuscriptUuid}.pdf.zst.enc";

            $fullTempPath = Storage::path($tempEncryptedPath);
            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationEncryptedStream = fopen($fullTempPath, 'wb');

            if ($destinationEncryptedStream === false) {
                throw new \Exception("Could not open a write stream to the destination path: {$fullTempPath}");
            }

            // This single loop now handles the entire pipeline correctly.
            while (!feof($sourceManuscriptStream)) {
                // a. Read a raw chunk from the source file
                $rawChunk = fread($sourceManuscriptStream, $chunkSize);

                // b. Compress that single chunk to create a complete zstd frame
                $compressedFrame = zstd_compress($rawChunk, 6);

                // c. Encrypt the entire compressed frame
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunk = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($compressedFrame, '', $nonce, $sodiumEncryptionKey);

                // d. Write a header and the encrypted frame to the destination
                $header = pack('N', strlen($encryptedChunk)) . $nonce;
                if (fwrite($destinationEncryptedStream, $header . $encryptedChunk) === false) {
                    throw new \Exception("Failed to write encrypted manuscript chunk to storage stream.");
                }
            }
            Storage::move($tempEncryptedPath, $finalManuscriptPath);


            // 3. Process ACM PDF (Stream Read -> Encrypt -> Stream Write)
            $sourceAcmStream = Storage::readStream($this->tempPaths['acm']);
            if ($sourceAcmStream === false) {
                throw new \Exception('Could not open a read stream for the ACM file.');
            }

            $acmUuid = Str::uuid();
            $tempAcmEncryptedPath = "private/temp/{$this->user->id}/{$acmUuid}.tmp";
            $finalAcmPath = "private/manuscripts/{$acmUuid}.pdf.enc";

            $fullTempAcmPath = Storage::path($tempAcmEncryptedPath);
            Storage::makeDirectory(dirname($tempAcmEncryptedPath));
            $destinationAcmEncryptedStream = fopen($fullTempAcmPath, 'wb');

            if ($destinationAcmEncryptedStream === false) {
                throw new \Exception("Could not open a write stream for the ACM temporary file: {$fullTempAcmPath}");
            }

            while (!feof($sourceAcmStream)) {
                $chunk = fread($sourceAcmStream, $chunkSize);
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunkWithTag = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($chunk, '', $nonce, $sodiumEncryptionKey);
                $header = pack('N', strlen($encryptedChunkWithTag)) . $nonce;
                if (fwrite($destinationAcmEncryptedStream, $header . $encryptedChunkWithTag) === false) {
                    throw new \Exception("Failed to write encrypted ACM chunk to storage stream.");
                }
            }
            Storage::move($tempAcmEncryptedPath, $finalAcmPath);


            // 4. Create Database Records
            CapstoneManuscript::create([
                'project_id' => $this->project->id,
                'file_path' => $finalManuscriptPath,
                'acm_path' => $finalAcmPath,
                'project_size' => 0,
                'upload_date' => now(),
            ]);

            // 5. Cleanup on Success and Notify
            Storage::deleteDirectory("private/temp/{$this->user->id}");

            $adminIds = User::where('role', 'Admin')->pluck('id')->all();
            $adminMessage = "User {$this->user->first_name} {$this->user->last_name} 
            has uploaded documents for the project: '{$this->project->title}'.";

            SendNotification::dispatch(null, $adminMessage, $adminIds);

            SendNotification::dispatch(
                $this->user->id,
                "Your project '{$this->project->title}' files have been processed successfully."
            );
        } catch (Throwable $e) {
            Log::error("Job failed for Project ID {$this->project->id}: " . $e->getMessage());
            $this->fail($e);
        } finally {
            // Ensure all file handles are closed, even on failure.
            if (is_resource($sourceManuscriptStream)) fclose($sourceManuscriptStream);
            if (is_resource($destinationEncryptedStream)) fclose($destinationEncryptedStream);
            if (is_resource($sourceAcmStream)) fclose($sourceAcmStream);
            if (is_resource($destinationAcmEncryptedStream)) fclose($destinationAcmEncryptedStream);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        // This method is called by the queue worker when the job fails.
        // It ensures the entire temporary directory for the user is cleaned up.
        Storage::deleteDirectory("private/temp/{$this->user->id}");

        SendNotification::dispatch(
            $this->user->id,
            "Your project '{$this->project->title}' file processing failed. Please try again."
        );
    }
}
