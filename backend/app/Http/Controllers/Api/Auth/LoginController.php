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

        $throttleKey = 'login-failed:' . $request->email;
        $maxAttempts = 5;

        $hashedEmail = hash('sha256', $request->email);
        $user = User::where('hashed_email', $hashedEmail)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey);

            if (RateLimiter::attempts($throttleKey) === $maxAttempts) {
                $superAdminIds = User::where('role', 'Super Admin')->pluck('id')->toArray();
                if (!empty($superAdminIds)) {
                    $message = "Suspicious activity: {$maxAttempts} failed login attempts detected for email: {$request->email}.";
                    SendNotification::dispatch(null, $message, $superAdminIds);
                    Log::warning("Excessive failed login attempts trigger for: {$request->email}");
                }
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'This account is ' . $user->status . '. Please contact an administrator.'], 403);
        }

        // Add email verification check
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Your email address is not verified. Please check your email for a verification link.',
                'resend_info' => 'To resend the link, POST your email to /api/auth/email/resend'
            ], 403);
        }

        // If 2FA is disabled, log the user in directly and start a session.
        if (config('auth.two_factor_enabled') === false) {
            RateLimiter::clear($throttleKey);
            Auth::login($user, $request->boolean('remember'));
            $request->session()->regenerate();

            $actionType = ActionType::firstOrCreate(['action_name' => 'login']);
            UserLog::create([
                'user_id' => $user->id,
                'action_type_id' => $actionType->id,
                'details' => 'User logged in successfully without 2FA.'
            ]);

            return response()->json([
                'message' => 'Login successful.',
                'user' => $user->load('userDetail'), // Eager load userDetail
                'two_factor_required' => false,
            ]);
        }

        // --- Start Two-Factor Authentication Process ---
        RateLimiter::clear($throttleKey);
        Auth::login($user);

        if ($request->boolean('remember')) {
            $request->session()->put('auth.remember', true);
        }

        $code = rand(100000, 999999);
        TwoFactorAuthentication::updateOrCreate(
            ['user_id' => $user->id],
            [
                'code' => $code,
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        SendTwoFactorCodeJob::dispatch($user, $code);

        return response()->json([
            'message' => 'A verification code has been sent to your email.',
            'two_factor_required' => true,
        ]);
    }
}
