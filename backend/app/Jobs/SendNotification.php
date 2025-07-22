<?php

namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use InvalidArgumentException;

/**
 * A job to create and send a notification to a user or multiple users.
 */
class SendNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The ID of the user who will receive the notification. Can be null if sending to multiple.
     * @var int|null
     */
    protected ?int $recipientId;

    /**
     * The notification message content.
     * @var string
     */
    protected string $message;

    /**
     * An array of user IDs to receive the notification.
     * @var array
     */
    protected array $recipientIds;

    /**
     * Create a new job instance.
     * This constructor is backward-compatible.
     *
     * @param int|null $recipientId The ID of the single user to notify, or null for multiple.
     * @param string $message The notification message.
     * @param array $recipientIds An array of user IDs for group notifications.
     */
    public function __construct(?int $recipientId, string $message, array $recipientIds = [])
    {
        // Fail early if the parameters are used incorrectly.
        if (is_null($recipientId) && empty($recipientIds)) {
            throw new InvalidArgumentException('You must provide either a single recipient ID or an array of recipient IDs.');
        }
        if (!is_null($recipientId) && !empty($recipientIds)) {
            throw new InvalidArgumentException('You cannot provide both a single recipient ID and an array of recipient IDs.');
        }

        $this->recipientId = $recipientId;
        $this->recipientIds = $recipientIds;
        $this->message = $message;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        // Check if we are sending to a single, specified user.
        if (!is_null($this->recipientId)) {
            // This is the original logic for backward compatibility.
            Notification::create([
                'user_id' => $this->recipientId,
                'message' => $this->message,
                'notification_date' => now(),
                'is_read' => false,
            ]);
        }
        // Otherwise, send to the array of users.
        elseif (!empty($this->recipientIds)) {
            $notifications = [];
            $now = now();

            // Prepare the data for a bulk insert.
            foreach ($this->recipientIds as $userId) {
                $notifications[] = [
                    'user_id' => $userId,
                    'message' => $this->message,
                    'notification_date' => $now,
                    'is_read' => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            // Use a single, efficient query to insert all notifications.
            Notification::insert($notifications);
        }
    }
}
