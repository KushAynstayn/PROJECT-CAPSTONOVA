<?php

namespace App\Http\Controllers\Api\Util;

use App\Http\Controllers\Controller;
use App\Models\Keyword;
use App\Models\ProgrammingLanguage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ResourceController extends Controller
{
    /**
     * Get all keywords as a simple array, ordered by their usage frequency across all projects.
     * This is ideal for populating a dropdown or a tag selector.
     *
     * @return JsonResponse
     */
    public function keywords(): JsonResponse
    {
        // Select all keywords, join with projects, and count their usage.
        $keywords = DB::table('keywords')
            ->select('keywords.keyword_name', DB::raw('COUNT(project_keywords.project_id) as projects_count'))
            ->leftJoin('project_keywords', 'keywords.id', '=', 'project_keywords.keyword_id')
            ->groupBy('keywords.keyword_name')
            ->orderByDesc('projects_count')
            ->get()
            ->pluck('keyword_name');

        return response()->json($keywords);
    }

    /**
     * Get all programming languages as a simple array, ordered by their usage frequency.
     * This helps in suggesting the most popular languages/frameworks first.
     *
     * @return JsonResponse
     */
    public function programmingLanguages(): JsonResponse
    {
        // Select all programming languages, join with source codes, and count their usage.
        $languages = DB::table('programming_languages')
            ->select('programming_languages.language_name', DB::raw('COUNT(project_languages.source_code_id) as source_codes_count'))
            ->leftJoin('project_languages', 'programming_languages.id', '=', 'project_languages.language_id')
            ->groupBy('programming_languages.language_name')
            ->orderByDesc('source_codes_count')
            ->get()
            ->pluck('language_name');

        return response()->json($languages);
    }
}
