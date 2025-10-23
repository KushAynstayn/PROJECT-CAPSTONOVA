<?php

namespace App\Http\Controllers\Api\Proponent;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessCompressedSourceCode; // Import new job
use App\Jobs\ProcessGithubSourceCode;
use App\Jobs\ProcessTarSourceCode;
use App\Models\ActionType;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SubmitSourceCodeController extends Controller
{
    /**
     * Handle the incoming request to submit capstone source code.
     * This controller only validates and dispatches the job.
     * All database operations happen inside the job.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!Gate::allows('isProponent')) {
            abort(403, 'Unauthorized - Proponent access required');
        }

        // --- MODIFIED VALIDATION (Backward Compatible) ---
        // 1. Added 'compressed' to the upload_type rule.
        // 2. Kept 'source_code_tar_path' for 'tar' type.
        // 3. Added 'source_code_compressed_path' for 'compressed' type.
        // 4. Added 'original_filename' for 'compressed' type.
        $validator = Validator::make($request->all(), [
            'upload_type' => ['required', 'string', Rule::in(['github', 'tar', 'compressed'])],
            'github_url' => ['required_if:upload_type,github', 'nullable', 'url'],
            'github_token' => ['nullable', 'string'],
            'source_code_tar_path' => ['required_if:upload_type,tar', 'nullable', 'string'], // Original field
            'source_code_compressed_path' => ['required_if:upload_type,compressed', 'nullable', 'string'], // New field
            'original_filename' => [ // New field, required for compressed type
                'required_if:upload_type,compressed',
                'nullable',
                'string'
            ],
            'programming_languages' => ['required', 'array'],
            'programming_languages.*' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Find the user's project ID without using Eloquent relationships to avoid errors.
        $projectId = DB::table('project_researchers')
            ->where('user_id', $user->id)
            ->value('project_id');

        if (!$projectId) {
            return response()->json(['message' => 'You do not have a capstone project associated with your account.'], 404);
        }

        // Dispatch the correct job with all the raw data it needs.
        // No database records are created here.
        if ($validated['upload_type'] === 'github') {
            ProcessGithubSourceCode::dispatch(
                $user,
                $projectId,
                $validated['programming_languages'],
                $validated['github_url'],
                $validated['github_token'] ?? null
            );
        } else if ($validated['upload_type'] === 'tar') {
            // --- UNCHANGED TAR HANDLING ---
            $tempTarPath = $validated['source_code_tar_path'];

            if (!Storage::exists($tempTarPath)) {
                return response()->json(['message' => 'The provided TAR file path is invalid.'], 404);
            }

            ProcessTarSourceCode::dispatch(
                $user,
                $projectId,
                $validated['programming_languages'],
                $tempTarPath
            );
        } else if ($validated['upload_type'] === 'compressed') {
            // --- NEW DISPATCH LOGIC for COMPRESSED ---
            $tempCompressedPath = $validated['source_code_compressed_path'];
            $originalFilename = $validated['original_filename'];

            if (!Storage::exists($tempCompressedPath)) {
                return response()->json(['message' => 'The provided compressed file path is invalid.'], 404);
            }

            ProcessCompressedSourceCode::dispatch(
                $user,
                $projectId,
                $validated['programming_languages'],
                $tempCompressedPath,
                $originalFilename
            );
        }

        $actionType = ActionType::firstOrCreate(['action_name' => 'upload_source_code']);
        UserLog::create([
            'user_id' => $user->id,
            'action_type_id' => $actionType->id,
            'details' => "Source code submitted for project ID {$projectId} via {$validated['upload_type']}.",
        ]);

        return response()->json(['status' => 'queued'], 202);
    }
}
