<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\CapstoneSourceCode;
use App\Models\ProjectResearcher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckSourceCodeController extends Controller
{
    /**
     * Check if the authenticated user has uploaded source code
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

        // Check if any of these projects have source code
        $hasSourceCode = CapstoneSourceCode::whereIn('project_id', $projectIds)
            ->where(function ($query) {
                $query->whereNotNull('file_path')
                    ->orWhereNotNull('repository_url');
            })
            ->exists();

        return response()->json($hasSourceCode);
    }
}
