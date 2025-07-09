<?php

namespace App\Http\Controllers\Api\Proponent;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessGithubSourceCode;
use App\Jobs\ProcessTarSourceCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        $validator = Validator::make($request->all(), [
            'upload_type' => ['required', 'string', Rule::in(['github', 'tar'])],
            'github_url' => ['required_if:upload_type,github', 'nullable', 'url'],
            'github_token' => ['nullable', 'string'],
            'source_code_tar' => ['required_if:upload_type,tar', 'nullable', 'file', 'mimes:tar'],
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
        } else {
            $tempTarPath = $request->file('source_code_tar')->store("private/temp/{$user->id}");
            ProcessTarSourceCode::dispatch(
                $user,
                $projectId,
                $validated['programming_languages'],
                $tempTarPath
            );
        }

        return response()->json(['status' => 'queued'], 202);
    }
}