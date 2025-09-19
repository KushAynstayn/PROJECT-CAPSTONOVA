<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\ProjectAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckManualController extends Controller
{
    /**
     * Check if the user manual exists for the authenticated proponent's project.
     */
    public function checkUserManual(): JsonResponse
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Proponent') {
            return response()->json(['exists' => false, 'message' => 'Unauthorized - Proponent access required.'], 403);
        }

        $projectId = DB::table('project_researchers')
            ->where('user_id', $user->id)
            ->value('project_id');

        if (!$projectId) {
            return response()->json(['exists' => false, 'message' => 'No capstone project associated.'], 200);
        }

        $attachment = ProjectAttachment::where('project_id', $projectId)->first();

        $exists = !empty($attachment->user_manual_path);

        return response()->json(['exists' => $exists], 200);
    }

    /**
     * Check if the usage guide exists for the authenticated proponent's project.
     */
    public function checkUsageGuide(): JsonResponse
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Proponent') {
            return response()->json(['exists' => false, 'message' => 'Unauthorized - Proponent access required.'], 403);
        }

        $projectId = DB::table('project_researchers')
            ->where('user_id', $user->id)
            ->value('project_id');

        if (!$projectId) {
            return response()->json(['exists' => false, 'message' => 'No capstone project associated.'], 200);
        }

        $attachment = ProjectAttachment::where('project_id', $projectId)->first();

        $exists = !empty($attachment->usage_guide_path);

        return response()->json(['exists' => $exists], 200);
    }
}
