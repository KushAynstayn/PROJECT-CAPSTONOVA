<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendVerificationEmailJob;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;

class VerificationController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verify(Request $request, $id, $hash)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Invalid user.'], 404);
        }

        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 401);
        }

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link.'], 401);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified. You may log in.']);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json(['message' => 'Email successfully verified. You may now log in.']);
    }

    /**
     * Resend the email verification notification.
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|string',
        ]);

        $hashedEmail = hash('sha256', $request->email);
        $user = User::where('hashed_email', $hashedEmail)->first();

        if (!$user) {
            return response()->json(['message' => 'No user found with that email address.'], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'This email address is already verified.'], 400);
        }

        try {
            $decryptedEmail = $user->getEmailForVerification();
            $hash = sha1($decryptedEmail);

            $backendVerificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(config('auth.verification.expire', 60)),
                [
                    'id' => $user->id,
                    'hash' => $hash,
                ]
            );

            // MODIFIED: Parse the backend URL to extract query parameters
            $parts = parse_url($backendVerificationUrl);
            parse_str($parts['query'], $query); // $query will be ['expires' => '...', 'signature' => '...']

            // MODIFIED: Pass the plain-text email and individual URL parts
            SendVerificationEmailJob::dispatch(
                $decryptedEmail,
                (string) $user->id,
                $hash,
                $query['expires'],
                $query['signature']
            );

            return response()->json(['message' => 'A new verification link has been sent to your email.']);
        } catch (\Exception $e) {
            Log::error("Failed to resend verification email for {$request->email}: " . $e->getMessage());
            return response()->json(['message' => 'An error occurred while sending the email.'], 500);
        }
    }
}
