<?php

namespace App\Http\Controllers\Api\Admin;

use Throwable;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Api\Admin\StoreAdviserRequest;

class AdviserController extends Controller
{
    /**
     * Store a newly created adviser in storage.
     *
     * @param StoreAdviserRequest $request
     * @return JsonResponse
     */
    public function store(StoreAdviserRequest $request): JsonResponse
    {

        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $validatedData = $request->validated();

        try {
            $adviser = DB::transaction(function () use ($validatedData) {
                // 1. Create the User record
                $newUser = User::create([
                    'first_name' => $validatedData['first_name'],
                    'last_name'  => $validatedData['last_name'],
                    'middle_name' => $validatedData['middle_name'] ?? null,
                    'email'      => $validatedData['email'],
                    'password'   => Hash::make($validatedData['password']),
                    'role'       => 'Adviser',
                    'status'     => 'active',
                ]);

                // 2. Create the associated UserDetail record
                UserDetail::create([
                    'user_id'    => $newUser->id,
                    'student_id' => 'N/A', // Placeholder as Adviser is not a student
                    'department' => $validatedData['department'],
                    'program'    => $validatedData['program'] ?? null,
                    'adviser_id' => $newUser->id, // Satisfies non-nullable foreign key
                ]);

                return $newUser;
            });

            // Load the new details and return the complete adviser object
            return response()->json($adviser->load('userDetail'), 201);
        } catch (Throwable $e) {
            report($e);
            return response()->json([
                'message' => 'An unexpected error occurred while creating the adviser.'
            ], 500);
        }
    }


    /**
     * Set the specified adviser's status to 'restricted'.
     *
     * @param User $user The user instance injected by route-model binding.
     * @return JsonResponse
     */
    public function restrict(User $user): JsonResponse
    {
        // 1. Verify the user has the 'Adviser' role.
        if ($user->role !== 'Adviser') {
            return response()->json(['message' => 'User is not an adviser.'], 404);
        }

        // 2. Update the status to 'restricted'.
        $user->status = 'restricted';
        $user->save();

        // 3. Return a success response with the updated adviser data.
        return response()->json([
            'message' => 'Adviser has been successfully restricted.',
            'adviser' => $user->load('userDetail'),
        ], 200);
    }
}
