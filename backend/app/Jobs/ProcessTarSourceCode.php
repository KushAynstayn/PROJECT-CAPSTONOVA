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

            // -- REFACTOR STARTS HERE: Zstandard Streaming Compression --

            // 2. Open a read stream to the source TAR file.
            $sourceTarStream = Storage::readStream($this->tempTarPath);
            if ($sourceTarStream === false) {
                throw new \Exception("Could not open read stream for TAR file: {$this->tempTarPath}");
            }

            // This stream will hold the compressed data and will be the input for the encryption stream.
            $compressedDataStream = fopen('php://temp', 'r+');

            // Read the TAR file in chunks, compress each chunk with level 6, and write to the temp stream.
            while (!feof($sourceTarStream)) {
                $chunk = fread($sourceTarStream, $chunkSize);
                $compressedChunk = zstd_compress($chunk, 6);
                fwrite($compressedDataStream, $compressedChunk);
            }
            fclose($sourceTarStream);
            rewind($compressedDataStream);

            // -- REFACTOR ENDS HERE --


            // 3. Sodium Streaming Encryption (Now reads from the compressed stream)
            $uuid = Str::uuid();
            $finalPath = "private/source_codes/{$uuid}.tar.zst.enc";
            $tempEncryptedPath = dirname($this->tempTarPath) . "/{$uuid}.enc.tmp";
            
            $fullTempEncryptedPath = Storage::path($tempEncryptedPath);
            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationEncryptedStream = fopen($fullTempEncryptedPath, 'wb');

            if ($destinationEncryptedStream === false) {
                throw new \Exception("Could not open a write stream to the destination path: {$fullTempEncryptedPath}");
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

            Storage::move($tempEncryptedPath, $finalPath);

            $sizeInBytes = Storage::size($finalPath);
            $sizeInMB = round($sizeInBytes / 1024 / 1024, 2);

            // --- DATABASE LOGIC (UNCHANGED) ---
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

        } catch (Throwable $e) {
            Log::error("Failed processing TAR for project ID {$this->projectId}: " . $e->getMessage());
            $this->fail($e);
        } finally {
            // --- CLEANUP LOGIC (UNCHANGED) ---
            Storage::delete($this->tempTarPath);
        }
    }
}