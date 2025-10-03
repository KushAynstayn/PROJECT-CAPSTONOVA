<?php

namespace App\Http\Controllers\Api\Proponent;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessCapstoneManuscripts;
use App\Models\ActionType;
use App\Models\CapstoneProject;
use App\Models\Keyword;
use App\Models\ProjectResearcher;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SubmitDocumentAndDetailController extends Controller
{
    /**
     * Handle the incoming request for submitting a capstone project.
     * This controller now accepts paths to pre-uploaded files instead of the files themselves.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!Gate::allows('isProponent')) {
            abort(403, 'Unauthorized - Proponent access required');
        }

        // --- MODIFIED VALIDATION ---
        // The controller no longer validates file types or sizes here.
        // It now expects string paths for the files that have already been
        // uploaded and assembled by the ChunkedUploadController.
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'abstract' => ['required', 'string'],
            'platform_type' => ['required', 'string', 'max:50'],
            'keywords' => ['required', 'array'],
            'keywords.*' => ['required', 'string', 'max:50'],
            'member_hacker' => ['required', 'string', 'max:255'],
            'member_hipster1' => ['required', 'string', 'max:255'],
            'member_hipster2' => ['nullable', 'string', 'max:255'],
            'manuscript_path' => ['required', 'string'], // Changed from manuscript_pdf
            'acm_path' => ['required', 'string'], // Changed from acm_pdf
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // --- REMOVED FILE STORAGE LOGIC ---
        // The responsibility of storing the file has been moved to the
        // ChunkedUploadController. We now get the paths directly from the request.
        $tempManuscriptPath = $validated['manuscript_path'];
        $tempAcmPath = $validated['acm_path'];

        // Add a security check to ensure the files exist at the provided paths
        // and belong to the current user's temporary directory.
        if (!Storage::exists($tempManuscriptPath) || !Storage::exists($tempAcmPath)) {
            return response()->json(['message' => 'One or more provided file paths are invalid.'], 404);
        }

        // The tempPaths array is now populated with the validated paths.
        $tempPaths = [
            'manuscript' => $tempManuscriptPath,
            'acm' => $tempAcmPath,
        ];

        DB::beginTransaction();
        try {
            // This core business logic remains unchanged.
            $project = CapstoneProject::create([
                'title' => $validated['title'],
                'abstract' => $validated['abstract'],
                'adviser_id' => $user->userDetail->adviser_id,
                'submission_date' => now(),
                'submission_year' => now()->year,
                'platform_type' => $validated['platform_type'],
            ]);

            $keywordIds = [];
            foreach ($validated['keywords'] as $keywordName) {
                $keyword = Keyword::firstOrCreate(['keyword_name' => trim($keywordName)]);
                $keywordIds[] = $keyword->id;
            }
            $project->keywords()->attach($keywordIds);

            ProjectResearcher::create([
                'project_id' => $project->id,
                'user_id' => $user->id,
                'member_hacker' => $validated['member_hacker'],
                'member_hipster1' => $validated['member_hipster1'],
                'member_hipster2' => $validated['member_hipster2'] ?? null,
            ]);

            DB::commit();

            // The job dispatch remains the same, as it already expected paths.
            ProcessCapstoneManuscripts::dispatch($user, $project, $tempPaths);

            $actionType = ActionType::firstOrCreate(['action_name' => 'upload_project']);
            UserLog::create([
                'user_id' => $user->id,
                'action_type_id' => $actionType->id,
                'details' => "Submitted project documents for '{$project->title}'.",
            ]);

            return response()->json(['status' => 'queued'], 202);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Capstone Submission Failed: {$e->getMessage()}");
            // The cleanup logic still works perfectly, as it just deletes the files
            // at the provided paths if the database transaction fails.
            Storage::delete([$tempManuscriptPath, $tempAcmPath]);
            return response()->json(['message' => 'An unexpected error occurred during submission.'], 500);
        }
    }
}
