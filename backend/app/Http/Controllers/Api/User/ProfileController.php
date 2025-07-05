<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
     /**
     * Display the authenticated user's profile.
     *
     * Retrieves the currently authenticated user along with their associated
     * user details and returns them in a JSON response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request): JsonResponse
    {
        // Eager load the userDetail relationship to avoid extra queries.
        $user = $request->user()->load('userDetail');

        return response()->json($user);
    }

    /**
     * Update the authenticated user's profile.
     *
     * Validates and updates the user's information. Only specified
     * fields are mutable, and validation is handled within this method.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            // User model fields
            'first_name' => ['sometimes', 'required', 'string', 'max:100'],
            'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'confirmed', Password::min(8)],

            // UserDetail model fields (conditionally updatable)
            'department' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                // Prohibit this field unless the user is a Proponent or Viewer.
                Rule::when(!in_array($user->role, ['Proponent', 'Viewer']), ['prohibited']),
            ],
            'program' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                // Prohibit this field unless the user is a Proponent or Viewer.
                Rule::when(!in_array($user->role, ['Proponent', 'Viewer']), ['prohibited']),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Update the User model fields from the request.
        $user->fill($request->only(['first_name', 'last_name', 'middle_name']));

        // Hash and update the password only if it was provided.
        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Conditionally update the UserDetail model fields if they exist.
        if ($user->userDetail && ($request->has('department') || $request->has('program'))) {
            $user->userDetail->update($request->only(['department', 'program']));
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh('userDetail'), // Return the updated user data.
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
