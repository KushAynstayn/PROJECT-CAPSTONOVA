<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Models\ProjectAttachment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;
use App\Jobs\SendNotification; // ADDED
use App\Models\CapstoneProject; // ADDED

class ProcessUserManual implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public function __construct(
        public User $user,
        public int $projectId,
        public string $tempFilePath
    ) {}

    public function handle(): void
    {
        // MODIFIED: Use the SendNotification job with a title
        SendNotification::dispatch(
            'Processing User Manual',
            'Your user manual upload is now being processed.',
            $this->user->id
        );

        $sourceStream = null;
        $destinationStream = null;
        $tempEncryptedPath = null;

        try {
            // 1. Prepare Encryption Key
            $key = base64_decode(substr(Config::get('app.key'), 7));
            if (strlen($key) !== SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES) {
                throw new \Exception('Invalid application key length for Sodium encryption.');
            }

            // 2. Stream, Encrypt, and Store
            $sourceStream = Storage::readStream($this->tempFilePath);
            if (!$sourceStream) {
                throw new \Exception("Could not open read stream for temp file: {$this->tempFilePath}");
            }

            $originalExtension = pathinfo(Storage::path($this->tempFilePath), PATHINFO_EXTENSION);
            $finalPath = "private/user_manuals/" . Str::uuid() . ".{$originalExtension}.enc";
            $tempEncryptedPath = dirname($this->tempFilePath) . "/" . Str::uuid() . ".enc.tmp";

            Storage::makeDirectory(dirname($tempEncryptedPath));
            $destinationStream = fopen(Storage::path($tempEncryptedPath), 'wb');
            if (!$destinationStream) {
                throw new \Exception("Could not open write stream to temp encrypted path: {$tempEncryptedPath}");
            }

            $chunkSize = 1048576; // 1MB
            while (!feof($sourceStream)) {
                $chunk = fread($sourceStream, $chunkSize);
                $nonce = random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);
                $encryptedChunk = sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($chunk, '', $nonce, $key);

                $header = pack('N', strlen($encryptedChunk)) . $nonce;
                if (fwrite($destinationStream, $header . $encryptedChunk) === false) {
                    throw new \Exception("Failed to write encrypted chunk to stream.");
                }
            }

            fclose($sourceStream);
            fclose($destinationStream);
            $sourceStream = null;
            $destinationStream = null;

            Storage::move($tempEncryptedPath, $finalPath);

            // 3. Update Database
            DB::transaction(function () use ($finalPath) {
                ProjectAttachment::updateOrCreate(
                    ['project_id' => $this->projectId],
                    ['user_manual_path' => $finalPath]
                );
            });

            // --- ADDED: Success Notifications ---
            $project = CapstoneProject::find($this->projectId);

            $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->all();
            $adminMessage = "User {$this->user->first_name} {$this->user->last_name} has uploaded a user manual for the project: '{$project->title}'.";
            SendNotification::dispatch('New User Manual Submission', $adminMessage, null, $adminIds);

            if ($this->user->userDetail && $this->user->userDetail->adviser_id) {
                $adviserMessage = "Your advisee, {$this->user->first_name} {$this->user->last_name}, has uploaded a user manual for the project: '{$project->title}'.";
                SendNotification::dispatch('Advisee User Manual Submission', $adviserMessage, $this->user->userDetail->adviser_id);
            }

            SendNotification::dispatch(
                'File Processing Complete',
                "Your user manual for project '{$project->title}' has been successfully uploaded and secured.",
                $this->user->id
            );
        } catch (Throwable $e) {
            Log::error("Failed processing user manual for project ID {$this->projectId}: " . $e->getMessage());
            // REMOVED: Notification creation is now handled by the failed() method.
            $this->fail($e);
        } finally {
            if (is_resource($sourceStream)) fclose($sourceStream);
            if (is_resource($destinationStream)) fclose($destinationStream);
            if (Storage::exists($this->tempFilePath)) Storage::delete($this->tempFilePath);
            if ($tempEncryptedPath && Storage::exists($tempEncryptedPath)) Storage::delete($tempEncryptedPath);
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Throwable $exception): void
    {
        // ADDED: Failure notification logic
        $project = CapstoneProject::find($this->projectId);
        SendNotification::dispatch(
            'File Processing Failed',
            "Processing your user manual for project '{$project->title}' failed. Please try again.",
            $this->user->id
        );
    }
}
