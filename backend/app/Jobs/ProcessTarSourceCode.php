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
use Illuminate\Support\Facades\Config; // Added
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProcessTarSourceCode implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public function __construct(
        public User $user,
        public int $projectId,
        public array $programmingLanguages,
        public string $tempTarPath
    ) {
    }

    /**
     * @throws \Exception
     */
    public function handle(): void
    {
        Notification::create([
            'user_id' => $this->user->id,
            'message' => 'Your TAR file upload is now being processed.',
            'notification_date' => now(),
            'is_read' => false,
        ]);

        try {
            // --- ENCRYPTION REFACTOR STARTS HERE ---

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

            // 2. Prepare content and paths for streaming encryption
            $tarContent = Storage::get($this->tempTarPath);
            $compressedContent = zstd_compress($tarContent);

            $uuid = Str::uuid();
            $finalPath = "private/source_codes/{$uuid}.tar.zst.enc";
            // Create a temporary path within the same directory as the original upload
            $tempEncryptedPath = dirname($this->tempTarPath) . "/{$uuid}.enc.tmp";
            $chunkSize = 1048576; // 1MB

            // 3. Create streams for reading compressed data and writing encrypted data
            $sourceCompressedStream = fopen('php://temp', 'r+');
            fwrite($sourceCompressedStream, $compressedContent);
            rewind($sourceCompressedStream);

            $fullTempEncryptedPath = Storage::path($tempEncryptedPath);
            // The directory should already exist, but this is safe
            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationEncryptedStream = fopen($fullTempEncryptedPath, 'wb');

            if ($destinationEncryptedStream === false) {
                throw new \Exception("Could not open a write stream to the destination path: {$fullTempEncryptedPath}");
            }

            // 4. Encrypt in chunks
            while (!feof($sourceCompressedStream)) {
                $chunk = fread($sourceCompressedStream, $chunkSize);
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunkWithTag = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($chunk, '', $nonce, $sodiumEncryptionKey);

                $header = pack('N', strlen($encryptedChunkWithTag)) . $nonce;

                if (fwrite($destinationEncryptedStream, $header . $encryptedChunkWithTag) === false) {
                    fclose($sourceCompressedStream);
                    fclose($destinationEncryptedStream);
                    throw new \Exception("Failed to write encrypted chunk to storage stream.");
                }
            }
            fclose($sourceCompressedStream);
            fclose($destinationEncryptedStream);

            // 5. Move the completed encrypted file to its final destination
            Storage::move($tempEncryptedPath, $finalPath);

            // --- ENCRYPTION REFACTOR ENDS HERE ---

            $sizeInBytes = Storage::size($finalPath);
            $sizeInMB = round($sizeInBytes / 1024 / 1024, 2);

            // --- DATABASE LOGIC (UNCHANGED) ---
            DB::transaction(function () use ($finalPath, $sizeInMB) {
                // Create the source code record
                $sourceCode = CapstoneSourceCode::create([
                    'project_id' => $this->projectId,
                    'file_path' => $finalPath,
                    'repository_url' => null,
                    'upload_date' => now(),
                ]);

                // Attach programming languages
                $languageIds = [];
                foreach ($this->programmingLanguages as $langName) {
                    $language = ProgrammingLanguage::firstOrCreate(
                        ['language_name' => trim($langName)],
                        ['is_framework' => false]
                    );
                    $languageIds[] = $language->id;
                }
                $sourceCode->programmingLanguages()->attach($languageIds);

                // Find the corresponding manuscript record and update its size
                CapstoneManuscript::where('project_id', $this->projectId)
                    ->update(['project_size' => $sizeInMB]);
            });

        } catch (Throwable $e) {
            Log::error("Failed processing TAR for project ID {$this->projectId}: " . $e->getMessage());
            $this->fail($e);
        } finally {
            // --- CLEANUP LOGIC (UNCHANGED) ---
            Storage::delete($this->tempTarPath);
        }
    }
}