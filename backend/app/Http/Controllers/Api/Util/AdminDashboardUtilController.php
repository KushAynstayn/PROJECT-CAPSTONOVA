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
        // Query for the latest project BY CREATION DATE, ensuring relationships exist
        $latestProject = CapstoneProject::with(['adviser', 'projectResearcher.user'])
            ->whereHas('projectResearcher.user') // Ensures the user who submitted exists
            ->whereHas('adviser')               // Ensures the adviser exists
            ->latest()                          // <-- Sorts by 'created_at' (newest first)
            ->first();

        // If no valid project is found, return null with a 200 OK status.
        if (!$latestProject) {
            return response()->json(null, 200);
        }

        // Safely access related data
        $submittedByUser = optional($latestProject->projectResearcher)->user;
        $adviser = $latestProject->adviser;

        $responseData = [
            'title' => $latestProject->title,

            'submitted_by' => trim(
                optional($submittedByUser)->first_name . ' ' . optional($submittedByUser)->last_name
            ) ?: 'N/A',

            'adviser' => trim(
                optional($adviser)->first_name . ' ' . optional($adviser)->last_name
            ) ?: 'N/A',

            // Use the submission_date from the project we found
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

    /**
     * Get the advisory load, counting projects per adviser with date filtering.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function advisoryLoad(Request $request): JsonResponse
    {
        $request->validate([
            'year' => 'nullable|integer|digits:4',
            'from_year' => 'nullable|integer|digits:4',
            'to_year' => 'nullable|integer|digits:4|gte:from_year',
        ]);

        $query = CapstoneProject::query()
            ->join('users', 'capstone_projects.adviser_id', '=', 'users.id')
            ->select(
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as adviser_name"),
                DB::raw('COUNT(capstone_projects.id) as projects_handled')
            )
            ->where('users.role', 'Adviser')
            ->groupBy('adviser_name')
            ->orderBy('adviser_name');

        // Filter by a single year
        if ($request->filled('year')) {
            $query->whereYear('capstone_projects.submission_date', $request->input('year'));
        }

        // Filter by a date range
        if ($request->filled('from_year')) {
            $query->whereYear('capstone_projects.submission_date', '>=', $request->input('from_year'));
        }
        if ($request->filled('to_year')) {
            $query->whereYear('capstone_projects.submission_date', '<=', $request->input('to_year'));
        }

        $advisoryLoad = $query->get();

        return response()->json($advisoryLoad);
    }

    /**
     * Get project submission counts by course/department with date filtering using raw SQL.
     *
     * @param \Illuminate\Http.Request $request
     * @return \Illuminate\Http.JsonResponse
     */
    public function submissionsByCourse(Request $request): JsonResponse
    {
        $request->validate([
            'year' => 'nullable|integer|digits:4',
            'from_year' => 'nullable|integer|digits:4',
            'to_year' => 'nullable|integer|digits:4|gte:from_year',
        ]);

        $whereConditions = [];
        $bindings = [];

        // Build the date-based WHERE clause and bindings for capstone_projects table
        if ($request->filled('year')) {
            $whereConditions[] = 'YEAR(submission_date) = ?';
            $bindings[] = $request->input('year');
        }

        if ($request->filled('from_year')) {
            $whereConditions[] = 'YEAR(submission_date) >= ?';
            $bindings[] = $request->input('from_year');
        }
        if ($request->filled('to_year')) {
            $whereConditions[] = 'YEAR(submission_date) <= ?';
            $bindings[] = $request->input('to_year');
        }

        $dateWhereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

        // 1. Get total submissions (Optimized: No joins needed)
        $totalSubmissionsQuery = "SELECT COUNT(*) as total FROM capstone_projects {$dateWhereClause}";
        $totalResult = DB::selectOne($totalSubmissionsQuery, $bindings);
        $totalSubmissions = $totalResult ? $totalResult->total : 0;

        // 2. Get total archived submissions (Optimized: No joins needed)
        $archivedWhereClause = $dateWhereClause;
        if (empty($whereConditions)) {
            $archivedWhereClause = 'WHERE is_archived = TRUE';
        } else {
            $archivedWhereClause .= ' AND is_archived = TRUE';
        }
        $totalArchivedQuery = "SELECT COUNT(*) as total_archived FROM capstone_projects {$archivedWhereClause}";
        $archivedResult = DB::selectOne($totalArchivedQuery, $bindings);
        $totalArchived = $archivedResult ? $archivedResult->total_archived : 0;

        // 3. Get submissions per course/department (Corrected to use ud.department)
        $courseWhereClause = !empty($whereConditions) ? 'WHERE ' . str_replace('submission_date', 'cp.submission_date', implode(' AND ', $whereConditions)) : '';

        $submissionsPerCourseQuery = "
        SELECT
            ud.department as course, 
            COUNT(cp.id) as count
        FROM 
            capstone_projects AS cp
        JOIN 
            project_researchers AS pr ON cp.id = pr.project_id
        JOIN 
            user_details AS ud ON pr.user_id = ud.user_id
        {$courseWhereClause}
        GROUP BY 
            ud.department
    ";
        $submissions = DB::select($submissionsPerCourseQuery, $bindings);

        return response()->json([
            'submissions_per_course' => $submissions,
            'total_submissions' => $totalSubmissions,
            'total_archived' => $totalArchived,
        ]);
    }

    /**
     * Get counts of users by role, including a departmental breakdown for proponents and viewers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userRoleCounts(): JsonResponse
    {
        $query = "
            SELECT
                u.role,
                ud.department,
                COUNT(u.id) as count
            FROM
                users AS u
            LEFT JOIN
                user_details AS ud ON u.id = ud.user_id
            WHERE
                u.role IN ('Admin', 'Adviser', 'Proponent', 'Viewer')
            GROUP BY
                u.role, ud.department
            ORDER BY
                u.role, ud.department;
        ";

        $results = DB::select($query);

        $response = [
            'admins' => 0,
            'advisers' => 0,
            'proponents' => ['total' => 0, 'by_department' => []],
            'viewers' => ['total' => 0, 'by_department' => []],
        ];

        foreach ($results as $result) {
            switch ($result->role) {
                case 'Admin':
                    $response['admins'] = $result->count;
                    break;
                case 'Adviser':
                    $response['advisers'] = $result->count;
                    break;
                case 'Proponent':
                    if ($result->department) {
                        $response['proponents']['by_department'][] = [
                            'department' => $result->department,
                            'count' => $result->count
                        ];
                    }
                    $response['proponents']['total'] += $result->count;
                    break;
                case 'Viewer':
                    if ($result->department) {
                        $response['viewers']['by_department'][] = [
                            'department' => $result->department,
                            'count' => $result->count
                        ];
                    }
                    $response['viewers']['total'] += $result->count;
                    break;
            }
        }

        return response()->json($response);
    }
}
