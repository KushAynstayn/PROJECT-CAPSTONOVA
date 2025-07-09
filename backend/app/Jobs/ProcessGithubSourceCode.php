<?php

namespace App\Jobs;

use App\Models\CapstoneSourceCode;
use App\Models\Notification;
use App\Models\ProgrammingLanguage;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
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

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public int $projectId,
        public array $programmingLanguages,
        public string $githubUrl,
        public ?string $githubToken
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Step 1: Notify the user that the job has started.
        Notification::create([
            'user_id' => $this->user->id,
            'message' => 'Your GitHub repository is now being processed.',
            'notification_date' => now(),
            'is_read' => false,
        ]);
        
        $cloneId = Str::uuid();
        $tempClonePath = storage_path("app/private/temp/{$this->user->id}/{$cloneId}");
        $tempTarPath = storage_path("app/private/temp/{$this->user->id}/{$cloneId}.tar");

        try {
            // Step 2: Process the file.
            $process = new Process(['git', 'clone', '--depth=1', $this->githubUrl, $tempClonePath]);
            $process->run();

            if (!$process->isSuccessful()) {
                if ($this->githubToken) {
                    $cloneUrlWithToken = Str::replaceFirst('https://', "https://{$this->githubToken}@", $this->githubUrl);
                    $process = new Process(['git', 'clone', '--depth=1', $cloneUrlWithToken, $tempClonePath]);
                    $process->run();
                }

                if (!$process->isSuccessful()) {
                    throw new \Exception('Unable to access GitHub repository.');
                }
            }

            $phar = new PharData($tempTarPath);
            $phar->buildFromDirectory($tempClonePath);

            $tarContent = file_get_contents($tempTarPath);
            $compressedContent = zstd_compress($tarContent);
            $encryptedContent = Crypt::encrypt($compressedContent);

            $uuid = Str::uuid();
            $finalPath = "private/source_codes/{$uuid}.tar.zst.enc";
            Storage::put($finalPath, $encryptedContent);
            
            DB::transaction(function () use ($finalPath) {
                // Step 3: AFTER processing, create the new row in 'capstone_source_codes'.
                $sourceCode = CapstoneSourceCode::create([
                    'project_id' => $this->projectId,
                    'file_path' => $finalPath, // The final path of the processed file.
                    'repository_url' => $this->githubUrl,
                    'upload_date' => now(),
                ]);

                // Step 4: Find or create languages and get their IDs.
                $languageIds = [];
                foreach ($this->programmingLanguages as $langName) {
                    $language = ProgrammingLanguage::firstOrCreate(
                        ['language_name' => trim($langName)],
                        ['is_framework' => false]
                    );
                    $languageIds[] = $language->id;
                }

                // Step 5: Now that the source code record exists, populate the pivot table.
                $sourceCode->programmingLanguages()->attach($languageIds);
            });

        } catch (Throwable $e) {
            Log::error("Failed processing GitHub repo for project ID {$this->projectId}: " . $e->getMessage());
            $this->fail($e);
        } finally {
            Storage::deleteDirectory("private/temp/{$this->user->id}/{$cloneId}");
            if (file_exists($tempTarPath)) {
                unlink($tempTarPath);
            }
        }
    }
}