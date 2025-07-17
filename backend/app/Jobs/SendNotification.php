<?php

namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * A job to create and send a notification to a user.
 */
class SendNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The ID of the user who will receive the notification.
     *
     * @var int
     */
    protected $recipientId;

    /**
     * The notification message content.
     *
     * @var string
     */
    protected $message;

    /**
     * Create a new job instance.
     *
     * @param int $recipientId The ID of the user to notify.
     * @param string $message The notification message.
     */
    public function __construct(int $recipientId, string $message)
    {
        $this->recipientId = $recipientId;
        $this->message = $message;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        Notification::create([
            'user_id' => $this->recipientId,
            'message' => $this->message,
            'notification_date' => now(),
            'is_read' => false,
        ]);
    }
}
