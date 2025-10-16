<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TwoFactorAuthentication;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\ActionType;
use App\Models\UserLog;
use Illuminate\Support\Facades\Auth; // <-- Make sure this is imported

class TwoFactorAuthController extends Controller
{
    /**
     * Verify the 2FA code and log the user in.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric|digits:6',
        ]);

        // This is your original, unchanged user lookup logic
        $hashedEmail = hash('sha256', $request->email);
        $user = User::where('hashed_email', $hashedEmail)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $twoFactorRecord = TwoFactorAuthentication::where('user_id', $user->id)->first();

        if (!$twoFactorRecord) {
            return response()->json(['message' => 'Verification code not found. Please try logging in again.'], 404);
        }

        if ($twoFactorRecord->isExpired()) {
            return response()->json(['message' => 'Your verification code has expired. Please try logging in again.'], 422);
        }

        if (!$twoFactorRecord->verifyCode($request->code)) {
            return response()->json(['message' => 'The provided verification code is incorrect.'], 422);
        }

        // --- Start of "Remember Me" Logic ---

        // Verification Successful
        $twoFactorRecord->delete();

        // 1. Get the 'remember' choice from the session
        $remember = $request->session()->pull('auth.remember', false);

        // 2. Log out the temporary session
        Auth::logout();

        // 3. Log the user back in permanently, applying the 'remember' setting
        Auth::login($user, $remember);

        // 4. Regenerate the session ID for security
        $request->session()->regenerate();

        // --- End of "Remember Me" Logic ---

        // This part remains the same
        $actionType = ActionType::firstOrCreate(['action_name' => 'login']);
        UserLog::create([
            'user_id' => $user->id,
            'action_type_id' => $actionType->id,
            'details' => 'User logged in successfully via 2FA.'
        ]);

        // The response is updated to remove the token
        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
        ]);
    }
}
