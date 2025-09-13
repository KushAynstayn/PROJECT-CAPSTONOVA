<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CapstoneProject;
use App\Models\Suggestion; // Import the Suggestion model
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardUtilController extends Controller
{
    /**
     * Get the top 5 advisers for the admin dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function topAdvisers(): JsonResponse
    {
        $topAdvisers = User::where('role', 'Adviser')
            ->withCount('advisedProjects')
            ->orderByDesc('advised_projects_count')
            ->limit(5)
            ->get();

        $formattedAdvisers = $topAdvisers->map(function ($adviser) {
            return [
                'name' => $adviser->first_name . ' ' . $adviser->last_name,
                'projects_handled' => $adviser->advised_projects_count,
            ];
        });

        return response()->json($formattedAdvisers);
    }

    /**
     * Get the top 10 most used programming tools/languages using a raw SQL query.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function programmingToolsUsage(): JsonResponse
    {
        $languageUsage = DB::select("
            SELECT
                pl.language_name AS name,
                COUNT(pjl.language_id) AS projects_count
            FROM
                programming_languages AS pl
            JOIN
                project_languages AS pjl ON pl.id = pjl.language_id
            GROUP BY
                pl.language_name, pl.id
            ORDER BY
                projects_count DESC
            LIMIT 10
        ");

        return response()->json($languageUsage);
    }

    /**
     * Get the count of projects for each platform type.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function projectsByType(): JsonResponse
    {
        $projectCounts = CapstoneProject::query()
            ->select('platform_type as type', DB::raw('count(*) as count'))
            ->groupBy('platform_type')
            ->get();

        return response()->json($projectCounts);
    }

    /**
     * Get the count of users for 'Adviser' and 'Proponent' roles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function roleDistribution(): JsonResponse
    {
        $roles = ['Adviser', 'Proponent'];

        $roleCounts = User::query()
            ->select('role', DB::raw('count(*) as count'))
            ->whereIn('role', $roles)
            ->groupBy('role')
            ->get();

        return response()->json($roleCounts);
    }

    /**
     * Get the latest capstone project submission details.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function latestSubmission(): JsonResponse
    {
        $latestProject = CapstoneProject::with(['adviser', 'projectResearcher.user'])
            ->latest()
            ->first();

        if (!$latestProject) {
            return response()->json(['message' => 'No projects found.'], 404);
        }

        $responseData = [
            'title' => $latestProject->title,
            'submitted_by' => $latestProject->projectResearcher->user->first_name . ' ' . $latestProject->projectResearcher->user->last_name,
            'adviser' => $latestProject->adviser->first_name . ' ' . $latestProject->adviser->last_name,
            'date_submitted' => $latestProject->submission_date,
        ];

        return response()->json($responseData);
    }

    /**
     * Get the latest suggestion from an adviser.
     *
     * This method finds the most recently created suggestion and returns its
     * title, content, and the name of the adviser who posted it.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function latestSuggestionCard(): JsonResponse
    {
        // Find the latest suggestion and eager load the adviser's details.
        $latestSuggestion = Suggestion::with('adviser')
            ->latest() // Shortcut for orderBy('created_at', 'desc')
            ->first();

        // If no suggestions exist, return a 404 response.
        if (!$latestSuggestion) {
            return response()->json(['message' => 'No suggestions found.'], 404);
        }

        // Format the response to include the adviser's name, title, and text.
        $responseData = [
            'adviser_name' => $latestSuggestion->adviser->first_name . ' ' . $latestSuggestion->adviser->last_name,
            // Corrected to use the 'title' column from the suggestions table.
            'title' => $latestSuggestion->title,
            'suggestion_text' => $latestSuggestion->suggestion_text,
        ];

        return response()->json($responseData);
    }
}
