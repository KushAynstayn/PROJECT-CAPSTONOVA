<?php

namespace App\Http\Controllers\Api\Util;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\CapstoneProject;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ViewerTrendController extends Controller
{
    /**
     * Get the trend data for archived capstone projects by year and course.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProjectsTrend()
    {
        // Dynamically find the earliest submission_year from the capstone_projects table
        $firstProjectYear = CapstoneProject::min('submission_year');
        $currentYear = Carbon::now()->year;

        // If there are no projects, default the start year to the current year
        $startYear = $firstProjectYear ?? $currentYear;

        // The query now uses the `submission_year` column for all date-based logic
        $projects = CapstoneProject::select(
            'capstone_projects.submission_year as year', // Use submission_year
            'user_details.department',
            DB::raw('COUNT(DISTINCT capstone_projects.id) as total_projects')
        )
            ->join('project_researchers', 'capstone_projects.id', '=', 'project_researchers.project_id')
            ->join('user_details', 'project_researchers.user_id', '=', 'user_details.user_id')
            ->where('capstone_projects.submission_year', '>=', $startYear) // Filter by submission_year
            ->groupBy('year', 'user_details.department')
            ->orderBy('year')
            ->orderBy('user_details.department')
            ->get();

        $formattedData = [];
        $years = range($startYear, $currentYear);
        $departments = ['BSIS', 'BSIT', 'BIT-CT'];

        // Initialize the structure with 0 counts for all years and departments
        foreach ($years as $year) {
            $yearData = ['year' => (string) $year];
            foreach ($departments as $department) {
                $yearData[strtolower($department)] = 0;
            }
            $formattedData[$year] = $yearData;
        }

        // Populate the structure with actual data from the query
        foreach ($projects as $project) {
            if (isset($formattedData[$project->year])) {
                $departmentKey = strtolower($project->department);
                if (array_key_exists($departmentKey, $formattedData[$project->year])) {
                    $formattedData[$project->year][$departmentKey] = (int) $project->total_projects;
                }
            }
        }

        // Convert the associative array to a simple indexed array for the JSON response
        $result = array_values($formattedData);

        return response()->json([
            'message' => 'Capstone projects trend data fetched successfully.',
            'data' => $result,
        ]);
    }

    /**
     * Get the distribution of capstone projects by platform type for a specific year.
     *
     * @param int $year The year to query.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProjectTypeDistribution(int $year)
    {
        // Get the count of projects for each platform type for the given year
        $platformDistribution = CapstoneProject::select(
            'platform_type',
            DB::raw('COUNT(id) as count')
        )
            ->where('submission_year', $year)
            ->groupBy('platform_type')
            ->orderBy('platform_type')
            ->get();

        // Calculate the total number of projects for the year
        $totalProjects = $platformDistribution->sum('count');

        return response()->json([
            'message' => "Project type distribution for year {$year} fetched successfully.",
            'data' => [
                'year' => $year,
                'total_projects' => (int) $totalProjects,
                'platforms' => $platformDistribution->map(function ($item) {
                    // Ensure count is an integer
                    $item->count = (int) $item->count;
                    return $item;
                }),
            ],
        ]);
    }

    /**
     * Get the usage count of programming languages for projects in a specific year.
     *
     * @param int $year The submission year to query.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLanguageUsageByYear(int $year)
    {
        // This query joins programming_languages with capstone_projects through the pivot tables
        // to count how many projects in a given year used each language.
        $languageUsage = DB::table('programming_languages')
            ->select(
                'programming_languages.language_name',
                DB::raw('COUNT(programming_languages.id) as project_count')
            )
            ->join('project_languages', 'programming_languages.id', '=', 'project_languages.language_id')
            ->join('capstone_source_codes', 'project_languages.source_code_id', '=', 'capstone_source_codes.id')
            ->join('capstone_projects', 'capstone_source_codes.project_id', '=', 'capstone_projects.id')
            ->where('capstone_projects.submission_year', $year)
            ->groupBy('programming_languages.language_name')
            ->orderBy('project_count', 'desc') // Order by most used
            ->get();

        return response()->json([
            'message' => "Programming language usage for year {$year} fetched successfully.",
            'data' => $languageUsage,
        ]);
    }

    /**
     * Get the top 5 advisers with the most supervised projects of all time.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTopAdvisers()
    {
        $topAdvisers = DB::table('users')
            ->select(
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as adviser_name"),
                DB::raw('COUNT(capstone_projects.id) as project_count')
            )
            ->join('capstone_projects', 'users.id', '=', 'capstone_projects.adviser_id')
            ->where('users.role', 'Adviser')
            ->groupBy('adviser_name')
            ->orderBy('project_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'message' => 'Top 5 advisers fetched successfully.',
            'data' => $topAdvisers,
        ]);
    }

    /**
     * Get the usage count of project keywords for a specific submission year.
     *
     * @param int $year The submission year to query.
     * @return \Illuminate\Http\JsonResponse
     */
    public function getKeywordUsageByYear(int $year)
    {
        $keywordUsage = DB::table('keywords')
            ->select(
                'keywords.keyword_name',
                DB::raw('COUNT(keywords.id) as project_count')
            )
            ->join('project_keywords', 'keywords.id', '=', 'project_keywords.keyword_id')
            ->join('capstone_projects', 'project_keywords.project_id', '=', 'capstone_projects.id')
            ->where('capstone_projects.submission_year', $year)
            ->groupBy('keywords.keyword_name')
            ->orderBy('project_count', 'desc')
            ->get();

        return response()->json([
            'message' => "Keyword usage for year {$year} fetched successfully.",
            'data' => $keywordUsage,
        ]);
    }
}
