<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Support\Str;
use App\Models\CapstoneProject;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;

class CapstoneProjectController extends Controller
{
    /**
     * Archive the specified capstone project.
     *
     * @param CapstoneProject $project The project instance injected by route-model binding.
     * @return JsonResponse
     */
    public function archive(CapstoneProject $project): JsonResponse
    {

        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $project->is_archived = true;
        $project->save();


        return response()->json([
            'message' => 'Capstone project has been successfully archived.',
            'project' => $project,
        ], 200);
    }

    /**
     * Un-archive the specified capstone project.
     *
     * @param CapstoneProject $project The project instance injected by route-model binding.
     * @return JsonResponse
     */
    public function unarchive(CapstoneProject $project): JsonResponse
    {

        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $project->is_archived = false;
        $project->save();

        return response()->json([
            'message' => 'Capstone project has been successfully un-archived.',
            'project' => $project,
        ], 200);
    }

    /**
     * Retrieve a paginated list of all archived capstone projects.
     *
     * @return JsonResponse
     */
    public function getArchived(): JsonResponse
    {

        $archivedProjects = CapstoneProject::query()
            ->where('is_archived', true)
            ->with([
                'adviser:id,first_name,last_name',
                'keywords:id,keyword_name',
                'sourceCode.programmingLanguages:id,language_name',
                'projectResearcher.user:id,first_name,last_name'
            ])
            ->latest()
            ->paginate(10);

        // Transform the paginated collection to the desired format
        $archivedProjects->through(function ($project) {
            $adviser = $project->adviser;
            $researcher = $project->projectResearcher;
            $leader = $researcher?->user;

            return [
                'id' => $project->id,
                'title' => $project->title,
                'abstract_snippet' => Str::limit($project->abstract, 100),
                'submission_year' => $project->submission_year,
                'platform_type' => $project->platform_type,
                'adviser_name' => $adviser ? "{$adviser->first_name} {$adviser->last_name}" : null,
                'keyword_tags' => $this->formatTags($project->keywords, 'keyword_name'),
                'language_tags' => $this->formatTags($project->sourceCode?->programmingLanguages, 'language_name'),
                'team_roles' => [
                    'leader' => $leader ? "{$leader->first_name} {$leader->last_name}" : null,
                    'hacker' => $researcher->member_hacker ?? null,
                    'hipster1' => $researcher->member_hipster1 ?? null,
                    'hipster2' => $researcher->member_hipster2 ?? null,
                ]
            ];
        });

        return response()->json($archivedProjects);
    }

    /**
     * Helper method to format a collection of tags.
     *
     * @param mixed $collection
     * @param string $key
     * @return array
     */
    private function formatTags($collection, string $key): array
    {
        if (is_null($collection)) {
            return [];
        }

        return $collection->pluck($key)->all();
    }
}
