<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdviserOverviewController extends Controller
{
    public function __invoke(Request $request)
    {
        $adviser = Auth::user();

        if ($adviser->role !== 'Adviser') {
            return response()->json(['message' => 'Unauthorized. Only advisers can access this data.'], 403);
        }

        $adviserId = $adviser->id;

        // --- Advisee Count ---
        $adviseeSql = "
            SELECT COUNT(DISTINCT pr.user_id)
            FROM project_researchers pr
            JOIN capstone_projects cp ON pr.project_id = cp.id
            WHERE cp.adviser_id = ?
        ";
        $adviseeCount = DB::scalar($adviseeSql, [$adviserId]);

        // --- Projects and Suggestions Count with Date Filtering ---
        $projectSql = "SELECT COUNT(*) FROM capstone_projects WHERE adviser_id = ?";
        $suggestionSql = "SELECT COUNT(*) FROM suggestions WHERE adviser_id = ? AND is_archived = 0";
        $bindings = [$adviserId];

        if ($request->has('year')) {
            $year = $request->validate(['year' => 'required|digits:4'])['year'];
            $projectSql .= " AND submission_year = ?";
            $suggestionSql .= " AND YEAR(submission_date) = ?";
            $bindings[] = $year;
        } elseif ($request->has(['start_date', 'end_date'])) {
            $dates = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);
            $projectSql .= " AND submission_date BETWEEN ? AND ?";
            $suggestionSql .= " AND submission_date BETWEEN ? AND ?";
            $bindings[] = $dates['start_date'];
            $bindings[] = $dates['end_date'];
        }

        $projectCount = DB::scalar($projectSql, $bindings);
        $suggestionCount = DB::scalar($suggestionSql, $bindings);

        return response()->json([
            'data' => [
                'advisees' => $adviseeCount,
                'projects' => $projectCount,
                'suggestions' => $suggestionCount,
            ]
        ]);
    }
}
