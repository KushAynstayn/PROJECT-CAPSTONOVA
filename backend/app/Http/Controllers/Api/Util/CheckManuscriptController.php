<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\CapstoneManuscript;
use App\Models\ProjectResearcher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckManuscriptController extends Controller
{
    /**
     * Check if the authenticated user has uploaded a manuscript
     */
    public function check(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Get projects where the user is a researcher
        $projectIds = ProjectResearcher::where('user_id', $user->id)
            ->pluck('project_id')
            ->toArray();

        if (empty($projectIds)) {
            return response()->json(false);
        }

        // Check if any of these projects have a manuscript
        $hasManuscript = CapstoneManuscript::whereIn('project_id', $projectIds)
            ->exists();

        return response()->json($hasManuscript);
    }
}
