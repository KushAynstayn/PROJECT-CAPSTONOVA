<?php

namespace App\Http\Controllers\Api\Viewer;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class FeaturedProjectController extends Controller
{
    /**
     * Get a list of featured capstone projects for a carousel.
     *
     * This combines the latest, most requested, and random projects,
     * ensures uniqueness, and returns a list of 10.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFeaturedProjects(Request $request)
    {
        // Define the relationships to eager-load
        // Updated: Added 'projectResearcher.user' to fetch the Leader's info
        $relations = [
            'projectResearcher.panel',
            'projectResearcher.user',
            'adviser',
            'platformTypes'
        ];

        // 1. Get 5 Latest Projects
        $latestProjects = CapstoneProject::with($relations)
            ->where('is_archived', false)
            ->orderBy('submission_date', 'desc')
            ->limit(5)
            ->get();

        // 2. Get 5 Most Requested Projects
        $mostRequestedProjects = CapstoneProject::with($relations)
            ->withCount('documentRequests') // Creates 'document_requests_count' attribute
            ->where('is_archived', false)
            ->orderBy('document_requests_count', 'desc')
            ->limit(5)
            ->get();

        // 3. Get 5 Random Projects
        $randomProjects = CapstoneProject::with($relations)
            ->where('is_archived', false)
            ->inRandomOrder()
            ->limit(5)
            ->get();

        // 4. Combine, ensure uniqueness, and get up to 10
        $allProjects = $latestProjects
            ->merge($mostRequestedProjects)
            ->merge($randomProjects);

        $uniqueProjects = $allProjects->unique('id');

        // 5. Check if we have enough, and fill if not
        $finalProjects = $this->ensureProjectCount($uniqueProjects, $relations, 10);

        // 6. Format the output
        $formattedProjects = $finalProjects->map(function ($project) {
            $researcher = $project->projectResearcher;
            $panel = $researcher ? $researcher->panel : null;

            // Fetch Leader details from the User relation
            $leader = $researcher ? $researcher->user : null;
            $leaderName = $leader ? $leader->first_name . ' ' . $leader->last_name : null;

            $adviser = $project->adviser;
            $adviserName = $adviser ? $adviser->first_name . ' ' . $adviser->last_name : null;

            // Handle the new PlatformType Many-to-Many relationship
            $platformTypeString = $project->platformTypes->pluck('platform_name')->implode(', ');

            // Collect all members including the leader
            $rawMembers = [
                $leaderName, // Leader is usually listed first
                $researcher ? $researcher->member_hacker : null,
                $researcher ? $researcher->member_hipster1 : null,
                $researcher ? $researcher->member_hipster2 : null,
            ];

            // Filter out nulls and re-index array
            $members = array_values(array_filter($rawMembers));

            $panelMembers = $panel ? array_filter([
                $panel->panel_member_1,
                $panel->panel_member_2,
                $panel->panel_member_3,
            ]) : [];

            return [
                'project_id' => $project->id,
                'title' => $project->title,
                'abstract' => $project->abstract,
                'date_published' => $project->submission_date,
                'platform_type' => $platformTypeString,
                'adviser_name' => $adviserName,
                'members' => $members, // Now includes Leader, Hacker, and Hipsters
                'panel' => array_values($panelMembers),
            ];
        });

        return response()->json([
            'data' => $formattedProjects,
            'count' => $formattedProjects->count()
        ]);
    }

    /**
     * Helper function to ensure the collection has a specific count of projects.
     *
     * @param \Illuminate\Support\Collection $projects The projects already collected.
     * @param array $relations The relations to eager-load.
     * @param int $targetCount The desired number of projects.
     * @return \Illuminate\Support\Collection
     */
    private function ensureProjectCount(Collection $projects, array $relations, int $targetCount): Collection
    {
        $currentCount = $projects->count();
        $needed = $targetCount - $currentCount;

        if ($needed > 0) {
            // Get IDs of projects we already have to exclude them
            $excludeIds = $projects->pluck('id');

            // Fetch additional projects, excluding those we already have
            $additionalProjects = CapstoneProject::with($relations)
                ->where('is_archived', false)
                ->whereNotIn('id', $excludeIds)
                ->inRandomOrder()
                ->limit($needed)
                ->get();

            // Merge the original list with the new ones
            return $projects->merge($additionalProjects);
        }

        // If we have more than $targetCount, take only the $targetCount
        return $projects->take($targetCount);
    }
}
