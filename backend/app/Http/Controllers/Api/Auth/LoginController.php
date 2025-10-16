<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendTwoFactorCodeJob;
use App\Models\ActionType;
use App\Models\TwoFactorAuthentication;
use App\Models\User;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // 👈 Import Auth facade
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Handle user login requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Hash the incoming email to find the user by the hashed_email column.
        $hashedEmail = hash('sha256', $request->email);
        $user = User::where('hashed_email', $hashedEmail)->first();

        // Verify user exists, password is correct, and status is active.
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'This account is ' . $user->status . '. Please contact an administrator.'], 403);
        }

        // If 2FA is disabled, log the user in directly and start a session.
        if (config('auth.two_factor_enabled') === false) {
            // Log the user into the session guard
            Auth::login($user);

            // Regenerate the session ID for security
            $request->session()->regenerate();

            $actionType = ActionType::firstOrCreate(['action_name' => 'login']);
            UserLog::create([
                'user_id' => $user->id,
                'action_type_id' => $actionType->id,
                'details' => 'User logged in successfully without 2FA.'
            ]);

            return response()->json([
                'message' => 'Login successful.',
                'user' => $user,
                // The token is no longer returned
                'two_factor_required' => false,
            ]);
        }

        // --- Start Two-Factor Authentication Process ---
        // Log the user in to a temporary "pending 2FA" session state.
        Auth::login($user);

        $code = rand(100000, 999999); // Generate a 6-digit code.

        // Store the encrypted code and its expiration time.
        TwoFactorAuthentication::updateOrCreate(
            ['user_id' => $user->id],
            [
                'code' => $code, // The model's mutator will handle encryption
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        // Dispatch a job to send the 2FA code via email.
        SendTwoFactorCodeJob::dispatch($user, $code);

        // Return a response indicating that 2FA is required.
        return response()->json([
            'message' => 'A verification code has been sent to your email.',
            'two_factor_required' => true,
        ]);
    }
}
