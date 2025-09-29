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

        // Sends the data to the FastAPI endpoint
        $response = Http::post('http://127.0.0.1:8001/cohere/vectorize-and-save', [
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

        // Sends the prompt to the FastAPI endpoint
        $response = Http::post('http://127.0.0.1:8001/cohere/suggest', [
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
}
