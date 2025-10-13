<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
        // (This method remains unchanged)
        $project = CapstoneProject::with([
            'adviser',
            'projectResearcher.user',
            'keywords',
            'manuscript',
            'sourceCode.programmingLanguages'
        ])->findOrFail($id);

        $user = Auth::user();
        $isAbstractVisible = true;

        if (!$user || $user->role === 'Viewer') {
            $settingName = 'viewer_viewAbstract';
            $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
                $setting = SystemSetting::where('setting_name', $settingName)->first();
                return $setting ? $setting->is_enabled : false;
            });

            if (!$isFeatureEnabled) {
                $isAbstractVisible = false;
            }
        }

        $researcher = $project->projectResearcher;
        $leader = $researcher ? $researcher->user : null;

        return response()->json([
            'id' => $project->id,
            'title' => $project->title,
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

    /**
     *
     * @param int $id The ID of the primary capstone project.
     * @return JsonResponse
     */
    public function getRelatedStudies(int $id): JsonResponse
    {
        // 1. Find the original project and its keywords.
        $project = CapstoneProject::with('keywords')->findOrFail($id);
        $keywordIds = $project->keywords->pluck('id');

        if ($keywordIds->isEmpty()) {
            return response()->json([]);
        }

        // 2. Find related projects and eager-load all necessary data.
        $relatedProjects = CapstoneProject::query()
            ->select('capstone_projects.*', DB::raw('count(project_keywords.keyword_id) as matching_keywords'))
            ->join('project_keywords', 'capstone_projects.id', '=', 'project_keywords.project_id')
            ->whereIn('project_keywords.keyword_id', $keywordIds)
            ->where('capstone_projects.id', '!=', $id)
            // MODIFIED: Eager-load all relationships needed for the response in one go.
            ->with(['adviser', 'keywords', 'sourceCode.programmingLanguages'])
            ->groupBy('capstone_projects.id')
            ->orderByDesc('matching_keywords')
            ->orderByDesc('submission_year')
            ->limit(5)
            ->get();

        // 3. Format the data for front-end suggestion cards.
        $formattedProjects = $relatedProjects->map(function ($relatedProject) {
            return [
                'id' => $relatedProject->id,
                'title' => $relatedProject->title,
                'submission_year' => $relatedProject->submission_year,
                'adviser' => $relatedProject->adviser ? "{$relatedProject->adviser->first_name} {$relatedProject->adviser->last_name}" : null,
                'abstract_snippet' => Str::limit($relatedProject->abstract, 150, '...'),
                // NEW: Add keyword and language tags to the response.
                'keyword_tags' => $relatedProject->keywords->pluck('keyword_name'),
                'language_tags' => $relatedProject->sourceCode?->programmingLanguages->pluck('language_name') ?? [],
            ];
        });

        return response()->json($formattedProjects);
    }
}
