<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserLogController extends Controller
{
    /**
     * Display a paginated list of user logs with related user and action type.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {

        $logs = UserLog::with([
            'user:id,first_name,last_name',
            'actionType:id,action_name'
        ])
            ->latest() // Order by created_at DESC (newest first)
            ->paginate(20); // Paginate 20 results per page

        return response()->json($logs);
    }
}
