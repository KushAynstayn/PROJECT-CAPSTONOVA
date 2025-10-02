<?php

namespace App\Http\Controllers\Api\Proponent;

use App\Models\Keyword;
use Illuminate\Http\Request;
use App\Models\CapstoneProject;
use App\Models\ProjectResearcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ProcessCapstoneManuscripts;
use Illuminate\Support\Facades\Validator;
use App\Models\ActionType;
use App\Models\UserLog;

class SubmitDocumentAndDetailController extends Controller
{
    /**
     * Handle the incoming request for submitting a capstone project.
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

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'abstract' => ['required', 'string'],
            'platform_type' => ['required', 'string', 'max:50'],
            'keywords' => ['required', 'array'],
            'keywords.*' => ['required', 'string', 'max:50'],
            'member_hacker' => ['required', 'string', 'max:255'],
            'member_hipster1' => ['required', 'string', 'max:255'],
            'member_hipster2' => ['nullable', 'string', 'max:255'],
            'manuscript_pdf' => ['required', 'file', 'mimes:pdf', 'max:30720'], // 30MB Max
            'acm_pdf' => ['required', 'file', 'mimes:pdf', 'max:15360'], // 15MB Max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $tempManuscriptPath = $request->file('manuscript_pdf')->store("private/temp/{$user->id}");
        $tempAcmPath = $request->file('acm_pdf')->store("private/temp/{$user->id}");

        $tempPaths = [
            'manuscript' => $tempManuscriptPath,
            'acm' => $tempAcmPath,
        ];

        DB::beginTransaction();
        try {
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

            ProcessCapstoneManuscripts::dispatch($user, $project, $tempPaths);

            $actionType = ActionType::firstOrCreate(['action_name' => 'upload_project']);
            UserLog::create([
                'user_id' => $user->id,
                'action_type_id' => $actionType->id,
                'details' => "Submitted project documents for '{$project->title}'."
            ]);

            return response()->json(['status' => 'queued'], 202);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Capstone Submission Failed: {$e->getMessage()}");
            Storage::delete([$tempManuscriptPath, $tempAcmPath]);
            return response()->json(['message' => 'An unexpected error occurred during submission.'], 500);
        }
    }
}
