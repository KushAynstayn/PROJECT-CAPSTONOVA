<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TwoFactorAuthentication;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;
use App\Models\ActionType;
use App\Models\UserLog;

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

        // Use the model's method to check expiration
        if ($twoFactorRecord->isExpired()) {
            return response()->json(['message' => 'Your verification code has expired. Please try logging in again.'], 422);
        }

        // Use the model's method to verify the code
        if (!$twoFactorRecord->verifyCode($request->code)) {
            return response()->json(['message' => 'The provided verification code is incorrect.'], 422);
        }

        // Verification Successful
        $twoFactorRecord->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        $actionType = ActionType::firstOrCreate(['action_name' => 'login']);
        UserLog::create([
            'user_id' => $user->id,
            'action_type_id' => $actionType->id,
            'details' => 'User logged in successfully via 2FA.'
        ]);

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }
}
