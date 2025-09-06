<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SuggestionController extends Controller
{
    /**
     * Display a listing of suggestions with filtering capabilities.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $query = Suggestion::with(['adviser' => function ($query) {
                $query->select('id', 'first_name', 'last_name', 'email');
            }, 'interestedStudent' => function ($query) {
                $query->select('id', 'first_name', 'last_name', 'email');
            }]);

            // Filter by current user's suggestions (as adviser)
            if ($request->has('my_suggestions') && $request->boolean('my_suggestions')) {
                $query->where('adviser_id', $user->id);
            }

            // Filter by current user's archived suggestions (as adviser)
            if ($request->has('my_archived_suggestions') && $request->boolean('my_archived_suggestions')) {
                $query->where('adviser_id', $user->id)
                    ->where('is_archived', true);
            }

            // Filter by current user's interested suggestions (as student)
            if ($request->has('my_interested_suggestions') && $request->boolean('my_interested_suggestions')) {
                $query->where('interested_student_id', $user->id);
            }

            // Filter by specific user ID as adviser
            if ($request->has('user_adviser_id')) {
                $query->where('adviser_id', $request->input('user_adviser_id'));
            }

            // Filter by specific user ID as interested student
            if ($request->has('user_interested_id')) {
                $query->where('interested_student_id', $request->input('user_interested_id'));
            }

            // Filter by adviser name
            if ($request->has('adviser_name')) {
                $adviserName = $request->input('adviser_name');
                $query->whereHas('adviser', function ($q) use ($adviserName) {
                    $q->where('first_name', 'like', "%{$adviserName}%")
                        ->orWhere('last_name', 'like', "%{$adviserName}%");
                });
            }

            // Filter by adviser ID
            if ($request->has('adviser_id')) {
                $query->where('adviser_id', $request->input('adviser_id'));
            }

            // Filter by year
            if ($request->has('year')) {
                $query->whereYear('submission_date', $request->input('year'));
            }

            // Filter by month
            if ($request->has('month')) {
                $query->whereMonth('submission_date', $request->input('month'));
            }

            // Filter by day
            if ($request->has('day')) {
                $query->whereDay('submission_date', $request->input('day'));
            }

            // Filter by specific date
            if ($request->has('date')) {
                $query->whereDate('submission_date', $request->input('date'));
            }

            // Filter by date range
            if ($request->has('start_date')) {
                $query->whereDate('submission_date', '>=', $request->input('start_date'));
            }

            if ($request->has('end_date')) {
                $query->whereDate('submission_date', '<=', $request->input('end_date'));
            }

            // Filter by archived status
            if ($request->has('is_archived')) {
                $isArchived = filter_var($request->input('is_archived'), FILTER_VALIDATE_BOOLEAN);
                $query->where('is_archived', $isArchived);
            }

            // Filter by title
            if ($request->has('title')) {
                $query->where('title', 'like', "%{$request->input('title')}%");
            }

            // Filter by suggestion text/content
            if ($request->has('content')) {
                $query->where('suggestion_text', 'like', "%{$request->input('content')}%");
            }

            // Sort by different fields
            $sortBy = $request->input('sort_by', 'submission_date');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Get paginated results (default 15 per page)
            $perPage = $request->input('per_page', 15);
            $suggestions = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $suggestions,
                'current_user_id' => $user->id,
                'message' => 'Suggestions retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve suggestions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified suggestion.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $suggestion = Suggestion::with(['adviser' => function ($query) {
                $query->select('id', 'first_name', 'last_name', 'email');
            }, 'interestedStudent' => function ($query) {
                $query->select('id', 'first_name', 'last_name', 'email');
            }])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $suggestion,
                'message' => 'Suggestion retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Suggestion not found'
            ], 404);
        }
    }

    /**
     * Get suggestions statistics for the current user
     *
     * @return JsonResponse
     */
    public function statistics(): JsonResponse
    {
        try {
            $user = Auth::user();

            $stats = [
                'total_suggestions_as_adviser' => Suggestion::where('adviser_id', $user->id)->count(),
                'archived_suggestions_as_adviser' => Suggestion::where('adviser_id', $user->id)
                    ->where('is_archived', true)->count(),
                'active_suggestions_as_adviser' => Suggestion::where('adviser_id', $user->id)
                    ->where('is_archived', false)->count(),
                'suggestions_with_interest' => Suggestion::where('adviser_id', $user->id)
                    ->whereNotNull('interested_student_id')->count(),
                'total_interested_suggestions' => Suggestion::where('interested_student_id', $user->id)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}
