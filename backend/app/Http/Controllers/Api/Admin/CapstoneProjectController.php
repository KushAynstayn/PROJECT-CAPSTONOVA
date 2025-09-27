<?php

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Pagination\LengthAwarePaginator;

class CapstoneProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return $this->getProjects($request, false);
    }

    public function getArchived(Request $request): JsonResponse
    {
        return $this->getProjects($request, true);
    }

    public function archive(int $projectId): JsonResponse
    {
        $affected = DB::table('capstone_projects')
            ->where('id', $projectId)
            ->update(['is_archived' => true, 'updated_at' => now()]);

        if ($affected === 0) {
            return response()->json(['message' => 'Project not found or already archived.'], 404);
        }

        return response()->json(['message' => 'Capstone project has been successfully archived.']);
    }

    public function unarchive(int $projectId): JsonResponse
    {
        $affected = DB::table('capstone_projects')
            ->where('id', $projectId)
            ->update(['is_archived' => false, 'updated_at' => now()]);

        if ($affected === 0) {
            return response()->json(['message' => 'Project not found or already un-archived.'], 404);
        }

        return response()->json(['message' => 'Capstone project has been successfully un-archived.']);
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
                'cp.platform_type',
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

        $transformedProjects = $projects->map(function ($project) use ($keywords, $languages) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'abstract_snippet' => Str::limit($project->abstract, 100),
                'submission_year' => $project->submission_year,
                'platform_type' => $project->platform_type,
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
