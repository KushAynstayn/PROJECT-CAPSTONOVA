<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectTypeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // 1. Validation (Same as before)
        $request->validate([
            'year'       => 'sometimes|digits:4',
            'start_date' => 'required_with:end_date|date',
            'end_date'   => 'required_with:start_date|date|after_or_equal:start_date',
        ]);

        // 2. Build Query using the new Schema (Joins)
        // We start from platform_types to get the name, join the pivot, then the projects
        $query = DB::table('platform_types')
            ->join('project_platforms', 'platform_types.id', '=', 'project_platforms.platform_type_id')
            ->join('capstone_projects', 'project_platforms.project_id', '=', 'capstone_projects.id')
            ->select(
                'platform_types.platform_name',
                DB::raw('count(capstone_projects.id) as count')
            );

        // 3. Apply Filters (Explicitly targeting capstone_projects table columns)
        if ($request->has('year')) {
            $query->where('capstone_projects.submission_year', $request->year);
        } elseif ($request->has(['start_date', 'end_date'])) {
            $query->whereBetween('capstone_projects.submission_date', [
                $request->start_date,
                $request->end_date
            ]);
        }

        // 4. Group and Execute
        $results = $query->groupBy('platform_types.platform_name')
            ->get();

        // 5. Format to exact previous structure: ['PlatformName' => Count]
        // logic: pluck('value_column', 'key_column')
        $formattedResults = $results->pluck('count', 'platform_name');

        return response()->json(['data' => $formattedResults]);
    }
}
