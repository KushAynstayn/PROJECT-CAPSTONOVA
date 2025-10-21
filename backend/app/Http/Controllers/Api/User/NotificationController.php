<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class NotificationController extends Controller
{
    /**
     * Get notifications for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
            'message' => 'Notifications retrieved successfully'
        ]);
    }

    /**
     * Mark a specific notification as read.
     *
     * @param Request $request
     * @param Notification $notification
     * @return JsonResponse
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        // Ensure the authenticated user can only mark their own notifications as read.
        if ($request->user()->id !== $notification->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Update the notification status if it is not already read.
        if (!$notification->is_read) {
            $notification->is_read = true;
            $notification->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read.',
            'data' => $notification
        ]);
    }
}
