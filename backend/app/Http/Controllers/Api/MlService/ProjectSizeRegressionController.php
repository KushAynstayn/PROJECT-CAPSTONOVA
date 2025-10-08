<?php

namespace App\Http\Controllers\Api\MlService;

use App\Http\Controllers\Controller;
use App\Models\CapstoneProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProjectSizeRegressionController extends Controller
{
    /**
     * Prepares project data and sends it to the ML service to train the
     * project size regression model.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function train(): JsonResponse
    {
        // 1. Fetch all projects with the necessary related data
        $projects = CapstoneProject::with([
            'manuscript',
            'sourceCode.programmingLanguages'
        ])
            ->whereHas('manuscript') // Ensure the project has a manuscript with a size
            ->whereHas('sourceCode.programmingLanguages') // Ensure the project has languages
            ->get();

        if ($projects->isEmpty()) {
            return response()->json(['message' => 'No projects with sufficient data available for training.'], 404);
        }

        // 2. Transform the data into the format required by the FastAPI service
        $trainingData = $projects->map(function ($project) {
            $languages = $project->sourceCode->programmingLanguages;

            $language_count = $languages->count();
            $framework_count = $languages->where('is_framework', true)->count();

            // Calculate framework ratio, handle division by zero
            $framework_ratio = ($language_count > 0)
                ? (float) $framework_count / $language_count
                : 0;

            return [
                'submission_year' => (int) $project->submission_year,       // [cite: 182]
                'platform_type' => $project->platform_type,                 // [cite: 184]
                'language_count' => $language_count,
                'framework_ratio' => round($framework_ratio, 2),
                'project_size' => (float) $project->manuscript->project_size, // [cite: 292]
            ];
        });

        $payload = [
            'data' => $trainingData->values()->all(), // Use values()->all() to reset keys
        ];

        // 3. Send the data to the ML service endpoint
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL'), '/');
        $endpoint = $mlServiceUrl . '/models/project_size_regression/train';

        try {
            $response = Http::timeout(120)->post($endpoint, $payload);

            if ($response->successful()) {
                return response()->json([
                    'message' => 'Successfully sent data to ML service for training.',
                    'service_response' => $response->json(),
                ]);
            }

            // Forward the error from the ML service
            return response()->json([
                'message' => 'Failed to train model. The ML service responded with an error.',
                'service_status' => $response->status(),
                'service_response' => $response->json() ?? $response->body(),
            ], $response->status());
        } catch (\Exception $e) {
            Log::error('ML Service Connection Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Could not connect to the ML training service.',
                'error' => $e->getMessage(),
            ], 503); // 503 Service Unavailable
        }
    }

    /**
     * Accepts prediction data, validates it, and proxies the request
     * to the ML service to get a project size prediction.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function predict(Request $request): JsonResponse
    {
        // 1. Validate the incoming flat request data
        //    *** FIX: Use the injected $request object, not the Request facade ***
        $validator = Validator::make($request->all(), [
            'submission_year' => 'required|integer|digits:4',
            'platform_type' => ['required', 'string', Rule::in(['Web', 'Mobile', 'IoT', 'Desktop'])],
            'language_count' => 'required|integer|min:0',
            'framework_ratio' => 'required|numeric|between:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        // 2. Transform the flat, validated data into the nested structure required by the ML service
        $payload = [
            'data' => [
                [
                    'submission_year' => (int) $validatedData['submission_year'],
                    'platform_type' => $validatedData['platform_type'],
                    'language_count' => (int) $validatedData['language_count'],
                    'framework_ratio' => (float) $validatedData['framework_ratio'],
                ]
            ]
        ];

        // 3. Send the prepared payload to the ML service prediction endpoint
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL'), '/');
        $endpoint = $mlServiceUrl . '/models/project_size_regression/predict';

        try {
            $response = Http::timeout(30)->post($endpoint, $payload);

            // 4. Return the response from the ML service directly to the client
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            Log::error('ML Service Prediction Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Could not get a prediction from the ML service.',
                'error' => $e->getMessage(),
            ], 503);
        }
    }

    public function getPlot(Request $request)
    {
        // 1. Validate the 'plot_type' query parameter
        $validator = Validator::make($request->query(), [
            'plot_type' => ['required', 'string', Rule::in(['residuals', 'feature_importance'])],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // 2. Call the ML service to get the plot image
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL'), '/');
        $endpoint = $mlServiceUrl . '/models/project_size_regression/plot';

        try {
            $response = Http::timeout(30)->get($endpoint, [
                'plot_type' => $validated['plot_type'],
            ]);

            if ($response->successful()) {
                // 3. Return the image as a response with the correct content type
                return response($response->body())
                    ->header('Content-Type', $response->header('Content-Type') ?? 'image/png');
            }

            // Handle cases where the ML service returns an error
            return response()->json([
                'message' => 'The ML service could not generate the plot.',
                'service_response' => $response->json() ?? $response->body(),
            ], $response->status());
        } catch (\Exception $e) {
            Log::error('ML Service Plot Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Could not connect to the ML service to retrieve the plot.',
                'error' => $e->getMessage(),
            ], 503);
        }
    }
}
