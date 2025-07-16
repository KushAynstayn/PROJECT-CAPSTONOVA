<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use Illuminate\Http\JsonResponse;

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
            'projectResearcher.user', // Load researcher info and the leader (user)
            'keywords',
            'manuscript', // Eager-load the manuscript relationship
            'sourceCode.programmingLanguages'
        ])->findOrFail($id);

        $researcher = $project->projectResearcher;
        $leader = $researcher ? $researcher->user : null;

        // 2. Construct the detailed JSON response.
        return response()->json([
            'id' => $project->id,
            'title' => $project->title,
            'abstract' => $project->abstract,
            'submission_date' => $project->submission_date,
            'submission_year' => $project->submission_year,
            'platform_type' => $project->platform_type,
            'is_archived' => (bool) $project->is_archived,
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
