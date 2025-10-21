<?php

namespace App\Jobs;

use App\Mail\VerificationEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendVerificationEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    // MODIFIED: Accept individual string components
    public function __construct(
        protected string $email,
        protected string $id,
        protected string $hash,
        protected string $expires,
        protected string $signature
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // MODIFIED: Pass all components to the mailable
            Mail::to($this->email)->send(new VerificationEmail(
                $this->id,
                $this->hash,
                $this->expires,
                $this->signature
            ));
        } catch (\Exception $e) {
            Log::error("Failed to send verification email to {$this->email}: " . $e->getMessage());
        }
    }
}
