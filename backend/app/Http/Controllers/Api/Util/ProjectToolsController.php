<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectToolsController extends Controller
{
    public function __invoke(Request $request)
    {
        // --- Validation for query parameters ---
        $request->validate([
            'start_year' => 'sometimes|required|digits:4',
            'end_year'   => 'sometimes|required|digits:4|gte:start_year',
            'platform_type' => 'sometimes|required|string|max:50',
        ]);

        // --- Base Query using Laravel Query Builder ---
        // This query joins all necessary tables to link programming languages to projects.
        $query = DB::table('programming_languages as pl')
            ->join('project_languages as prl', 'pl.id', '=', 'prl.language_id')
            ->join('capstone_source_codes as csc', 'prl.source_code_id', '=', 'csc.id')
            ->join('capstone_projects as cp', 'csc.project_id', '=', 'cp.id')
            ->select('pl.language_name', DB::raw('COUNT(cp.id) as tool_count'));

        // --- Conditional Filtering ---

        // 1. Filter by Platform Type
        if ($request->has('platform_type')) {
            $query->where('cp.platform_type', '=', $request->input('platform_type'));
        }

        // 2. Filter by Date (Single Year or Year Range)
        if ($request->has('start_year') && $request->has('end_year')) {
            $query->whereBetween('cp.submission_year', [
                $request->input('start_year'),
                $request->input('end_year')
            ]);
        } elseif ($request->has('start_year')) {
            $query->where('cp.submission_year', '=', $request->input('start_year'));
        }

        $results = $query
            ->groupBy('pl.language_name')
            ->orderBy('tool_count', 'desc')
            ->get();

        // --- Format Data for Charting ---
        // Converts the collection of objects into a simple [language => count] associative array.
        $formattedData = $results->pluck('tool_count', 'language_name');

        return response()->json(['data' => $formattedData]);
    }
}
