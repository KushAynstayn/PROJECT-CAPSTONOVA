<?php

namespace App\Http\Controllers\Api\MlService;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\CapstoneProject;

class AssociationController extends Controller
{
    /**
     * Fetches project data, formats it, and calls the ML service to train the association model.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function train()
    {
        // 1. Fetch all capstone projects with their source code, languages, AND platform types.
        $projects = CapstoneProject::with([
            'sourceCode.programmingLanguages',
            'platformTypes'
        ])->get();

        // 2. Format the data into the structure required by the ML service.
        // We use flatMap here. If a project has multiple platforms, map() inside will create
        // multiple arrays, and flatMap will flatten them into the main collection.
        $formattedData = $projects->flatMap(function ($project) {
            // Ensure the project has a source code entry and associated languages
            if (!$project->sourceCode || $project->sourceCode->programmingLanguages->isEmpty()) {
                return [];
            }

            // Get the languages once for this project
            $languages = $project->sourceCode->programmingLanguages->pluck('language_name')->values()->all();

            // If the project has no platform types, we cannot create an association entry based on platform.
            // (Assuming we skip projects with no defined platform).
            if ($project->platformTypes->isEmpty()) {
                return [];
            }

            // Iterate through each platform type attached to the project
            // and create a separate entry for each one.
            return $project->platformTypes->map(function ($platform) use ($project, $languages) {
                return [
                    'project_id'    => $project->id,
                    'platform_type' => $platform->platform_name, // Single string (e.g., "Web")
                    'languages'     => $languages,               // Array (e.g., ["PHP", "HTML"])
                ];
            });
        })->values(); // Reset array keys to be a sequential JSON array

        if ($formattedData->isEmpty()) {
            return response()->json(['error' => 'No valid projects with languages and platforms found.'], 404);
        }

        // 3. Call the ML service's train endpoint.
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL'), '/') . '/data_mining/tech_stack_association/train';

        try {
            // We increase timeout as training can be computationally expensive
            $response = Http::timeout(60)->post($mlServiceUrl, [
                'data' => $formattedData,
            ]);

            // 4. Return the response from the ML service.
            return response()->json($response->json(), $response->status());
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            return response()->json([
                'error'   => 'Could not connect to the ML service.',
                'message' => $e->getMessage()
            ], 503);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'An unexpected error occurred.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calls the ML service to get the predicted association rules.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function predict()
    {
        // 1. Call the ML service's predict endpoint.
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL'), '/') . '/data_mining/tech_stack_association/predict';

        try {
            $response = Http::timeout(30)->get($mlServiceUrl);

            // 2. Return the JSON response from the ML service.
            return response()->json($response->json(), $response->status());
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            return response()->json([
                'error'   => 'Could not connect to the ML service.',
                'message' => $e->getMessage()
            ], 503);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'An unexpected error occurred.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
