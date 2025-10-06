<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

/**
 * Handles the display of detailed project information.
 */
class ProjectDetailsController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param int $id The ID of the capstone project.
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        // 1. Find the project by ID and eager-load all necessary relationships.
        $project = CapstoneProject::with([
            'adviser', // Load the adviser relationship
            'projectResearcher.user', // Load researcher info and the leader (user)
            'keywords',
            'manuscript', // Eager-load the manuscript relationship
            'sourceCode.programmingLanguages'
        ])->findOrFail($id);

        $user = Auth::user();
        $isAbstractVisible = true;

        // 2. Check permissions only if the user is a guest or a 'Viewer'.
        // All other authenticated roles (Admin, Proponent, etc.) will bypass this.
        if (!$user || $user->role === 'Viewer') {
            $settingName = 'viewer_viewAbstract';
            $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
                $setting = SystemSetting::where('setting_name', $settingName)->first();
                return $setting ? $setting->is_enabled : false; // Default to false
            });

            if (!$isFeatureEnabled) {
                $isAbstractVisible = false;
            }
        }

        $researcher = $project->projectResearcher;
        $leader = $researcher ? $researcher->user : null;

        // 3. Construct the detailed JSON response with a conditional abstract.
        return response()->json([
            'id' => $project->id,
            'title' => $project->title,
            // Conditionally show the abstract or a disabled message.
            'abstract' => $isAbstractVisible
                ? $project->abstract
                : 'Viewing project abstracts is currently disabled by an administrator.',
            'submission_date' => $project->submission_date,
            'submission_year' => $project->submission_year,
            'platform_type' => $project->platform_type,
            'is_archived' => (bool) $project->is_archived,
            'adviser' => $project->adviser ? "{$project->adviser->first_name} {$project->adviser->last_name}" : null,
            'manuscript_id' => $project->manuscript?->manuscript_id,
            'source_code_id' => $project->sourceCode?->id,
            'team_roles' => [
                'leader' => $leader ? "{$leader->first_name} {$leader->last_name}" : null,
                'hacker' => $researcher->member_hacker ?? null,
                'hipster1' => $researcher->member_hipster1 ?? null,
                'hipster2' => $researcher->member_hipster2 ?? null,
            ],
            'keyword_tags' => $project->keywords->pluck('keyword_name'),
            'language_tags' => $project->sourceCode?->programmingLanguages->pluck('language_name') ?? [],
        ]);
    }
}
