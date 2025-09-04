<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class FetchAdviserController extends Controller
{
    /**
     * Get all active advisers with their full name and user ID
     */
    public function index(): JsonResponse
    {
        $advisers = User::where('role', 'Adviser')
            ->where('status', 'active')
            ->select('id', 'first_name', 'last_name', 'middle_name')
            ->get()
            ->map(function ($adviser) {
                return [
                    'id' => $adviser->id,
                    'full_name' => trim(
                        $adviser->first_name . ' ' .
                            ($adviser->middle_name ? $adviser->middle_name . ' ' : '') .
                            $adviser->last_name
                    )
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $advisers
        ]);
    }
}
