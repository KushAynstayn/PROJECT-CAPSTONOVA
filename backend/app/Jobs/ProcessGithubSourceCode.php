<?php

namespace App\Jobs;

use App\Models\CapstoneManuscript;
use App\Models\CapstoneSourceCode;
use App\Models\Notification;
use App\Models\ProgrammingLanguage;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Filesystem\Filesystem; // Import the powerful Filesystem class
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PharData;
use Symfony\Component\Process\Process;
use Throwable;

class ProcessGithubSourceCode implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public function __construct(
        public User $user,
        public int $projectId,
        public array $programmingLanguages,
        public string $githubUrl,
        public ?string $githubToken
    ) {
    }

    /**
     * @throws \Exception
     */
    public function handle(): void
    {
        Notification::create([
            'user_id' => $this->user->id,
            'message' => 'Your GitHub repository is now being processed.',
            'notification_date' => now(),
            'is_read' => false,
        ]);
        
        $cloneId = Str::uuid();
        $tempClonePath = storage_path("app/private/temp/{$this->user->id}/{$cloneId}");
        $tempTarPath = storage_path("app/private/temp/{$this->user->id}/{$cloneId}.tar");
        
        $tempEncryptedPath = null; 

        try {
            // All the processing logic (git clone, tar, compress, encrypt) remains the same.
            // ...
            // --- GIT CLONE LOGIC (UNCHANGED) ---
            $process = new Process(['git', 'clone', '--depth=1', $this->githubUrl, $tempClonePath]);
            $process->run();

            if (!$process->isSuccessful()) {
                if ($this->githubToken) {
                    $cloneUrlWithToken = Str::replaceFirst('https://', "https://{$this->githubToken}@", $this->githubUrl);
                    $process = new Process(['git', 'clone', '--depth=1', $cloneUrlWithToken, $tempClonePath]);
                    $process->run();
                }

                if (!$process->isSuccessful()) {
                    throw new \Exception('Unable to access GitHub repository. Please check the URL and token if it is a private repository.');
                }
            }

            // --- TAR CREATION LOGIC (UNCHANGED) ---
            $phar = new PharData($tempTarPath);
            $phar->buildFromDirectory($tempClonePath);

            // --- Zstandard Streaming Compression (UNCHANGED) ---
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
            $chunkSize = 1048576;
            $sourceTarStream = fopen($tempTarPath, 'rb');
            if ($sourceTarStream === false) {
                throw new \Exception("Could not open read stream for TAR file: {$tempTarPath}");
            }
            $compressedDataStream = fopen('php://temp', 'r+');
            while (!feof($sourceTarStream)) {
                $chunk = fread($sourceTarStream, $chunkSize);
                $compressedChunk = zstd_compress($chunk, 6);
                fwrite($compressedDataStream, $compressedChunk);
            }
            fclose($sourceTarStream);
            rewind($compressedDataStream);

            // --- Sodium Streaming Encryption (UNCHANGED) ---
            $uuid = Str::uuid();
            $finalPath = "private/source_codes/{$uuid}.tar.zst.enc";
            $tempEncryptedPath = "private/temp/{$this->user->id}/{$uuid}.enc.tmp";
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
                    'repository_url' => $this->githubUrl,
                    'upload_date' => now(),
                ]);
                $languageIds = [];
                foreach ($this->programmingLanguages as $langName) {
                    $language = ProgrammingLanguage::firstOrCreate(['language_name' => trim($langName)],['is_framework' => false]);
                    $languageIds[] = $language->id;
                }
                $sourceCode->programmingLanguages()->attach($languageIds);
                CapstoneManuscript::where('project_id', $this->projectId)->update(['project_size' => $sizeInMB]);
            });

        } catch (Throwable $e) {
            Log::error("Failed processing GitHub repo for project ID {$this->projectId}: " . $e->getMessage());
            $this->fail($e);
        } finally {
            // --- ENHANCED CLEANUP LOGIC FOR GITHUB CLONE DIRECTORIES ---
            $filesystem = new Filesystem();
            
            try {
                // 1. Force delete the cloned repository directory (including .git and read-only files)
                if ($filesystem->isDirectory($tempClonePath)) {
                    $this->makeDirectoryWritable($tempClonePath, $filesystem);
                    $filesystem->deleteDirectory($tempClonePath);
                }

                // 2. Always delete the TAR archive if it still exists
                if ($filesystem->exists($tempTarPath)) {
                    $filesystem->delete($tempTarPath);
                }

                // 3. Always delete the temporary encrypted file if it still exists
                if ($tempEncryptedPath && Storage::exists($tempEncryptedPath)) {
                    Storage::delete($tempEncryptedPath);
                }

                // 4. Clean up empty parent directories if they exist
                $userTempDir = storage_path("app/private/temp/{$this->user->id}");
                if ($filesystem->isDirectory($userTempDir) && $this->isDirectoryEmpty($userTempDir, $filesystem)) {
                    $filesystem->deleteDirectory($userTempDir);
                }

            } catch (Throwable $cleanupException) {
                // Don't throw here - we don't want cleanup failures to fail the job
            }
        }
    }

    /**
     * Make all files and directories writable recursively
     * This is especially important for .git directories which often have read-only files
     */
    private function makeDirectoryWritable(string $path, Filesystem $filesystem): void
    {
        if (!$filesystem->isDirectory($path)) {
            return;
        }

        try {
            chmod($path, 0755);

            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::CHILD_FIRST
            );

            foreach ($iterator as $file) {
                $filePath = $file->getPathname();
                
                if ($file->isDir()) {
                    chmod($filePath, 0755);
                } else {
                    chmod($filePath, 0644);
                }
            }
        } catch (Throwable $e) {
            // Silently continue if chmod fails
        }
    }

    /**
     * Check if directory is empty (no files or subdirectories)
     */
    private function isDirectoryEmpty(string $path, Filesystem $filesystem): bool
    {
        if (!$filesystem->isDirectory($path)) {
            return true;
        }

        $files = $filesystem->allFiles($path);
        $directories = $filesystem->directories($path);

        return empty($files) && empty($directories);
    }
}