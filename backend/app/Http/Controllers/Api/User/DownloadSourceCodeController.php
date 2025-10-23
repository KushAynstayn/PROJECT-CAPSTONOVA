<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\CapstoneSourceCode;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // Import the Str facade
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class DownloadSourceCodeController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Handle the incoming request to download a source code archive.
     *
     * @param  \App\Models\CapstoneSourceCode  $source_code
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\JsonResponse
     */
    public function __invoke(CapstoneSourceCode $source_code)
    {
        $this->authorize('view', $source_code);
        $filePath = $source_code->file_path;

        if (!$filePath || !Storage::exists($filePath)) {
            return response()->json(['error' => 'Source code file not found.'], 404);
        }

        try {
            $sodiumEncryptionKey = $this->getEncryptionKey();

            // --- DYNAMIC FILE HANDLING ---
            // 1. Check if the file is Zstd compressed (old format)
            $isZstdCompressed = Str::endsWith($filePath, '.zst.enc');

            // 2. Determine the original filename and extension
            $basename = basename($filePath);
            if ($isZstdCompressed) {
                // e.g., "uuid.tar.zst.enc" -> "uuid.tar"
                $originalBase = Str::replaceLast('.zst.enc', '', $basename);
            } else {
                // e.g., "uuid.zip.enc" -> "uuid.zip"
                $originalBase = Str::replaceLast('.enc', '', $basename);
            }

            // Get the final intended extension (e.g., "tar", "zip", "rar")
            $extension = pathinfo($originalBase, PATHINFO_EXTENSION);
            $downloadFilename = "source_code.{$extension}";
            // --- END DYNAMIC FILE HANDLING ---


            $response = new StreamedResponse(function () use ($filePath, $sodiumEncryptionKey, $isZstdCompressed) {
                $sourceStream = Storage::readStream($filePath);

                while (!feof($sourceStream)) {
                    // 1. Read header for chunk length
                    $lengthHeader = fread($sourceStream, 4);
                    if (!$lengthHeader) break;

                    $chunkLength = unpack('N', $lengthHeader)[1];

                    // 2. Read nonce
                    $nonce = fread($sourceStream, SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                    if ($nonce === false) continue;

                    // 3. Read the encrypted chunk
                    $encryptedChunk = fread($sourceStream, $chunkLength);
                    if ($encryptedChunk === false) continue;

                    // 4. Decrypt the chunk
                    $decryptedChunk = sodium_crypto_aead_xchacha20poly1305_ietf_decrypt($encryptedChunk, '', $nonce, $sodiumEncryptionKey);
                    if ($decryptedChunk === false) {
                        // Log an error but try to continue
                        Log::warning("Failed to decrypt chunk for file: {$filePath}");
                        continue;
                    }

                    // 5. Decompress if needed, otherwise output directly
                    if ($isZstdCompressed) {
                        // --- OLD METHOD: Decrypt AND Decompress ---
                        $outputChunk = zstd_uncompress($decryptedChunk);
                    } else {
                        // --- NEW METHOD: Only Decrypt ---
                        $outputChunk = $decryptedChunk;
                    }

                    if ($outputChunk === false) {
                        Log::warning("Failed to decompress zstd chunk for file: {$filePath}");
                        continue;
                    }

                    echo $outputChunk;
                    flush();
                }
                fclose($sourceStream);
            });

            // Set generic headers to force download
            // application/octet-stream is the safest bet for all file types (tar, zip, rar, etc.)
            $response->headers->set('Content-Type', 'application/octet-stream');
            $response->headers->set('Content-Disposition', 'attachment; filename="' . $downloadFilename . '"');
            return $response;
        } catch (Throwable $e) {
            Log::error("Source code download failed for path {$filePath}: " . $e->getMessage());
            return response()->json(['error' => 'Could not process the source code file.'], 500);
        }
    }

    /**
     * Retrieves and decodes the application's encryption key.
     *
     * @return string
     * @throws \Exception
     */
    private function getEncryptionKey(): string
    {
        $key = Config::get('app.key');
        if (str_starts_with($key, 'base64:')) {
            $key = substr($key, 7);
        }
        $decodedKey = base64_decode($key);

        if (strlen($decodedKey) !== SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES) {
            throw new \Exception('Invalid application key length for Sodium decryption.');
        }
        return $decodedKey;
    }
}
