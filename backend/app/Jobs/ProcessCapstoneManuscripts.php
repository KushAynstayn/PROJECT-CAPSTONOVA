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

            // Process Manuscript PDF (Compress -> Encrypt in Chunks)
            $manuscriptContent = Storage::get($this->tempPaths['manuscript']);
            $compressedManuscript = zstd_compress($manuscriptContent);
            $manuscriptUuid = Str::uuid();

            $tempEncryptedPath = "private/temp/{$this->user->id}/{$manuscriptUuid}.tmp";
            $finalManuscriptPath = "private/manuscripts/{$manuscriptUuid}.pdf.zst.enc";
            $chunkSize = 1048576; // 1MB

            // 2. Manuscript Encryption Loop Replacement (Sodium Streaming)
            $sourceCompressedStream = fopen('php://temp', 'r+');
            fwrite($sourceCompressedStream, $compressedManuscript);
            rewind($sourceCompressedStream);

            // -- FIX STARTS HERE --
            // Get the full system path for the temporary file and open a native PHP stream.
            // This is the correct way to get a writable stream for a file in local storage.
            $fullTempPath = Storage::path($tempEncryptedPath);
            // Ensure the directory exists before trying to open the file
            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationEncryptedStream = fopen($fullTempPath, 'wb'); 
            // -- FIX ENDS HERE --

            if ($destinationEncryptedStream === false) {
                throw new \Exception("Could not open a write stream to the destination path: {$fullTempPath}");
            }

            while (!feof($sourceCompressedStream)) {
                $chunk = fread($sourceCompressedStream, $chunkSize);
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunkWithTag = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($chunk, '', $nonce, $sodiumEncryptionKey);

                // Prepend a header with the length of the encrypted chunk and the unique nonce
                $header = pack('N', strlen($encryptedChunkWithTag)) . $nonce;
                
                if (fwrite($destinationEncryptedStream, $header . $encryptedChunkWithTag) === false) {
                    fclose($sourceCompressedStream); // Close streams before throwing
                    fclose($destinationEncryptedStream);
                    throw new \Exception("Failed to write encrypted chunk to storage stream.");
                }
            }
            fclose($sourceCompressedStream);
            fclose($destinationEncryptedStream);

            // Move the file of concatenated encrypted chunks to its final destination
            // Storage::move works correctly here as it operates on the relative path.
            Storage::move($tempEncryptedPath, $finalManuscriptPath);

            // Process ACM PDF (Encrypt only, no chunking) - UNCHANGED
            $acmContent = Storage::get($this->tempPaths['acm']);
            $encryptedAcm = Crypt::encryptString($acmContent);
            $acmUuid = Str::uuid();
            $finalAcmPath = "private/manuscripts/{$acmUuid}.pdf.enc";
            Storage::put($finalAcmPath, $encryptedAcm);


            CapstoneManuscript::create([
                'project_id' => $this->project->id,
                'file_path' => $finalManuscriptPath,
                'acm_path' => $finalAcmPath,
                'project_size' => 0, // Note: Size calculation might need adjustment
                'upload_date' => now(),
            ]);

            // Clean up original temporary files
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