<?php

namespace App\Http\Controllers\Api\Proponent;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessCapstoneManuscripts;
use App\Models\ActionType;
use App\Models\CapstoneProject;
use App\Models\Keyword;
use App\Models\Panel;
use App\Models\PlatformType; // Added PlatformType model
use App\Models\ProjectResearcher;
use App\Models\SystemSetting;
use App\Models\UserLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'uploadProjects' feature is enabled for the user's role
        $settingName = $settingRoleKey . '_uploadProjects';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        // This check is bypassed if the user is a Super Admin
        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'The ability to upload projects is currently disabled.'
            ], 403);
        }

        // --- MODIFIED VALIDATION ---
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'abstract' => ['required', 'string'],
            // UPDATED: Now accepts strings to find or create
            'platform_types' => ['required', 'array'],
            'platform_types.*' => ['required', 'string', 'max:50'],
            'keywords' => ['required', 'array'],
            'keywords.*' => ['required', 'string', 'max:50'],
            'member_hacker' => ['required', 'string', 'max:255'],
            'member_hipster1' => ['required', 'string', 'max:255'],
            'member_hipster2' => ['nullable', 'string', 'max:255'],
            'panel_member_1' => ['required', 'string', 'max:255'],
            'panel_member_2' => ['nullable', 'string', 'max:255'],
            'panel_member_3' => ['nullable', 'string', 'max:255'],
            'manuscript_path' => ['required', 'string'],
            'acm_path' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $tempManuscriptPath = $validated['manuscript_path'];
        $tempAcmPath = $validated['acm_path'];

        if (!Storage::exists($tempManuscriptPath) || !Storage::exists($tempAcmPath)) {
            return response()->json(['message' => 'One or more provided file paths are invalid.'], 404);
        }

        $tempPaths = [
            'manuscript' => $tempManuscriptPath,
            'acm' => $tempAcmPath,
        ];

        DB::beginTransaction();
        try {
            // Create Project
            $project = CapstoneProject::create([
                'title' => $validated['title'],
                'abstract' => $validated['abstract'],
                'adviser_id' => $user->userDetail->adviser_id,
                'submission_date' => now(),
                'submission_year' => now()->year,
            ]);

            // UPDATED: Handle Platform Types (Find or Create)
            $platformIds = [];
            foreach ($validated['platform_types'] as $platformName) {
                // Determine logic: find existing by name or create new
                $platform = PlatformType::firstOrCreate(
                    ['platform_name' => trim($platformName)]
                );
                $platformIds[] = $platform->id;
            }
            $project->platformTypes()->attach($platformIds);

            // Handle Keywords (Find or Create)
            $keywordIds = [];
            foreach ($validated['keywords'] as $keywordName) {
                $keyword = Keyword::firstOrCreate(['keyword_name' => trim($keywordName)]);
                $keywordIds[] = $keyword->id;
            }
            $project->keywords()->attach($keywordIds);

            // Create the ProjectResearcher entry
            $projectResearcher = ProjectResearcher::create([
                'project_id' => $project->id,
                'user_id' => $user->id,
                'member_hacker' => $validated['member_hacker'],
                'member_hipster1' => $validated['member_hipster1'],
                'member_hipster2' => $validated['member_hipster2'] ?? null,
            ]);

            // Create the Panel entry
            Panel::create([
                'project_researcher_id' => $projectResearcher->id,
                'panel_member_1' => $validated['panel_member_1'],
                'panel_member_2' => $validated['panel_member_2'] ?? null,
                'panel_member_3' => $validated['panel_member_3'] ?? null,
            ]);

            DB::commit();

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
            Storage::delete([$tempManuscriptPath, $tempAcmPath]);
            return response()->json(['message' => 'An unexpected error occurred during submission.'], 500);
        }
    }
}
