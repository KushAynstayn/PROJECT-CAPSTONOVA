<?php

namespace App\Http\Controllers\Api\Proponent;

use Throwable;
use App\Models\CapstoneManuscript;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class StreamManuscriptController extends Controller
{
    use AuthorizesRequests;
    /**
     * Handle the incoming request to stream a manuscript.
     *
     * @param  \App\Models\CapstoneManuscript  $manuscript
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\JsonResponse
     */
    public function __invoke(CapstoneManuscript $manuscript)
    {

        $this->authorize('view', $manuscript);
        $filePath = $manuscript->file_path;

        if (!Storage::exists($filePath)) {
            return response()->json(['error' => 'Manuscript file not found.'], 404);
        }

        try {
            $sodiumEncryptionKey = $this->getEncryptionKey();

            $response = new StreamedResponse(function () use ($filePath, $sodiumEncryptionKey) {
                $sourceStream = Storage::readStream($filePath);

                while (!feof($sourceStream)) {
                    // 1. Read header for chunk length
                    $lengthHeader = fread($sourceStream, 4);
                    if (!$lengthHeader) break;

                    $chunkLength = unpack('N', $lengthHeader)[1];

                    // 2. Read nonce
                    $nonce = fread($sourceStream, SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);

                    // 3. Read the encrypted chunk
                    $encryptedChunk = fread($sourceStream, $chunkLength);
                    if ($encryptedChunk === false) continue;

                    // 4. Decrypt the chunk
                    $decryptedChunk = sodium_crypto_aead_xchacha20poly1305_ietf_decrypt($encryptedChunk, '', $nonce, $sodiumEncryptionKey);
                    if ($decryptedChunk === false) continue;

                    // 5. Decompress the decrypted chunk and output
                    $decompressedChunk = zstd_uncompress($decryptedChunk);
                    echo $decompressedChunk;

                    flush();
                }
                fclose($sourceStream);
            });

            $response->headers->set('Content-Type', 'application/pdf');
            $response->headers->set('Content-Disposition', 'inline; filename="manuscript.pdf"');
            return $response;
        } catch (Throwable $e) {
            Log::error("Manuscript streaming failed for path {$filePath}: " . $e->getMessage());
            return response()->json(['error' => 'Could not process the manuscript file.'], 500);
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
