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
use Illuminate\Support\Facades\Crypt;
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
    ) {
    }

    /**
     * Execute the job.
     * @throws \Exception
     */
    public function handle(): void
    {
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

            // 2. Process Manuscript PDF (Stream Compress -> Stream Encrypt)
            $sourceManuscriptStream = Storage::readStream($this->tempPaths['manuscript']);
            if ($sourceManuscriptStream === false) {
                throw new \Exception('Could not open a read stream for the manuscript.');
            }

            $compressedDataStream = fopen('php://temp', 'r+');
            while (!feof($sourceManuscriptStream)) {
                $chunk = fread($sourceManuscriptStream, $chunkSize);
                $compressedChunk = zstd_compress($chunk, 6);
                fwrite($compressedDataStream, $compressedChunk);
            }
            fclose($sourceManuscriptStream);
            rewind($compressedDataStream);

            $manuscriptUuid = Str::uuid();
            $tempEncryptedPath = "private/temp/{$this->user->id}/{$manuscriptUuid}.tmp";
            $finalManuscriptPath = "private/manuscripts/{$manuscriptUuid}.pdf.zst.enc";
            $fullTempPath = Storage::path($tempEncryptedPath);
            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationEncryptedStream = fopen($fullTempPath, 'wb');

            if ($destinationEncryptedStream === false) {
                throw new \Exception("Could not open a write stream to the destination path: {$fullTempPath}");
            }

            while (!feof($compressedDataStream)) {
                $chunk = fread($compressedDataStream, $chunkSize);
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunkWithTag = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($chunk, '', $nonce, $sodiumEncryptionKey);
                $header = pack('N', strlen($encryptedChunkWithTag)) . $nonce;
                if (fwrite($destinationEncryptedStream, $header . $encryptedChunkWithTag) === false) {
                    fclose($compressedDataStream);
                    fclose($destinationEncryptedStream);
                    throw new \Exception("Failed to write encrypted chunk to storage stream.");
                }
            }
            fclose($compressedDataStream);
            fclose($destinationEncryptedStream);
            Storage::move($tempEncryptedPath, $finalManuscriptPath);

            // -- REFACTOR STARTS HERE: ACM PDF Sodium Streaming Encryption --

            // 3. Process ACM PDF (Stream Encrypt)
            $sourceAcmStream = Storage::readStream($this->tempPaths['acm']);
            if ($sourceAcmStream === false) {
                throw new \Exception('Could not open a read stream for the ACM file.');
            }

            $acmUuid = Str::uuid();
            $tempAcmEncryptedPath = "private/temp/{$this->user->id}/{$acmUuid}.tmp";
            $finalAcmPath = "private/manuscripts/{$acmUuid}.pdf.enc";
            $fullTempAcmPath = Storage::path($tempAcmEncryptedPath);
            Storage::makeDirectory(dirname($tempAcmEncryptedPath)); // Directory should already exist, but this is safe
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
                    fclose($sourceAcmStream);
                    fclose($destinationAcmEncryptedStream);
                    throw new \Exception("Failed to write encrypted ACM chunk to storage stream.");
                }
            }
            fclose($sourceAcmStream);
            fclose($destinationAcmEncryptedStream);
            Storage::move($tempAcmEncryptedPath, $finalAcmPath);

            // -- REFACTOR ENDS HERE --

            // 4. Create Database Records (Unchanged)
            CapstoneManuscript::create([
                'project_id' => $this->project->id,
                'file_path' => $finalManuscriptPath,
                'acm_path' => $finalAcmPath,
                'project_size' => 0,
                'upload_date' => now(),
            ]);

            // 5. Cleanup and Notify (Unchanged)
            Storage::deleteDirectory("private/temp/{$this->user->id}");

            Notification::create([
                'user_id' => $this->user->id,
                'message' => "Your project '{$this->project->title}' file processing succeeded.",
                'notification_date' => now(),
            ]);

        } catch (Throwable $e) {
            Log::error("Job failed for Project ID {$this->project->id}: " . $e->getMessage());
            $this->fail($e);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        // Clean up temporary files on failure
        Storage::deleteDirectory("private/temp/{$this->user->id}");

        Notification::create([
            'user_id' => $this->user->id,
            'message' => "Your project '{$this->project->title}' file processing failed: " . $exception->getMessage(),
            'notification_date' => now(),
        ]);
    }
}