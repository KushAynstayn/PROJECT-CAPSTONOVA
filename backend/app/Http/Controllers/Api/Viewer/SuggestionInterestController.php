<?php

namespace App\Http\Controllers\Api\Viewer;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

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

        return response()->json($suggestion);
    }
}
