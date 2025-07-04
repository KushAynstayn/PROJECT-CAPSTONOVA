<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\Whitelist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RegisterController extends Controller
{
    /**
     * Handle user registration requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // User validation rules based on the 'users' table migration.
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(['Proponent', 'Viewer'])], // Only allows public roles.

            // UserDetail validation rules based on the 'user_details' table migration.
            'student_id' => ['required_if:role,Proponent', 'nullable', 'string', 'max:50'],
            'department' => ['required', 'string', 'max:50'],
            'program' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
        $adviserId = null;

        // If the role is 'Proponent', validate against the whitelist.
        if ($validated['role'] === 'Proponent') {
            $whitelistEntry = Whitelist::where('student_id', $validated['student_id'])
                ->where('student_email', $validated['email'])
                ->first();

            if (!$whitelistEntry) {
                return response()->json(['message' => 'Student not authorized for registration.'], 403);
            }
            // Capture the adviser_id from the whitelist entry.
            $adviserId = $whitelistEntry->adviser_id;
        }

        try {
            DB::beginTransaction();

            // Create the User record.
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'active', // Default status for new users.
            ]);

            // Create the associated UserDetail record.
            UserDetail::create([
                'user_id' => $user->id,
                'student_id' => $validated['student_id'] ?? 'N/A', // Use 'N/A' or similar for Viewers.
                'department' => $validated['department'],
                'program' => $validated['program'],
                'adviser_id' => $adviserId, // Assign adviser if Proponent, otherwise null.
            ]);

            DB::commit();

            // Create a Sanctum token for the new user.
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Registered successfully.',
                'user' => $user->fresh('userDetail'), // Eager load the details.
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            // Log the exception message for debugging.
            Log::error('Registration Error: ' . $e->getMessage());
            return response()->json(['message' => 'An unexpected error occurred. Please try again later.'], 500);
        }
    }
}