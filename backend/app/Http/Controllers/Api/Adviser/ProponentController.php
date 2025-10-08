<?php

namespace App\Http\Controllers\Api\Adviser;

use Illuminate\Http\Request;
use App\Models\SystemSetting;
use App\Models\ProjectResearcher;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

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
        $user = Auth::user();
        // Sanitize the role name to match the setting key format (e.g., "Super Admin" -> "superadmin")
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'viewAdvisee' feature is enabled for the user's role
        $settingName = $settingRoleKey . '_viewAdvisee';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        // This check is bypassed if the user is a Super Admin
        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'The ability to view advisees is currently disabled.'
            ], 403);
        }

        $adviserId = $user->id;

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
