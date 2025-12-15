<?php

namespace App\Http\Controllers\Api\UserManagement;

use Exception;
use App\Models\UserLog;
use App\Models\ActionType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use App\Imports\FacultyWhitelistImport;

class MFacultyWhitelistController extends Controller
{
    /**
     * Upload Faculty Whitelist via Excel.
     * * @param Request $request
     * @return JsonResponse
     */
    public function uploadExcel(Request $request): JsonResponse
    {
        // Strict Gate check - ensures only Admin/Super Admin can perform this
        if (!Gate::allows('isAdmin') && $request->user()->role !== 'Super Admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin access required'
            ], 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        $file = $request->file('file');

        try {
            $import = new FacultyWhitelistImport();
            Excel::import($import, $file);

            $errors = $import->getErrors();
            if (!empty($errors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed. Please check the errors.',
                    'data'    => [
                        'processed_count' => 0,
                        'errors'          => $errors,
                    ],
                ], 422);
            }

            // Log the action for auditing
            $actionType = ActionType::firstOrCreate(['action_name' => 'upload_faculty_whitelist']);
            UserLog::create([
                'user_id' => Auth::id(),
                'action_type_id' => $actionType->id,
                'details' => 'Uploaded faculty whitelist from Excel. ' . $import->getProcessedCount() . ' entries added.'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Faculty whitelist has been successfully uploaded.',
                'data'    => [
                    'processed_count' => $import->getProcessedCount(),
                ],
            ], 200);
        } catch (Exception $e) {
            Log::error('Faculty Excel Upload Failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred during file processing.',
            ], 500);
        }
    }
}
