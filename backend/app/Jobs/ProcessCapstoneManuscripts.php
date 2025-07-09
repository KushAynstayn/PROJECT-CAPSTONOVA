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
            // Process Manuscript PDF (Compress -> Encrypt)
            $manuscriptContent = Storage::get($this->tempPaths['manuscript']);
            $compressedManuscript = zstd_compress($manuscriptContent);
            $encryptedManuscript = Crypt::encrypt($compressedManuscript);
            $manuscriptUuid = Str::uuid();
            $finalManuscriptPath = "private/manuscripts/{$manuscriptUuid}.pdf.zst.enc";
            Storage::put($finalManuscriptPath, $encryptedManuscript);

            // Process ACM PDF (Encrypt only)
            $acmContent = Storage::get($this->tempPaths['acm']);
            $encryptedAcm = Crypt::encryptString($acmContent);
            $acmUuid = Str::uuid();
            $finalAcmPath = "private/manuscripts/{$acmUuid}.pdf.enc";
            Storage::put($finalAcmPath, $encryptedAcm);

            
            CapstoneManuscript::create([
                'project_id' => $this->project->id,
                'file_path' => $finalManuscriptPath,
                'acm_path' => $finalAcmPath,
                'project_size' => 0, 
                'upload_date' => now(),
            ]);

            // Clean up temporary files
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