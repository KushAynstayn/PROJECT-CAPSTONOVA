<?php

namespace App\Jobs;

use App\Mail\TwoFactorAuthMail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTwoFactorCodeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;
    protected $code;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, int $code)
    {
        $this->user = $user;
        $this->code = $code;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Use the custom Mailable to send the code to the user's decrypted email.
        Mail::to($this->user->encrypted_email)->send(new TwoFactorAuthMail($this->code));
    }
}
