<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Models\UserLog;
use App\Models\ActionType;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\SystemSetting;
use App\Jobs\SendNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Pagination\LengthAwarePaginator;

class CapstoneProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $settingRoleKey = strtolower($user->role);

        // Guard Clause: Check if the 'viewSubmissions' feature is enabled for the Admin role.
        $settingName = $settingRoleKey . '_viewSubmissions';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        if (!$isFeatureEnabled) {
            return response()->json([
                'message' => 'You do not have permission to view project submissions.'
            ], 403);
        }

        return $this->getProjects($request, false);
    }

    public function getArchived(Request $request): JsonResponse
    {
        return $this->getProjects($request, true);
    }

    public function archive(int $projectId): JsonResponse
    {
        $user = Auth::user();
        // Sanitize the role name to match the setting key format (e.g., "Super Admin" -> "superadmin")
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'archiveProjects' feature is enabled for the user's role
        $settingName = $settingRoleKey . '_archiveProjects';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        // This check now applies to all roles based on the setting
        if (!$isFeatureEnabled) {
            return response()->json([
                'message' => 'You do not have permission to archive projects.'
            ], 403);
        }

        $affected = DB::table('capstone_projects')
            ->where('id', $projectId)
            ->update(['is_archived' => true, 'updated_at' => now()]);

        if ($affected === 0) {
            return response()->json(['message' => 'Project not found or already archived.'], 404);
        }

        $project = DB::table('capstone_projects')->where('id', $projectId)->first();
        $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->toArray();
        $notificationMessage = "The capstone project titled '{$project->title}' has been archived.";

        // MODIFIED: Added a title to the notification dispatch.
        SendNotification::dispatch('Project Archived', $notificationMessage, null, $adminIds);

        $actionType = ActionType::firstOrCreate(['action_name' => 'archive_project']);
        UserLog::create([
            'user_id' => $user->id,
            'action_type_id' => $actionType->id,
            'details' => "Project '{$project->title}' archived."
        ]);

        return response()->json(['message' => 'Capstone project has been successfully archived.']);
    }

    public function unarchive(int $projectId): JsonResponse
    {
        $user = Auth::user();
        // Sanitize the role name to match the setting key format (e.g., "Super Admin" -> "superadmin")
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'restoreProjects' feature is enabled for the user's role
        $settingName = $settingRoleKey . '_restoreProjects';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        // This check now applies to all roles based on the setting
        if (!$isFeatureEnabled) {
            return response()->json([
                'message' => 'You do not have permission to restore projects.'
            ], 403);
        }

        $affected = DB::table('capstone_projects')
            ->where('id', $projectId)
            ->update(['is_archived' => false, 'updated_at' => now()]);

        if ($affected === 0) {
            return response()->json(['message' => 'Project not found or is already restored.'], 404);
        }

        $project = DB::table('capstone_projects')->where('id', $projectId)->first();
        $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->toArray();
        $notificationMessage = "The capstone project titled '{$project->title}' has been restored.";

        // MODIFIED: Added a title to the notification dispatch.
        SendNotification::dispatch('Project Restored', $notificationMessage, null, $adminIds);

        $actionType = ActionType::firstOrCreate(['action_name' => 'unarchive_project']);
        UserLog::create([
            'user_id' => $user->id,
            'action_type_id' => $actionType->id,
            'details' => "Project '{$project->title}' restored."
        ]);

        return response()->json(['message' => 'Capstone project has been successfully restored.']);
    }

    private function getProjects(Request $request, bool $isArchived): JsonResponse
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 6);
        $search = $request->input('search');
        $startYear = $request->input('start_year');
        $endYear = $request->input('end_year');
        $offset = ($page - 1) * $perPage;

        // Base query for fetching project data
        $query = DB::table('capstone_projects AS cp')
            ->select(
                'cp.id',
                'cp.title',
                'cp.abstract',
                'cp.submission_year',
                // REMOVED: 'cp.platform_type', (Column no longer exists)
                'adviser.first_name AS adviser_first_name',
                'adviser.last_name AS adviser_last_name',
                'leader.first_name AS leader_first_name',
                'leader.last_name AS leader_last_name',
                'pr.member_hacker',
                'pr.member_hipster1',
                'pr.member_hipster2',
                'cm.manuscript_id',
                'csc.id AS source_code_id'
            )
            ->leftJoin('users AS adviser', 'cp.adviser_id', '=', 'adviser.id')
            ->leftJoin('project_researchers AS pr', 'cp.id', '=', 'pr.project_id')
            ->leftJoin('users AS leader', 'pr.user_id', '=', 'leader.id')
            ->leftJoin('capstone_manuscripts AS cm', 'cp.id', '=', 'cm.project_id')
            ->leftJoin('capstone_source_codes AS csc', 'cp.id', '=', 'csc.project_id')
            ->where('cp.is_archived', $isArchived);

        // *** THE FIX: The count query MUST also have the same joins to be searchable ***
        $countQuery = DB::table('capstone_projects AS cp')
            ->leftJoin('users AS adviser', 'cp.adviser_id', '=', 'adviser.id')
            ->leftJoin('project_researchers AS pr', 'cp.id', '=', 'pr.project_id')
            ->leftJoin('users AS leader', 'pr.user_id', '=', 'leader.id')
            ->where('cp.is_archived', $isArchived);

        // Apply search filter if present
        if ($search) {
            $searchTerm = '%' . $search . '%';
            $searchLogic = function ($q) use ($searchTerm) {
                $q->where('cp.title', 'LIKE', $searchTerm)
                    ->orWhere('cp.abstract', 'LIKE', $searchTerm)
                    ->orWhere('adviser.first_name', 'LIKE', $searchTerm)
                    ->orWhere('adviser.last_name', 'LIKE', $searchTerm)
                    ->orWhere('leader.first_name', 'LIKE', $searchTerm)
                    ->orWhere('leader.last_name', 'LIKE', $searchTerm);
            };

            $query->where($searchLogic);
            $countQuery->where($searchLogic);
        }

        // Apply year filters if present
        if ($startYear && $endYear) {
            $query->whereBetween('cp.submission_year', [$startYear, $endYear]);
            $countQuery->whereBetween('cp.submission_year', [$startYear, $endYear]);
        } elseif ($startYear) {
            $query->where('cp.submission_year', '>=', $startYear);
            $countQuery->where('cp.submission_year', '>=', $startYear);
        } elseif ($endYear) {
            $query->where('cp.submission_year', '<=', $endYear);
            $countQuery->where('cp.submission_year', '<=', $endYear);
        }

        $total = $countQuery->count();
        $projects = $query->orderBy('cp.created_at', 'DESC')
            ->offset($offset)
            ->limit($perPage)
            ->get();

        $projectIds = $projects->pluck('id')->toArray();
        $keywords = $this->getKeywordsForProjects($projectIds);
        $languages = $this->getLanguagesForProjects($projectIds);
        // NEW: Fetch platforms
        $platforms = $this->getPlatformsForProjects($projectIds);

        $transformedProjects = $projects->map(function ($project) use ($keywords, $languages, $platforms) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'abstract_snippet' => Str::limit($project->abstract, 100),
                'submission_year' => $project->submission_year,
                // UPDATED: Now returns an array of strings (e.g., ['Web', 'Mobile'])
                'platform_type' => $platforms[$project->id] ?? [],
                'adviser_name' => trim("{$project->adviser_first_name} {$project->adviser_last_name}"),
                'project_leader' => trim("{$project->leader_first_name} {$project->leader_last_name}"),
                'manuscript_id' => $project->manuscript_id,
                'source_code_id' => $project->source_code_id,
                'keyword_tags' => $keywords[$project->id] ?? [],
                'language_tags' => $languages[$project->id] ?? [],
            ];
        });

        $paginator = new LengthAwarePaginator($transformedProjects, $total, $perPage, $page, [
            'path' => $request->url(),
            'query' => $request->query(),
        ]);

        return response()->json($paginator);
    }

    private function getKeywordsForProjects(array $projectIds): array
    {
        if (empty($projectIds)) return [];

        $results = DB::table('project_keywords')
            ->join('keywords', 'project_keywords.keyword_id', '=', 'keywords.id')
            ->whereIn('project_keywords.project_id', $projectIds)
            ->select('project_keywords.project_id', 'keywords.keyword_name')
            ->get();

        return $this->groupRelatedData($results, 'project_id', 'keyword_name');
    }

    // NEW: Helper method to fetch platform types
    private function getPlatformsForProjects(array $projectIds): array
    {
        if (empty($projectIds)) return [];

        $results = DB::table('project_platforms')
            ->join('platform_types', 'project_platforms.platform_type_id', '=', 'platform_types.id')
            ->whereIn('project_platforms.project_id', $projectIds)
            ->select('project_platforms.project_id', 'platform_types.platform_name')
            ->get();

        return $this->groupRelatedData($results, 'project_id', 'platform_name');
    }

    private function getLanguagesForProjects(array $projectIds): array
    {
        if (empty($projectIds)) return [];

        $results = DB::table('capstone_source_codes as csc')
            ->join('project_languages', 'csc.id', '=', 'project_languages.source_code_id')
            ->join('programming_languages', 'project_languages.language_id', '=', 'programming_languages.id')
            ->whereIn('csc.project_id', $projectIds)
            ->select('csc.project_id', 'programming_languages.language_name')
            ->get();

        return $this->groupRelatedData($results, 'project_id', 'language_name');
    }

    private function groupRelatedData($results, string $key, string $valueColumn): array
    {
        $grouped = [];
        foreach ($results as $result) {
            $grouped[$result->$key][] = $result->$valueColumn;
        }
        return $grouped;
    }
}
