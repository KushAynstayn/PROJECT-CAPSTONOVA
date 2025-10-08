<?php

namespace App\Http\Controllers\Api\Adviser;

use App\Models\User;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use App\Models\SystemSetting;
use App\Jobs\SendNotification;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * Handles suggestion management for advisers.
 */
class SuggestionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'viewOwnSuggestion' feature is enabled
        $settingName = $settingRoleKey . '_viewOwnSuggestion';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false;
        });

        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'The ability to view your suggestions is currently disabled.'
            ], 403);
        }

        $suggestions = Suggestion::where('adviser_id', $user->id)
            ->with('interestedStudent.userDetail') // Eager-load the student and their details
            ->orderBy('submission_date', 'desc')
            ->get();

        // Transform the data to include the student's name, department, and program
        $transformedSuggestions = $suggestions->map(function ($suggestion) {
            $student = $suggestion->interestedStudent;
            $details = $student ? $student->userDetail : null;

            return [
                'suggestion_id' => $suggestion->suggestion_id,
                'adviser_id' => $suggestion->adviser_id,
                'title' => $suggestion->title,
                'suggestion_text' => $suggestion->suggestion_text,
                'submission_date' => $suggestion->submission_date,
                'is_archived' => $suggestion->is_archived,
                'interested_student_id' => $suggestion->interested_student_id,
                'interested_student_name' => $student
                    ? "{$student->first_name} {$student->last_name}"
                    : null,
                'interested_student_department' => $details ? $details->department : null,
                'interested_student_program' => $details ? $details->program : null,
                'created_at' => $suggestion->created_at,
                'updated_at' => $suggestion->updated_at,
            ];
        });

        return response()->json($transformedSuggestions);
    }

    /**
     * Store a newly created suggestion in storage.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse The JSON response with the created suggestion.
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        // Sanitize the role name to match the setting key format (e.g., "Super Admin" -> "superadmin")
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'createSuggestion' feature is enabled for the user's role
        $settingName = $settingRoleKey . '_createSuggestion';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        // This check is bypassed if the user is a Super Admin
        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'The ability to create suggestions is currently disabled.'
            ], 403);
        }

        // 1. Validate the incoming request data.
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'suggestion_text' => 'required|string',
        ]);

        // 2. Create and persist the new suggestion.
        $suggestion = Suggestion::create([
            'adviser_id' => $user->id,
            'title' => $validatedData['title'],
            'suggestion_text' => $validatedData['suggestion_text'],
            'submission_date' => now(),
            'is_archived' => false, // Default value
        ]);

        $adminIds = User::whereIn('role', ['Admin', 'Super Admin'])->pluck('id')->toArray();
        $adviserName = $user->first_name . ' ' . $user->last_name;
        $notificationMessage = "A new suggestion titled '{$suggestion->title}' has been posted by {$adviserName}.";
        SendNotification::dispatch(null, $notificationMessage, $adminIds);

        // 3. Return a success response with the new suggestion data.
        return response()->json([
            'message' => 'Suggestion created successfully.',
            'data' => $suggestion,
        ], 201); // HTTP 201 Created
    }


    /**
     * Update the specified suggestion in storage.
     *
     * @param Request $request
     * @param Suggestion $suggestion
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(Request $request, Suggestion $suggestion): JsonResponse
    {
        // Authorize this action via SuggestionPolicy
        $this->authorize('update', $suggestion);

        // 1. Validate the incoming request data.
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'suggestion_text' => 'required|string',
        ]);

        // 2. Update the suggestion.
        $suggestion->update($validatedData);

        // 3. Return a success response with the updated suggestion data.
        return response()->json([
            'message' => 'Suggestion updated successfully.',
            'data' => $suggestion->fresh(), // Return the fresh model
        ]);
    }

    /**
     * Mark the specified suggestion as archived.
     *
     * @param Suggestion $suggestion The suggestion instance from route model binding.
     * @return JsonResponse The JSON response confirming the action.
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function archive(Suggestion $suggestion): JsonResponse
    {
        // Authorize this action via SuggestionPolicy
        $this->authorize('archive', $suggestion);

        $user = Auth::user();
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'archiveOwnSuggestion' feature is enabled
        $settingName = $settingRoleKey . '_archiveOwnSuggestion';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false;
        });

        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'The ability to archive your suggestions is currently disabled.'
            ], 403);
        }

        // 2. Update the suggestion to be archived.
        $suggestion->update(['is_archived' => true]);

        // 3. Return a success response.
        return response()->json([
            'message' => 'Suggestion archived successfully.',
            'data' => $suggestion,
        ]);
    }
}
