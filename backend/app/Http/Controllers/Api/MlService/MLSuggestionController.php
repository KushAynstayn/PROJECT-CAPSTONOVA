<?php

namespace App\Http\Controllers\Api\MlService;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Suggestion; // Make sure you have a Suggestion model

class MLSuggestionController extends Controller
{
    /**
     * Sends all suggestions from the database to the Python ML service 
     * for vectorization and saving.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendTrainingData()
    {
        // Fetches all suggestions, formatting them for the Python service
        $suggestions = Suggestion::all(['title', 'suggestion_text'])->toArray();

        // Use env variable for ML service base URL, fallback to localhost
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL', 'http://127.0.0.1:8001'), '/');

        // Sends the data to the FastAPI endpoint
        $response = Http::post("{$mlServiceUrl}/cohere/vectorize-and-save", [
            'data' => $suggestions
        ]);

        // Returns the response from the Python service
        return response()->json($response->json(), $response->status());
    }


    /**
     * Gets an AI-powered suggestion from the Python ML service based on a text prompt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSuggestion(Request $request)
    {
        // Validates that the request has a 'query_text' field
        $validated = $request->validate([
            'query_text' => 'required|string',
        ]);

        // Use env variable for ML service base URL, fallback to localhost
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL', 'http://127.0.0.1:8001'), '/');

        // Sends the prompt to the FastAPI endpoint
        $response = Http::post("{$mlServiceUrl}/cohere/suggest", [
            'query_text' => $validated['query_text']
        ]);

        // Check if the request to the Python service was successful
        // and if the 'ai_response' key exists in the JSON body.
        if ($response->successful() && isset($response->json()['ai_response'])) {

            // Extract only the 'ai_response' from the full response
            $aiResponse = $response->json()['ai_response'];

            // Return a new JSON response containing only the AI-generated text
            return response()->json(['ai_response' => $aiResponse]);
        }

        return response()->json($response->json(), $response->status());
    }

    /**
     * Generates a new capstone project idea using the ML service.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateIdea(Request $request)
    {
        // Validates the incoming request payload
        $validated = $request->validate([
            'platform' => 'required|string',
            'field' => 'required|string',
            'additional_note' => 'nullable|string', // 'nullable' makes this field optional
        ]);

        // Use env variable for ML service base URL, fallback to localhost
        $mlServiceUrl = rtrim(env('ML_SERVICE_URL', 'http://127.0.0.1:8001'), '/');

        // Forwards the validated data to the ML service endpoint
        $response = Http::post("{$mlServiceUrl}/cohere/generate-idea", $validated);

        // Check for a successful response and the presence of the 'ai_response' key
        if ($response->successful() && isset($response->json()['ai_response'])) {
            // Extract and return only the AI-generated text
            return response()->json([
                'ai_response' => $response->json()['ai_response']
            ]);
        }

        // If the request failed or the response is malformed, return the original response
        return response()->json($response->json(), $response->status());
    }
}
