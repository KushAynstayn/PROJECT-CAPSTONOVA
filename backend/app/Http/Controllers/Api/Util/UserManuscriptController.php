<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\CapstoneManuscript;
use App\Models\ProjectResearcher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserManuscriptController extends Controller
{
    /**
     * Get the manuscript ID for the authenticated user's project
     */
    public function getMyManuscriptId(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Get the project ID where the user is a researcher
        $projectResearcher = ProjectResearcher::where('user_id', $user->id)
            ->first();

        if (!$projectResearcher) {
            return response()->json([
                'manuscript_id' => null,
                'message' => 'You are not associated with any projects'
            ]);
        }

        // Get the manuscript for this project
        $manuscript = CapstoneManuscript::where('project_id', $projectResearcher->project_id)
            ->first();

        return response()->json([
            'manuscript_id' => $manuscript ? $manuscript->manuscript_id : null,
            'project_id' => $projectResearcher->project_id
        ]);
    }
}
