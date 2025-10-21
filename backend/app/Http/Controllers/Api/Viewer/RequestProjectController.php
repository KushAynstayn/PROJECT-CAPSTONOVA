<?php

namespace App\Http\Controllers\Api\Viewer;

use App\Models\User;
use App\Models\UserLog;
use App\Models\ActionType;
use App\Models\ViewerAccess;
use Illuminate\Http\Request;
use App\Models\SystemSetting;
use App\Jobs\SendNotification;
use App\Models\CapstoneProject;
use App\Models\DocumentRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class RequestProjectController extends Controller
{

    /**
     * Display a listing of the capstone projects the viewer has access to.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $viewerId = Auth::id();

        // Retrieve the viewer's accessed projects, filtering for active grants.
        $accessedProjects = ViewerAccess::where('user_id', $viewerId)
            ->where(function ($query) {
                $query->where('expiry_date', '>', now())
                    ->orWhereNull('expiry_date');
            })
            ->with([
                'project.adviser',
                'project.projectResearcher.user.userDetail',
                'project.projectResearcher.panel', // Eager-load the panel relationship
                'project.manuscript'
            ])
            ->get();

        // Transform the data to create a clean and structured response.
        $formattedProjects = $accessedProjects->map(function ($access) {
            $project = $access->project;
            $researcherInfo = $project->projectResearcher;
            $mainProponent = $researcherInfo->user;
            $panel = $researcherInfo?->panel; // Get panel data from the researcher info

            // MODIFIED: Prepend the project leader to the authors list.
            $authors = collect([
                $researcherInfo->member_hacker,
                $researcherInfo->member_hipster1,
                $researcherInfo->member_hipster2
            ])->filter()->prepend($mainProponent->first_name . ' ' . $mainProponent->last_name)->all();

            return [
                'access_id' => $access->access_id,
                'project_id' => $project->id,
                'project_title' => $project->title,
                'submission_year' => $project->submission_year,
                'adviser_name' => $project->adviser ? $project->adviser->first_name . ' ' . $project->adviser->last_name : 'N/A',
                'project_authors' => $authors,
                'department' => $mainProponent->userDetail->department ?? 'N/A',
                'program' => $mainProponent->userDetail->program ?? 'N/A',
                'manuscript_id' => $project->manuscript->manuscript_id ?? null,
                'grant_date' => $access->grant_date,
                'expiry_date' => $access->expiry_date,
                // NEW: Add panel members to the response.
                'panel_members' => $panel ? [
                    'panelist1' => $panel->panel_member_1,
                    'panelist2' => $panel->panel_member_2,
                    'panelist3' => $panel->panel_member_3,
                ] : null,
            ];
        });

        return response()->json($formattedProjects);
    }

    /**
     * Store a newly created document request in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $project_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $project_id)
    {
        // (This method remains unchanged)
        $user = $request->user();
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        $settingName = $settingRoleKey . '_requestFullAccess';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false;
        });

        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'The ability to request project access is currently disabled.'
            ], 403);
        }

        $project = CapstoneProject::findOrFail($project_id);

        $existingRequest = DocumentRequest::where('viewer_id', $user->id)
            ->where('project_id', $project->id)
            ->first();

        if ($existingRequest) {
            return response()->json(['message' => 'You have already requested access to this project.'], 409);
        }

        $documentRequest = DocumentRequest::create([
            'viewer_id' => $user->id,
            'project_id' => $project->id,
            'request_date' => now(),
            'status' => 'pending',
        ]);

        $superAdminIds = User::where('role', 'Super Admin')->pluck('id')->toArray();
        $userName = $user->first_name . ' ' . $user->last_name;
        $notificationMessage = "User {$userName} has requested access to the project: '{$project->title}'.";

        // MODIFIED: Added a title to the notification dispatch.
        SendNotification::dispatch('New Project Access Request', $notificationMessage, null, $superAdminIds);

        $actionType = ActionType::firstOrCreate(['action_name' => 'request_project_access']);
        UserLog::create([
            'user_id' => $user->id,
            'action_type_id' => $actionType->id,
            'details' => "User requested access to project '{$project->title}' (ID: {$project->id})."
        ]);

        return response()->json($documentRequest, 201);
    }
}
