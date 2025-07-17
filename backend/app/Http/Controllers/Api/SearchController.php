<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

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
        // 1. Validate all incoming request data.
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
            'year_from' => ['nullable', 'integer', 'digits:4'],
            'year_to' => ['nullable', 'integer', 'digits:4', 'gte:year_from'],
        ]);

        $query = CapstoneProject::query();

        // 2. Determine if this is an advanced search or a basic search
        $isAdvancedSearch = collect($validated)->except('q')->filter()->isNotEmpty();

        if ($isAdvancedSearch) {
            $this->applyAdvancedFilters($query, $validated);
        } elseif (!empty($validated['q'])) {
            // Basic search with escaped term
            $searchTerm = $this->escapeLike($validated['q']);
            $query->where('title', 'LIKE', '%' . $searchTerm . '%');
        }

        // 3. Eager load relationships and paginate the results
        $projects = $query->with([
            'projectResearcher.user',
            'keywords',
            'sourceCode.programmingLanguages',
            'adviser' // Eager-load the adviser relationship
        ])->paginate(10)->withQueryString(); // withQueryString appends filters to pagination links

        // 4. Transform the items for the final JSON response
        $transformedProjects = $projects->through(fn(CapstoneProject $project) => $this->transformProject($project));

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
        // Filter by title
        if (!empty($filters['title'])) {
            $searchTerm = $this->escapeLike($filters['title']);
            $query->where('title', 'LIKE', '%' . $searchTerm . '%');
        }

        // Filter by platform type
        if (!empty($filters['platform_type'])) {
            $query->where('platform_type', $filters['platform_type']);
        }

        // Filter by submission year range
        if (!empty($filters['year_from'])) {
            $query->where('submission_year', '>=', $filters['year_from']);
        }
        if (!empty($filters['year_to'])) {
            $query->where('submission_year', '<=', $filters['year_to']);
        }

        // Filter by adviser name
        if (!empty($filters['adviser'])) {
            $adviserName = $this->escapeLike($filters['adviser']);
            $query->whereHas('adviser', function (Builder $q) use ($adviserName) {
                $q->where('first_name', 'LIKE', "%{$adviserName}%")
                    ->orWhere('last_name', 'LIKE', "%{$adviserName}%");
            });
        }

        // Filter by authors (leader or members)
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
                                $userQuery->where('first_name', 'LIKE', "%{$searchTerm}%")
                                    ->orWhere('last_name', 'LIKE', "%{$searchTerm}%");
                            });
                    }
                });
            });
        }

        // Filter by keywords
        if (!empty($filters['keywords'])) {
            $query->whereHas('keywords', function (Builder $q) use ($filters) {
                $q->whereIn('keyword_name', $filters['keywords']);
            });
        }

        // Filter by programming languages
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
            'abstract_snippet' => Str::limit($project->abstract, 100),
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
     * Formats a collection of tags into a displayable array (e.g., "+N more").
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
        // Escape backslashes, then percent signs, then underscores
        return str_replace(
            ['\\', '%', '_'],
            ['\\\\', '\%', '\_'],
            $value
        );
    }
}
