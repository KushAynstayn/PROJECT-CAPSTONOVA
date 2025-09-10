<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnvironmentTrendController extends Controller
{
    public function __invoke(Request $request)
    {
        // --- Validation ---
        $request->validate([
            'start_year' => 'sometimes|required|digits:4',
            'end_year' => 'sometimes|required|digits:4|gte:start_year',
        ]);

        // --- Base SQL Query ---
        $query = DB::table('keywords as k')
            ->join('project_keywords as pk', 'k.id', '=', 'pk.keyword_id')
            ->join('capstone_projects as cp', 'pk.project_id', '=', 'cp.id')
            ->select('cp.submission_year', 'k.keyword_name', DB::raw('COUNT(cp.id) as project_count'));

        // --- Explicit Date Filtering ---
        // Case 1: A year range is provided
        if ($request->has('start_year') && $request->has('end_year')) {
            $query->whereBetween('cp.submission_year', [
                $request->input('start_year'),
                $request->input('end_year')
            ]);
            // Case 2: Only a single year is provided
        } elseif ($request->has('start_year')) {
            $query->where('cp.submission_year', '=', $request->input('start_year'));
        }

        $results = $query
            ->groupBy('cp.submission_year', 'k.keyword_name')
            ->orderBy('cp.submission_year', 'asc')
            ->orderBy('k.keyword_name', 'asc')
            ->get();

        // --- Format Data for Charting ---
        $formattedData = [];
        foreach ($results as $row) {
            $year = $row->submission_year;
            $keyword = $row->keyword_name;
            $count = $row->project_count;

            if (!isset($formattedData[$year])) {
                $formattedData[$year] = [];
            }
            $formattedData[$year][$keyword] = $count;
        }

        return response()->json(['data' => $formattedData]);
    }
}
