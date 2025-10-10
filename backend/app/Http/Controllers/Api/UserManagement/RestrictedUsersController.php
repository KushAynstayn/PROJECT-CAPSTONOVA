<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;

class RestrictedUsersController extends Controller
{
    /**
     * Display a paginated list of restricted users.
     * Supports searching by name and filtering by role.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
            ->where('status', 'restricted')
            ->latest(); // Order by most recently created

        // Apply search query if present
        $query->when($request->query('search'), function (Builder $q, string $searchTerm) {
            $q->where(function (Builder $subQuery) use ($searchTerm) {
                $subQuery->where('first_name', 'like', "%{$searchTerm}%")
                    ->orWhere('last_name', 'like', "%{$searchTerm}%")
                    ->orWhere('middle_name', 'like', "%{$searchTerm}%");
            });
        });

        // Apply role filter if present
        $query->when($request->query('role'), function (Builder $q, string $role) {
            // Ensure the role is a valid enum value from your migration
            $validRoles = ['Super Admin', 'Admin', 'Adviser', 'Proponent', 'Viewer'];
            if (in_array($role, $validRoles)) {
                $q->where('role', $role);
            }
        });

        $restrictedUsers = $query->paginate(50)->withQueryString();

        return response()->json($restrictedUsers);
    }

    /**
     * Restore one or more restricted users to 'active' status.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function restore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_ids'   => 'required|array|min:1',
            'user_ids.*' => 'required|integer|exists:users,id',
        ]);

        $usersToRestore = User::query()
            ->whereIn('id', $validated['user_ids'])
            ->where('status', 'restricted');

        $restoredCount = $usersToRestore->update(['status' => 'active']);

        if ($restoredCount === 0) {
            return response()->json([
                'message' => 'No restricted users found with the provided IDs or they were already active.'
            ], 404);
        }

        return response()->json([
            'message' => "Successfully restored {$restoredCount} user(s).",
            'count' => $restoredCount
        ]);
    }
}
