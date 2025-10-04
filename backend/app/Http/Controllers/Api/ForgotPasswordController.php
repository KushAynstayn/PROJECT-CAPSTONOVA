<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail; // Import the Mailable
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail; // Import the Mail facade
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    /**
     * Handle a request to send a password reset link.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $hashedEmail = hash('sha256', $request->email);
        $user = User::where('hashed_email', $hashedEmail)->first();

        if (!$user) {
            return response()->json(['message' => 'If your email is in our system, you will receive a password reset link.'], 200);
        }

        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => Carbon::now()]
        );

        // --- Use the Mailable to send the email ---
        Mail::to($request->email)->send(new PasswordResetMail($token, $request->email));

        return response()->json(['message' => 'Password reset link sent.'], 200);
    }

    /**
     * Handle the actual password reset.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $resetRecord = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$resetRecord || $request->token !== $resetRecord->token || Carbon::parse($resetRecord->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['error' => 'Invalid or expired token.'], 422);
        }

        $hashedEmail = hash('sha256', $request->email);
        $user = User::where('hashed_email', $hashedEmail)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Your password has been reset successfully.'], 200);
    }
}
