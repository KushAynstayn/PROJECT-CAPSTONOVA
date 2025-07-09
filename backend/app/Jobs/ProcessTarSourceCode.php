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

    public function handle(): void
    {
        Notification::create([
            'user_id' => $this->user->id,
            'message' => 'Your TAR file upload is now being processed.',
            'notification_date' => now(),
            'is_read' => false,
        ]);

        try {
            $tarContent = Storage::get($this->tempTarPath);
            $compressedContent = zstd_compress($tarContent);
            $encryptedContent = Crypt::encrypt($compressedContent);

            $uuid = Str::uuid();
            $finalPath = "private/source_codes/{$uuid}.tar.zst.enc";
            Storage::put($finalPath, $encryptedContent);
            
            $sizeInBytes = Storage::size($finalPath);
            $sizeInMB = round($sizeInBytes / 1024 / 1024, 2);

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
            Storage::delete($this->tempTarPath);
        }
    }
}