<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The full frontend verification URL.
     *
     * @var string
     */
    public string $frontendUrl; // This is what the view will use

    /**
     * Create a new message instance.
     */
    // MODIFIED: Accept individual components
    public function __construct(
        string $id,
        string $hash,
        string $expires,
        string $signature
    ) {
        $baseUrl = config('app.frontend_url', 'http://localhost:3000');

        // MODIFIED: Construct the frontend URL with individual query parameters
        // This matches what your Next.js page is expecting
        $this->frontendUrl = "{$baseUrl}/verify-email?id={$id}&hash={$hash}&expires={$expires}&signature={$signature}";
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Your Email Address',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.verify-email',
        );
    }
}
