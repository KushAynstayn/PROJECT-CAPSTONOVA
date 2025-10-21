<?php

namespace App\Http\Controllers\Api\Viewer;

use App\Models\Suggestion;
use Illuminate\Http\Request;
use App\Jobs\SendNotification;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\ActionType;
use App\Models\UserLog;

class SuggestionInterestController extends Controller
{
    use AuthorizesRequests;
    /**
     * Mark the authenticated user as interested in a suggestion.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id The ID of the suggestion.
     * @return \Illuminate\Http\JsonResponse
     */
    public function expressInterest(Request $request, $id)
    {
        $suggestion = Suggestion::findOrFail($id);


        if ($suggestion->interested_student_id !== null) {
            return response()->json(['message' => 'Another student is already interested in this suggestion.'], 409);
        }

        $suggestion->interested_student_id = $request->user()->id;
        $suggestion->save();

        $studentName = $request->user()->first_name . ' ' . $request->user()->last_name;
        $notificationMessage = "A student, {$studentName}, has expressed interest in your suggestion: '{$suggestion->title}'.";

        // MODIFIED: Added a title to the notification dispatch.
        SendNotification::dispatch('New Interest in Suggestion', $notificationMessage, $suggestion->adviser_id);

        $actionType = ActionType::firstOrCreate(['action_name' => 'express_interest']);
        UserLog::create([
            'user_id' => $request->user()->id,
            'action_type_id' => $actionType->id,
            'details' => "User expressed interest in suggestion '{$suggestion->title}' (ID: {$suggestion->suggestion_id})."
        ]);

        return response()->json($suggestion);
    }


    /**
     * Remove the authenticated user's interest from a suggestion.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id The ID of the suggestion.
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeInterest(Request $request, $id)
    {
        $suggestion = Suggestion::findOrFail($id);
        $this->authorize('removeInterest', $suggestion);

        $suggestion = Suggestion::findOrFail($id);
        $viewerId = $request->user()->id;

        // Check that the user is actually the one interested before removing interest.
        if ($suggestion->interested_student_id !== $viewerId) {
            return response()->json(['message' => 'You are not the user currently interested in this suggestion.'], 403);
        }

        // Remove the viewer's ID from the suggestion.
        $suggestion->interested_student_id = null;
        $suggestion->save();

        $actionType = ActionType::firstOrCreate(['action_name' => 'remove_interest']);
        UserLog::create([
            'user_id' => $request->user()->id,
            'action_type_id' => $actionType->id,
            'details' => "User removed interest from suggestion '{$suggestion->title}' (ID: {$suggestion->suggestion_id})."
        ]);

        return response()->json($suggestion);
    }
}
