<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendNotification;
use App\Models\ActionType;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\UserLog;
use App\Models\Whitelist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Jobs\SendVerificationEmailJob;
use Illuminate\Support\Facades\URL;

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
        // Define custom messages for validation
        $messages = [
            'email.regex' => 'The email must be a valid @ctu.edu.ph address.',
        ];

        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'email', 'max:255', 'regex:/^.+@ctu\.edu\.ph$/i'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(['Proponent', 'Viewer'])],
            'student_id' => ['required_if:role,Proponent', 'nullable', 'string', 'max:50'],
            'department' => ['required', 'string', 'max:50'],
            'program' => ['required', 'string', 'max:50'],
        ], $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validated = $validator->validated();
        $email = $validated['email'];
        $hashedEmail = hash('sha256', $email);
        $adviserId = null;

        // Check if the selected role is 'Viewer' and if registration for that role is enabled.
        if ($validated['role'] === 'Viewer') {
            $settingName = 'viewer_registerAccount';
            $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
                $setting = SystemSetting::where('setting_name', $settingName)->first();
                return $setting ? $setting->is_enabled : false; // Default to false
            });

            if (!$isFeatureEnabled) {
                return response()->json(
                    ['error' => 'Viewer registration is currently disabled by an administrator.'],
                    403
                );
            }
        }

        if (User::where('hashed_email', $hashedEmail)->exists()) {
            return response()->json(
                ['email' => ['An account with this email address already exists.']],
                409
            );
        }

        if ($validated['role'] === 'Proponent') {
            $whitelistEntry = Whitelist::where('student_id', $validated['student_id'])
                ->where('hashed_email', $hashedEmail)
                ->first();

            if (!$whitelistEntry) {
                return response()->json(
                    ['error' => 'Not authorized. The provided Student ID and Email are not whitelisted for Proponent registration.'],
                    403
                );
            }
            $adviserId = $whitelistEntry->adviser_id;
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'encrypted_email' => Crypt::encryptString($email),
                'hashed_email' => $hashedEmail,
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'active',
            ]);

            UserDetail::create([
                'user_id' => $user->id,
                'student_id' => $validated['student_id'] ?? 'N/A',
                'department' => $validated['department'],
                'program' => $validated['program'],
                'adviser_id' => $adviserId,
            ]);

            DB::commit();

            try {
                // Create the signed API-only URL
                $hash = sha1($user->getEmailForVerification());
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

                // Dispatch the job, passing the plain-text email and individual URL parts
                SendVerificationEmailJob::dispatch(
                    $email,
                    (string) $user->id,
                    $hash,
                    $query['expires'],
                    $query['signature']
                );
            } catch (\Exception $e) {
                Log::error("Failed to dispatch verification email for new user {$user->id}: " . $e->getMessage());
            }

            if ($user->role === 'Proponent' && !is_null($adviserId)) {
                SendNotification::dispatch(
                    $adviserId,
                    "A new Proponent ({$user->first_name} {$user->last_name}) has registered under your advisement."
                );
            }

            $actionType = ActionType::firstOrCreate(['action_name' => 'register']);
            UserLog::create([
                'user_id' => $user->id,
                'action_type_id' => $actionType->id,
                'details' => "User registered as {$user->role}."
            ]);

            return response()->json([
                'message' => 'Registered successfully. A verification link has been sent to your email.',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration Error: ' . $e->getMessage());
            return response()->json(['message' => 'An unexpected error occurred during registration.'], 500);
        }
    }
}
