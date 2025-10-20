<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotification;
use App\Jobs\SendTwoFactorCodeJob;
use App\Models\ActionType;
use App\Models\TwoFactorAuthentication;
use App\Models\User;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
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
            'remember' => 'sometimes|boolean',
        ]);

        // MODIFIED: Define throttle key and max attempts
        $throttleKey = 'login-failed:' . $request->email;
        $maxAttempts = 5; // Set the limit for failed attempts

        // Hash the incoming email to find the user by the hashed_email column.
        $hashedEmail = hash('sha256', $request->email);
        $user = User::where('hashed_email', $hashedEmail)->first();

        // Verify user exists, password is correct, and status is active.
        if (!$user || !Hash::check($request->password, $user->password)) {
            // MODIFIED: Handle failed login attempt
            RateLimiter::hit($throttleKey);

            // Check if this attempt just hit the limit
            if (RateLimiter::attempts($throttleKey) === $maxAttempts) {
                // Find all Super Admins
                $superAdminIds = User::where('role', 'Super Admin')->pluck('id')->toArray();

                if (!empty($superAdminIds)) {
                    $message = "Suspicious activity: {$maxAttempts} failed login attempts detected for email: {$request->email}.";
                    // Dispatch notification to all Super Admins
                    SendNotification::dispatch(null, $message, $superAdminIds);
                    Log::warning("Excessive failed login attempts trigger for: {$request->email}");
                }
            }
            // End of modification

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'This account is ' . $user->status . '. Please contact an administrator.'], 403);
        }

        // If 2FA is disabled, log the user in directly and start a session.
        if (config('auth.two_factor_enabled') === false) {
            // MODIFIED: Clear the failed login attempt counter on success
            RateLimiter::clear($throttleKey);

            // Log the user into the session guard
            // 2. Pass the 'remember' boolean to Auth::login()
            Auth::login($user, $request->boolean('remember'));

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
                'two_factor_required' => false,
            ]);
        }

        // --- Start Two-Factor Authentication Process ---
        // Log the user in to a temporary "pending 2FA" session state.
        // We will handle the 'remember' flag in the 2FA verification step.

        // MODIFIED: Clear the failed login attempt counter on success
        RateLimiter::clear($throttleKey);

        Auth::login($user);

        // Store the remember me flag in the session to use it after 2FA verification.
        if ($request->boolean('remember')) {
            $request->session()->put('auth.remember', true);
        }

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
