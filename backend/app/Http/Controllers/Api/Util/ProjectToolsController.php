<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectToolsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // --- Validation for query parameters ---
        // Keeps strict compatibility with previous frontend requests
        $request->validate([
            'start_year'    => 'sometimes|required|digits:4',
            'end_year'      => 'sometimes|required|digits:4|gte:start_year',
            'platform_type' => 'sometimes|required|string|max:50',
        ]);

        // --- Base Query ---
        // Link: Languages -> Project Languages -> Source Code -> Projects
        // We alias capstone_projects as 'cp' to reference it in the subquery later
        $query = DB::table('programming_languages as pl')
            ->join('project_languages as prl', 'pl.id', '=', 'prl.language_id')
            ->join('capstone_source_codes as csc', 'prl.source_code_id', '=', 'csc.id')
            ->join('capstone_projects as cp', 'csc.project_id', '=', 'cp.id')
            ->select('pl.language_name', DB::raw('COUNT(cp.id) as tool_count'));

        // --- Conditional Filtering ---

        // 1. Filter by Platform Type (New Many-to-Many Logic)
        if ($request->filled('platform_type')) {
            $platformName = $request->input('platform_type');

            // 'whereExists' is critical here. 
            // It filters the projects that belong to the platform WITHOUT joining 
            // the rows into the main result set, preventing duplicate counts for languages.
            $query->whereExists(function ($subQuery) use ($platformName) {
                $subQuery->select(DB::raw(1))
                    ->from('project_platforms as pp')
                    ->join('platform_types as pt', 'pp.platform_type_id', '=', 'pt.id')
                    ->whereColumn('pp.project_id', 'cp.id') // References the outer 'cp' alias
                    ->where('pt.platform_name', $platformName);
            });
        }

        // 2. Filter by Date (Single Year or Year Range)
        if ($request->filled('start_year') && $request->filled('end_year')) {
            $query->whereBetween('cp.submission_year', [
                $request->input('start_year'),
                $request->input('end_year')
            ]);
        } elseif ($request->filled('start_year')) {
            $query->where('cp.submission_year', '=', $request->input('start_year'));
        }

        // --- Execution ---
        // Group by language name to aggregate counts
        $results = $query
            ->groupBy('pl.language_name')
            ->orderBy('tool_count', 'desc')
            ->get();

        // --- Format Data ---
        // Returns exact structure: { "data": { "PHP": 15, "Java": 10 } }
        $formattedData = $results->pluck('tool_count', 'language_name');

        return response()->json(['data' => $formattedData]);
    }
}
