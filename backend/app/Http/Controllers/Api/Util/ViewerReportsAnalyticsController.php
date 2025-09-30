<?php

namespace App\Http\controllers\Api\Util;

use App\Http\controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ViewerReportsAnalyticsController extends Controller
{
    /**
     * Get optimized programming language trend data for charting.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function programmingLanguageTrends(): JsonResponse
    {
        // Step 1: Fetch all project counts in a single, optimized query.
        // This query joins all necessary tables and groups the results by year and language name.
        $projectCounts = DB::table('capstone_projects as cp')
            ->join('capstone_source_codes as csc', 'cp.id', '=', 'csc.project_id')
            ->join('project_languages as pl', 'csc.id', '=', 'pl.source_code_id')
            ->join('programming_languages as pgl', 'pl.language_id', '=', 'pgl.id')
            ->select(
                'cp.submission_year',
                'pgl.language_name',
                DB::raw('COUNT(cp.id) as project_count')
            )
            ->groupBy('cp.submission_year', 'pgl.language_name')
            ->orderBy('cp.submission_year', 'asc')
            ->get();

        if ($projectCounts->isEmpty()) {
            return response()->json([
                'series' => [],
                'xaxis' => ['categories' => []],
            ]);
        }

        // Step 2: Process the flat data into a structure suitable for charting.
        $years = $projectCounts->pluck('submission_year')->unique()->sort()->values();

        // Group the counts by language name
        $trends = $projectCounts->groupBy('language_name');

        // Create a template with all years set to 0 for each language
        $series = $trends->map(function ($languageData, $languageName) use ($years) {
            $yearCounts = array_fill_keys($years->toArray(), 0);

            // Fill in the actual counts from the query
            foreach ($languageData as $data) {
                $yearCounts[$data->submission_year] = $data->project_count;
            }

            return [
                'name' => $languageName,
                'data' => array_values($yearCounts),
            ];
        })->values();

        // Step 3: Return the newly structured JSON response.
        return response()->json([
            'series' => $series,
            'xaxis' => [
                'categories' => $years,
            ],
        ]);
    }


    /**
     * Get archived capstone projects count per department per year.
     * "Archived" in this context means projects uploaded in the system, not a specific status.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function archivedProjectsByDepartment(): JsonResponse
    {
        // Corrected query: Get department from proponent's user_details via project_researchers
        $projectCounts = DB::table('capstone_projects as cp')
            ->join('project_researchers as pr', 'cp.id', '=', 'pr.project_id')
            ->join('users as u', 'pr.user_id', '=', 'u.id') // Join to proponent user
            ->join('user_details as ud', 'u.id', '=', 'ud.user_id') // Get proponent's department
            ->select(
                'cp.submission_year',
                'ud.department',
                DB::raw('COUNT(DISTINCT cp.id) as project_count')
            )
            // Removed the where clause to include all projects (archived and non-archived)
            ->groupBy('cp.submission_year', 'ud.department')
            ->orderBy('cp.submission_year', 'asc')
            ->orderBy('ud.department', 'asc')
            ->get();

        if ($projectCounts->isEmpty()) {
            return response()->json([
                'series' => [],
                'xaxis' => ['categories' => []],
            ]);
        }

        // Get all unique years from the results
        $years = $projectCounts->pluck('submission_year')->unique()->sort()->values();

        // Group the counts by department name to prepare for series generation
        $departmentsData = $projectCounts->groupBy('department');

        $series = $departmentsData->map(function ($departmentProjects, $departmentName) use ($years) {
            // Initialize counts for all years for the current department to 0
            $yearCounts = array_fill_keys($years->toArray(), 0);

            // Populate actual project counts for the years they exist
            foreach ($departmentProjects as $data) {
                $yearCounts[$data->submission_year] = $data->project_count;
            }

            return [
                'name' => $departmentName,
                'data' => array_values($yearCounts), // Extract just the counts in order of years
            ];
        })->values();

        return response()->json([
            'series' => $series,
            'xaxis' => [
                'categories' => $years->toArray(),
            ],
        ]);
    }
}
