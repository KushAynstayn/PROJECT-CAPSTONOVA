<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectTypeController extends Controller
{
    public function __invoke(Request $request)
    {
        // Base SQL query for all projects
        $sql = "
            SELECT platform_type, COUNT(*) as count
            FROM capstone_projects
        ";

        $whereClauses = [];
        $bindings = [];

        // Dynamically add date filtering conditions if present in the request
        if ($request->has('year')) {
            $year = $request->validate(['year' => 'required|digits:4'])['year'];
            $whereClauses[] = "submission_year = ?";
            $bindings[] = $year;
        } elseif ($request->has(['start_date', 'end_date'])) {
            $dates = $request->validate([
                'start_date' => 'required|date',
                'end_date'   => 'required|date|after_or_equal:start_date',
            ]);
            $whereClauses[] = "submission_date BETWEEN ? AND ?";
            $bindings[] = $dates['start_date'];
            $bindings[] = $dates['end_date'];
        }

        if (!empty($whereClauses)) {
            $sql .= " WHERE " . implode(' AND ', $whereClauses);
        }

        $sql .= " GROUP BY platform_type";

        // Execute the final query
        $results = DB::select($sql, $bindings);

        // Format the results into a key-value pair for the chart
        $formattedResults = [];
        foreach ($results as $result) {
            $formattedResults[$result->platform_type] = $result->count;
        }

        return response()->json(['data' => $formattedResults]);
    }
}
