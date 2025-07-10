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
     */
    public function handle(): void
    {
        try {
            // Process Manuscript PDF (Compress -> Encrypt in Chunks)
            $manuscriptContent = Storage::get($this->tempPaths['manuscript']);
            $compressedManuscript = zstd_compress($manuscriptContent);
            $manuscriptUuid = Str::uuid();
            
            $tempEncryptedPath = "private/temp/{$this->user->id}/{$manuscriptUuid}.tmp";
            $finalManuscriptPath = "private/manuscripts/{$manuscriptUuid}.pdf.zst.enc";
            $chunkSize = 1048576; // 1MB

            // Create a temporary stream for the compressed content
            $stream = fopen('php://temp', 'r+');
            fwrite($stream, $compressedManuscript);
            rewind($stream);

            // Create an empty file in storage to append chunks to
            Storage::put($tempEncryptedPath, '');

            // Read the stream in chunks, encrypt, and append to the temp file
            while (!feof($stream)) {
                $chunk = fread($stream, $chunkSize);
                $encryptedChunk = Crypt::encrypt($chunk);
                // Append the encrypted chunk followed by a newline to act as a delimiter
                Storage::append($tempEncryptedPath, $encryptedChunk . PHP_EOL);
            }
            fclose($stream);
            
            // Move the file of concatenated encrypted chunks to its final destination
            Storage::move($tempEncryptedPath, $finalManuscriptPath);

            // Process ACM PDF (Encrypt only, no chunking)
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