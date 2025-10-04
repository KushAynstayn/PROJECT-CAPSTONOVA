<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $resetUrl;

    /**
     * Create a new message instance.
     *
     * @param string $token The password reset token.
     * @param string $email The recipient's email address.
     */
    public function __construct(string $token, string $email)
    {
        // Construct the unique password reset URL for the frontend
        $baseUrl = config('app.frontend_url', 'http://localhost:3000');
        $this->resetUrl = "{$baseUrl}/reset-password?token={$token}&email=" . urlencode($email);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Password Reset Link',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Point to the Blade view for the email's body
        return new Content(
            view: 'emails.password-reset',
        );
    }
}
