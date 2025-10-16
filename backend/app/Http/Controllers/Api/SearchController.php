<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\SystemSetting;
use App\Models\CapstoneProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

/**
 * Handles searching for capstone projects.
 */
class SearchController extends Controller
{
    /**
     * Search for capstone projects based on basic or advanced criteria.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        // With session-based authentication, Laravel's middleware handles user retrieval.
        // We can simply use Auth::user(), which returns the authenticated user or null for guests.
        $user = Auth::user();

        // This permission check ONLY applies if the user is an Admin or an Adviser.
        // Guests and other roles skip this.
        if ($user && in_array($user->role, ['Admin', 'Adviser'])) {
            $settingRoleKey = strtolower(str_replace(' ', '', $user->role));
            $settingName = $settingRoleKey . '_searchProjects';

            $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
                $setting = SystemSetting::where('setting_name', $settingName)->first();
                return $setting ? $setting->is_enabled : false; // Default to false if not found
            });

            if (!$isFeatureEnabled) {
                return response()->json([
                    'message' => 'The project search feature is currently disabled for your role.'
                ], 403);
            }
        }

        // The rest of your validation and query logic remains unchanged.
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'authors' => ['nullable', 'array'],
            'authors.*' => ['required_with:authors', 'string', 'max:255'],
            'adviser' => ['nullable', 'string', 'max:255'],
            'platform_type' => ['nullable', 'string', 'max:50'],
            'keywords' => ['nullable', 'array'],
            'keywords.*' => ['required_with:keywords', 'string', 'max:50'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['required_with:languages', 'string', 'max:50'],
            'submission_year' => ['nullable', 'integer', 'digits:4'],
            'year_from' => ['nullable', 'integer', 'digits:4'],
            'year_to' => ['nullable', 'integer', 'digits:4', 'gte:year_from'],
        ]);

        $query = CapstoneProject::query();

        if (!empty($validated['q'])) {
            $searchTerm = $this->escapeLike($validated['q']);
            $query->where(function (Builder $q) use ($searchTerm) {
                $q->where('title', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('abstract', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        $advancedFilters = collect($validated)->except('q')->filter()->all();
        if (!empty($advancedFilters)) {
            $this->applyAdvancedFilters($query, $advancedFilters);
        }

        $projects = $query->with([
            'projectResearcher.user',
            'keywords',
            'sourceCode.programmingLanguages',
            'adviser'
        ])->paginate(10)->withQueryString();

        $transformedProjects = $projects->through(
            fn(CapstoneProject $project) => $this->transformProject($project)
        );

        return response()->json($transformedProjects);
    }

    /**
     * Apply advanced search filters to the query builder.
     *
     * @param Builder $query
     * @param array $filters The validated filter data.
     * @return void
     */
    private function applyAdvancedFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['title'])) {
            $searchTerm = $this->escapeLike($filters['title']);
            $query->where('title', 'LIKE', '%' . $searchTerm . '%');
        }

        if (!empty($filters['platform_type'])) {
            $query->where('platform_type', $filters['platform_type']);
        }

        if (!empty($filters['submission_year'])) {
            $query->where('submission_year', $filters['submission_year']);
        } else {
            if (!empty($filters['year_from'])) {
                $query->where('submission_year', '>=', $filters['year_from']);
            }
            if (!empty($filters['year_to'])) {
                $query->where('submission_year', '<=', $filters['year_to']);
            }
        }

        if (!empty($filters['adviser'])) {
            $adviserName = $this->escapeLike($filters['adviser']);
            $query->whereHas('adviser', function (Builder $q) use ($adviserName) {
                $q->where(DB::raw("CONCAT_WS(' ', first_name, middle_name, last_name)"), 'LIKE', "%{$adviserName}%");
            });
        }

        if (!empty($filters['authors'])) {
            $authors = $filters['authors'];
            $query->whereHas('projectResearcher', function (Builder $q) use ($authors) {
                $q->where(function (Builder $authorQuery) use ($authors) {
                    foreach ($authors as $author) {
                        $searchTerm = $this->escapeLike($author);
                        $authorQuery->orWhere('member_hacker', 'LIKE', "%{$searchTerm}%")
                            ->orWhere('member_hipster1', 'LIKE', "%{$searchTerm}%")
                            ->orWhere('member_hipster2', 'LIKE', "%{$searchTerm}%")
                            ->orWhereHas('user', function (Builder $userQuery) use ($searchTerm) {
                                $userQuery->where(DB::raw("CONCAT_WS(' ', first_name, middle_name, last_name)"), 'LIKE', "%{$searchTerm}%");
                            });
                    }
                });
            });
        }

        if (!empty($filters['keywords'])) {
            $query->whereHas('keywords', function (Builder $q) use ($filters) {
                $q->whereIn('keyword_name', $filters['keywords']);
            });
        }

        if (!empty($filters['languages'])) {
            $query->whereHas('sourceCode.programmingLanguages', function (Builder $q) use ($filters) {
                $q->whereIn('language_name', $filters['languages']);
            });
        }
    }

    /**
     * Transform a single project model into the desired JSON format.
     *
     * @param CapstoneProject $project
     * @return array
     */
    private function transformProject(CapstoneProject $project): array
    {
        $researcher = $project->projectResearcher;
        $leader = $researcher?->user;
        $adviser = $project->adviser;

        return [
            'id' => $project->id,
            'title' => $project->title,
            'abstract_snippet' => \Illuminate\Support\Str::limit($project->abstract, 100),
            'submission_year' => $project->submission_year,
            'platform_type' => $project->platform_type,
            'adviser_name' => $adviser ? "{$adviser->first_name} {$adviser->last_name}" : null,
            'keyword_tags' => $this->formatTags($project->keywords, 'keyword_name'),
            'language_tags' => $this->formatTags($project->sourceCode?->programmingLanguages, 'language_name'),
            'team_roles' => [
                'leader' => $leader ? "{$leader->first_name} {$leader->last_name}" : null,
                'hacker' => $researcher->member_hacker ?? null,
                'hipster1' => $researcher->member_hipster1 ?? null,
                'hipster2' => $researcher->member_hipster2 ?? null,
            ]
        ];
    }

    /**
     * Formats a collection of tags into a displayable array.
     *
     * @param Collection|null $tags
     * @param string $key
     * @return array
     */
    private function formatTags(?Collection $tags, string $key): array
    {
        if (is_null($tags) || $tags->isEmpty()) {
            return [];
        }

        $count = $tags->count();
        $displayTags = $tags->take(3)->pluck($key)->toArray();

        if ($count > 3) {
            $displayTags[] = sprintf('+%d more', $count - 3);
        }

        return $displayTags;
    }

    /**
     * Escapes special characters for SQL LIKE conditions.
     *
     * @param string $value
     * @return string
     */
    private function escapeLike(string $value): string
    {
        return str_replace(
            ['\\', '%', '_'],
            ['\\\\', '\%', '\_'],
            $value
        );
    }
}
