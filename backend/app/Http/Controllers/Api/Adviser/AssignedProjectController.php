<?php

namespace App\Http\Controllers\Api\Adviser;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * Handles adviser's assigned projects.
 */
class AssignedProjectController extends Controller
{
    /**
     * Display a listing of the adviser's assigned projects.
     *
     * @param Request $request The incoming request.
     * @return JsonResponse A JSON response containing the transformed list of projects.
     */
    public function index(Request $request): JsonResponse
    {
        $adviserId = Auth::id();

        $projects = CapstoneProject::where('adviser_id', $adviserId)
            ->with([
                'keywords',
                // Eager load the researcher relationship AND the user (leader) on that relationship
                'projectResearcher.user',
                'sourceCode.programmingLanguages'
            ])
            ->get();

        $transformedProjects = $projects->map(function (CapstoneProject $project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'abstract_snippet' => Str::limit($project->abstract, 100),
                'platform_type' => $project->platform_type,
                'keyword_tags' => $this->transformTags($project->keywords, 'keyword_name'),
                'language_tags' => $this->transformTags($project->sourceCode?->programmingLanguages, 'language_name'),
                'students' => $this->getStudentNames($project),
            ];
        });

        return response()->json($transformedProjects);
    }

    /**
     * Extracts student names from the project researcher relationship, including the leader.
     *
     * @param CapstoneProject $project
     * @return array
     */
    private function getStudentNames(CapstoneProject $project): array
    {
        $students = [];
        $researcher = $project->projectResearcher;

        if ($researcher) {
            // 1. Add the project leader from the user relationship
            if ($leader = $researcher->user) {
                $students[] = "{$leader->first_name} {$leader->last_name}";
            }

            // 2. Add the other members
            $students[] = $researcher->member_hacker;
            $students[] = $researcher->member_hipster1;
            if ($researcher->member_hipster2) {
                $students[] = $researcher->member_hipster2;
            }
        }

        return $students;
    }

    /**
     * Transforms a collection of tags (keywords/languages) into a displayable array.
     *
     * @param Collection|null $tags
     * @param string $tagNameKey
     * @return array
     */
    private function transformTags(?Collection $tags, string $tagNameKey): array
    {
        if (is_null($tags) || $tags->isEmpty()) {
            return [];
        }

        $count = $tags->count();
        $displayTags = $tags->take(3)->pluck($tagNameKey)->toArray();

        if ($count > 3) {
            $displayTags[] = sprintf('+%d more', $count - 3);
        }

        return $displayTags;
    }
}
