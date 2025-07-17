<?php

namespace App\Http\Controllers\Api\Adviser;

use App\Http\Controllers\Controller;
use App\Models\ProjectResearcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Handles listing of proponents assigned to an adviser.
 */
class ProponentController extends Controller
{
    /**
     * Display a listing of the adviser's assigned proponents.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $adviserId = Auth::id();

        // Query ProjectResearcher records where the associated project's adviser_id
        // matches the currently authenticated adviser.
        $proponentsData = ProjectResearcher::whereHas('project', function ($query) use ($adviserId) {
            $query->where('adviser_id', $adviserId);
        })->with('user.userDetail')->get(); // Eager-load the user (proponent) and their details

        // Transform the collection into the desired JSON structure.
        $transformedProponents = $proponentsData->map(function (ProjectResearcher $researcher) {
            $user = $researcher->user;
            $userDetail = $user?->userDetail;

            // Skip if the user relationship is somehow broken
            if (!$user) {
                return null;
            }

            return [
                'id' => $user->id,
                'full_name' => trim("{$user->first_name} {$user->last_name}"),
                'department' => $userDetail?->department,
                'program' => $userDetail?->program,
                'team_roles' => [
                    'hacker' => $researcher->member_hacker,
                    'hipster1' => $researcher->member_hipster1,
                    'hipster2' => $researcher->member_hipster2,
                ],
            ];
        })->filter(); // Remove any null entries from the final collection

        return response()->json($transformedProponents);
    }
}
