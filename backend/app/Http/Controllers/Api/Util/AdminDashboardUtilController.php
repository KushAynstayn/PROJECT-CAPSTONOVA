<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CapstoneProject;
use App\Models\Suggestion;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardUtilController extends Controller
{
    /**
     * Get the top 5 advisers for the admin dashboard.
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
     * Get the top 10 most used programming tools/languages.
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
     */
    public function projectsByType(): JsonResponse
    {
        $projectCounts = DB::table('platform_types')
            ->join('project_platforms', 'platform_types.id', '=', 'project_platforms.platform_type_id')
            ->join('capstone_projects', 'project_platforms.project_id', '=', 'capstone_projects.id')
            ->select('platform_types.platform_name as type', DB::raw('count(capstone_projects.id) as count'))
            ->groupBy('platform_types.platform_name')
            ->get();

        return response()->json($projectCounts);
    }

    /**
     * Get the count of users for 'Adviser' and 'Proponent' roles.
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
     */
    public function latestSubmission(): JsonResponse
    {
        $latestProject = CapstoneProject::with(['adviser', 'projectResearcher.user'])
            ->whereHas('projectResearcher.user')
            ->whereHas('adviser')
            ->latest()
            ->first();

        if (!$latestProject) {
            return response()->json(null, 200);
        }

        $submittedByUser = optional($latestProject->projectResearcher)->user;
        $adviser = $latestProject->adviser;

        $responseData = [
            'title' => $latestProject->title,
            'submitted_by' => trim(optional($submittedByUser)->first_name . ' ' . optional($submittedByUser)->last_name) ?: 'N/A',
            'adviser' => trim(optional($adviser)->first_name . ' ' . optional($adviser)->last_name) ?: 'N/A',
            'date_submitted' => $latestProject->submission_date,
        ];

        return response()->json($responseData);
    }

    /**
     * Get the latest suggestion from an adviser.
     */
    public function latestSuggestionCard(): JsonResponse
    {
        $latestSuggestion = Suggestion::with('adviser')
            ->latest()
            ->first();

        if (!$latestSuggestion) {
            return response()->json(['message' => 'No suggestions found.'], 404);
        }

        $responseData = [
            'adviser_name' => $latestSuggestion->adviser->first_name . ' ' . $latestSuggestion->adviser->last_name,
            'title' => $latestSuggestion->title,
            'suggestion_text' => $latestSuggestion->suggestion_text,
        ];

        return response()->json($responseData);
    }

    /**
     * Get the advisory load, counting projects per adviser with date filtering.
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

        if ($request->filled('year')) {
            $query->whereYear('capstone_projects.submission_date', $request->input('year'));
        }
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
     * Get project submission counts by course/department with date filtering.
     * STRICTLY FILTERS for: BSIS, BSIT, BIT-CT only.
     */
    public function submissionsByCourse(Request $request): JsonResponse
    {
        $request->validate([
            'year' => 'nullable|integer|digits:4',
            'from_year' => 'nullable|integer|digits:4',
            'to_year' => 'nullable|integer|digits:4|gte:from_year',
        ]);

        $allowedDepartments = ['BSIS', 'BSIT', 'BIT-CT'];

        $baseQuery = DB::table('capstone_projects as cp')
            ->join('project_researchers as pr', 'cp.id', '=', 'pr.project_id')
            ->join('user_details as ud', 'pr.user_id', '=', 'ud.user_id')
            ->whereIn('ud.department', $allowedDepartments);

        if ($request->filled('year')) {
            $baseQuery->whereYear('cp.submission_date', $request->input('year'));
        }
        if ($request->filled('from_year')) {
            $baseQuery->whereYear('cp.submission_date', '>=', $request->input('from_year'));
        }
        if ($request->filled('to_year')) {
            $baseQuery->whereYear('cp.submission_date', '<=', $request->input('to_year'));
        }

        $totalSubmissions = $baseQuery->clone()->distinct()->count('cp.id');

        $totalArchived = $baseQuery->clone()
            ->where('cp.is_archived', true)
            ->distinct()
            ->count('cp.id');

        $submissions = $baseQuery->clone()
            ->select('ud.department as course', DB::raw('COUNT(DISTINCT cp.id) as count'))
            ->groupBy('ud.department')
            ->get();

        return response()->json([
            'submissions_per_course' => $submissions,
            'total_submissions' => $totalSubmissions,
            'total_archived' => $totalArchived,
        ]);
    }

    /**
     * Get counts of users by role.
     * FIXED: Viewer/Proponent totals now strictly exclude users not in BSIS, BSIT, or BIT-CT.
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

        // Strict allowed departments list
        $allowedDepartments = ['BSIS', 'BSIT', 'BIT-CT'];

        foreach ($results as $result) {
            switch ($result->role) {
                case 'Admin':
                    $response['admins'] = $result->count;
                    break;
                case 'Adviser':
                    $response['advisers'] = $result->count;
                    break;
                case 'Proponent':
                    // STRICT CHECK: Only process if department is in the allowed list
                    if ($result->department && in_array($result->department, $allowedDepartments)) {
                        $response['proponents']['by_department'][] = [
                            'department' => $result->department,
                            'count' => $result->count
                        ];
                        // Only add to total if it passed the check
                        $response['proponents']['total'] += $result->count;
                    }
                    break;
                case 'Viewer':
                    // STRICT CHECK: Only process if department is in the allowed list
                    if ($result->department && in_array($result->department, $allowedDepartments)) {
                        $response['viewers']['by_department'][] = [
                            'department' => $result->department,
                            'count' => $result->count
                        ];
                        // Only add to total if it passed the check
                        $response['viewers']['total'] += $result->count;
                    }
                    break;
            }
        }

        return response()->json($response);
    }
}
