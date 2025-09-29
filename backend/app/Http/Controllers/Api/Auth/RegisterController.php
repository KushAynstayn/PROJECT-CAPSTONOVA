<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotification;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\Whitelist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
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
            // User validation rules. Note 'unique' rule is removed for manual checking.
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(['Proponent', 'Viewer'])],

            // UserDetail validation rules.
            'student_id' => ['required_if:role,Proponent', 'nullable', 'string', 'max:50'],
            'department' => ['required', 'string', 'max:50'],
            'program' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
        $email = $validated['email'];
        $hashedEmail = hash('sha256', $email);
        $adviserId = null;

        // Manually check for email uniqueness using the hashed email.
        if (User::where('hashed_email', $hashedEmail)->exists()) {
            return response()->json(['email' => ['The email has already been taken.']], 422);
        }

        // If the role is 'Proponent', validate against the whitelist using the correct fields.
        if ($validated['role'] === 'Proponent') {
            $whitelistEntry = Whitelist::where('student_id', $validated['student_id'])
                ->where('hashed_email', $hashedEmail)
                ->first();

            if (!$whitelistEntry) {
                return response()->json(['message' => 'Your Student ID and Email are not whitelisted for registration as a Proponent.'], 403);
            }
            // Capture the adviser_id from the whitelist entry[cite: 239].
            $adviserId = $whitelistEntry->adviser_id;
        }

        try {
            DB::beginTransaction();

            // Create the User record with encrypted and hashed email fields[cite: 19, 20].
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'encrypted_email' => Crypt::encryptString($email),
                'hashed_email' => $hashedEmail,
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'active',
            ]);

            // Create the associated UserDetail record.
            UserDetail::create([
                'user_id' => $user->id,
                'student_id' => $validated['student_id'] ?? 'N/A',
                'department' => $validated['department'],
                'program' => $validated['program'],
                'adviser_id' => $adviserId,
            ]);

            DB::commit();

            // If a Proponent registers, notify their adviser.
            if ($user->role === 'Proponent' && !is_null($adviserId)) {
                SendNotification::dispatch(
                    $adviserId,
                    "A new Proponent ({$user->first_name} {$user->last_name}) has registered under your advisement."
                );
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'Registered successfully.',
                'user' => $user->fresh('userDetail'),
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration Error: ' . $e->getMessage());
            return response()->json(['message' => 'An unexpected error occurred. Please try again later.'], 500);
        }
    }
}
