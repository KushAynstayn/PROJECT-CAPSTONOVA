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
use App\Models\FacultyWhitelist;
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
        $useCtuEmail = filter_var(env('USE_CTU_EMAIL', true), FILTER_VALIDATE_BOOLEAN);

        $emailRules = ['required', 'string', 'email', 'max:255'];
        $messages = [];

        if ($useCtuEmail) {
            $emailRules[] = 'regex:/^.+@ctu\.edu\.ph$/i';
            $messages['email.regex'] = 'The email must be a valid @ctu.edu.ph address.';
        }

        $validator = Validator::make($request->all(), [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],
            'email'      => $emailRules,
            'password'   => ['required', 'string', 'min:8', 'confirmed'],
            'role'       => ['required', 'string', Rule::in(['Proponent', 'Viewer', 'Admin', 'Adviser'])],

            'student_id' => ['required_if:role,Proponent,Admin,Adviser', 'nullable', 'string', 'max:50'],

            'department' => [
                Rule::requiredIf(fn() => in_array($request->role, ['Proponent', 'Viewer'])),
                'nullable',
                'string',
                'max:50'
            ],
            'program' => [
                Rule::requiredIf(fn() => in_array($request->role, ['Proponent', 'Viewer'])),
                'nullable',
                'string',
                'max:50'
            ],
        ], $messages);

        if ($validator->fails()) {
            // Returns standard format: {"email": ["Error msg"], "password": ["Error msg"]}
            return response()->json($validator->errors(), 422);
        }

        $validated   = $validator->validated();
        $email       = strtolower($validated['email']);
        $hashedEmail = hash('sha256', $email);
        $adviserId   = null;

        // --- 1. Viewer Check ---
        if ($validated['role'] === 'Viewer') {
            $settingName = 'viewer_registerAccount';
            $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
                $setting = SystemSetting::where('setting_name', $settingName)->first();
                return $setting ? $setting->is_enabled : false;
            });

            if (!$isFeatureEnabled) {
                // CHANGED: Mapped to 'role' field so it appears under the Role dropdown
                return response()->json([
                    'role' => ['Viewer registration is currently disabled by an administrator.']
                ], 403);
            }
        }

        // --- Check for Existing Account ---
        if (User::where('hashed_email', $hashedEmail)->exists()) {
            return response()->json([
                'email' => ['An account with this email address already exists.']
            ], 409);
        }

        // --- 2. Proponent Check (Student Whitelist) ---
        if ($validated['role'] === 'Proponent') {
            $whitelistEntry = Whitelist::where('student_id', $validated['student_id'])
                ->where('hashed_email', $hashedEmail)
                ->first();

            if (!$whitelistEntry) {
                // CHANGED: Mapped to 'student_id' field so it appears under the ID input
                return response()->json([
                    'student_id' => ['Not authorized. The provided Student ID and Email are not whitelisted for Proponent registration.']
                ], 403);
            }
            $adviserId = $whitelistEntry->adviser_id;
        }

        // --- 3. Admin/Adviser Check (Faculty Whitelist) ---
        if (in_array($validated['role'], ['Admin', 'Adviser'])) {
            $facultyEntry = FacultyWhitelist::where('faculty_id', $validated['student_id'])
                ->where('hashed_email', $hashedEmail)
                ->where('role', $validated['role'])
                ->first();

            if (!$facultyEntry) {
                // CHANGED: Mapped to 'student_id' field so it appears under the ID input
                return response()->json([
                    'student_id' => ["Not authorized. The provided Faculty ID and Email are not whitelisted for {$validated['role']} registration."]
                ], 403);
            }
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'first_name'      => $validated['first_name'],
                'last_name'       => $validated['last_name'],
                'encrypted_email' => Crypt::encryptString($email),
                'hashed_email'    => $hashedEmail,
                'password'        => Hash::make($validated['password']),
                'role'            => $validated['role'],
                'status'          => 'active',
            ]);

            // Only create UserDetail for Students
            if (in_array($validated['role'], ['Proponent', 'Viewer'])) {
                UserDetail::create([
                    'user_id'    => $user->id,
                    'student_id' => $validated['student_id'] ?? 'N/A',
                    'department' => $validated['department'],
                    'program'    => $validated['program'],
                    'adviser_id' => $adviserId,
                ]);
            }

            DB::commit();

            try {
                $hash = sha1($user->getEmailForVerification());
                $backendVerificationUrl = URL::temporarySignedRoute(
                    'verification.verify',
                    now()->addMinutes(config('auth.verification.expire', 60)),
                    [
                        'id'   => $user->id,
                        'hash' => $hash,
                    ]
                );

                $parts = parse_url($backendVerificationUrl);
                parse_str($parts['query'], $query);

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
                    'New Proponent Registration',
                    "A new Proponent ({$user->first_name} {$user->last_name}) has registered under your advisement.",
                    $adviserId
                );
            }

            $actionType = ActionType::firstOrCreate(['action_name' => 'register']);
            UserLog::create([
                'user_id'        => $user->id,
                'action_type_id' => $actionType->id,
                'details'        => "User registered as {$user->role}."
            ]);

            return response()->json([
                'message' => 'Registered successfully. A verification link has been sent to your email.',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration Error: ' . $e->getMessage());
            // CHANGED: Use 'message' key which is standard for general alerts
            return response()->json(['message' => 'An unexpected error occurred during registration.'], 500);
        }
    }
}
