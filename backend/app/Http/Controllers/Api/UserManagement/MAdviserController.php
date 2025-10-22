<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Models\User;
use App\Models\UserLog;
use App\Models\ActionType;
use Illuminate\Http\Request;
use App\Models\SystemSetting;
use App\Jobs\SendNotification;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Exception; // MODIFIED: Corrected namespace
use App\Jobs\SendVerificationEmailJob; // ADDED
use Illuminate\Support\Facades\URL;    // ADDED
use Illuminate\Support\Facades\Log;    // ADDED

class MAdviserController extends Controller
{
    /**
     * Display a listing of all advisers, with optional name filtering.
     */
    public function index(Request $request)
    {
        $nameQuery = $request->query('name');

        $baseQuery = "
        SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.middle_name,
            u.encrypted_email,
            u.hashed_email,
            (SELECT COUNT(*) FROM capstone_projects cp WHERE cp.adviser_id = u.id) as advisees_count
        FROM
            users u
        WHERE
            u.role = ? AND u.status = ?
    ";

        // MODIFIED: Added 'active' to the bindings to filter by status.
        $bindings = ['Adviser', 'active'];

        if ($nameQuery) {
            $baseQuery .= " AND CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name) LIKE ?";
            $bindings[] = '%' . $nameQuery . '%';
        }

        $advisers = DB::select($baseQuery, $bindings);

        // Format the response
        $formattedAdvisers = array_map(function ($adviser) {
            // Decrypt the email for display
            try {
                $decryptedEmail = Crypt::decryptString($adviser->encrypted_email);
            } catch (Exception $e) {
                // Fallback to hashed email if decryption fails
                $decryptedEmail = $adviser->hashed_email;
            }

            return [
                'id' => $adviser->id,
                'name' => trim($adviser->first_name . ' ' . ($adviser->middle_name ? $adviser->middle_name . ' ' : '') . $adviser->last_name),
                'email' => $decryptedEmail, // Use the decrypted email
                'advisees_count' => $adviser->advisees_count,
            ];
        }, $advisers);

        return response()->json($formattedAdvisers);
    }

    /**
     * Store a newly created adviser in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        // Sanitize the role name to match the setting key format (e.g., "Super Admin" -> "superadmin")
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'createAdviserAccount' feature is enabled for the user's role
        $settingName = $settingRoleKey . '_createAdviserAccount';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        // This check is bypassed if the user is a Super Admin
        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'You do not have permission to create Adviser accounts.'
            ], 403);
        }

        $validatedData = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            // MODIFIED: Changed to a closure for consistency
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    $hashedEmail = hash('sha256', $value);
                    if (User::where('hashed_email', $hashedEmail)->exists()) {
                        $fail('The ' . $attribute . ' has already been taken.');
                    }
                },
            ],
            'password' => 'required|string|min:8',
        ]);

        $userData = [
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'middle_name' => $validatedData['middle_name'],
            'encrypted_email' => Crypt::encryptString($validatedData['email']),
            'hashed_email' => hash('sha256', $validatedData['email']),
            'password' => Hash::make($validatedData['password']),
            'role' => 'Adviser',
            'status' => 'active',
            // email_verified_at will be null by default
        ];

        $adviser = User::create($userData);

        // --- ADDED: Send Verification Email ---
        try {
            $plainTextEmail = $validatedData['email'];

            // Create the signed API-only URL
            $hash = sha1($adviser->getEmailForVerification());
            $backendVerificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(config('auth.verification.expire', 60)),
                [
                    'id' => $adviser->id,
                    'hash' => $hash,
                ]
            );

            // Parse the backend URL to extract query parameters
            $parts = parse_url($backendVerificationUrl);
            parse_str($parts['query'], $query); // $query will be ['expires' => '...', 'signature' => '...']

            // Dispatch the job
            SendVerificationEmailJob::dispatch(
                $plainTextEmail,
                (string) $adviser->id,
                $hash,
                $query['expires'],
                $query['signature']
            );
        } catch (\Exception $e) {
            Log::error("Failed to dispatch verification email for new adviser {$adviser->id} (created by admin/superadmin): " . $e->getMessage());
            // We don't fail the whole request, just log the error.
        }
        // --- END: Send Verification Email ---

        $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->toArray();
        $newAdviserName = $validatedData['first_name'] . ' ' . $validatedData['last_name'];
        $notificationMessage = "A new Adviser account has been created for {$newAdviserName}.";

        // MODIFIED: Added a title to the notification dispatch.
        SendNotification::dispatch('New Adviser Account', $notificationMessage, null, $adminIds);

        $actionType = ActionType::firstOrCreate(['action_name' => 'create_adviser']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Created a new Adviser account for {$newAdviserName}."
        ]);

        // Prepare response with decrypted email
        $responseData = [
            'id' => $adviser->id,
            'first_name' => $adviser->first_name,
            'last_name' => $adviser->last_name,
            'middle_name' => $adviser->middle_name,
            'email' => $validatedData['email'], // Use the original email from request
            'role' => $adviser->role,
            'status' => $adviser->status,
            'created_at' => $adviser->created_at,
            'updated_at' => $adviser->updated_at,
        ];

        return response()->json($responseData, 201);
    }

    /**
     * Display the specified adviser's name details.
     */
    public function show($id)
    {
        $adviser = DB::table('users')
            ->select('first_name', 'last_name', 'middle_name')
            ->where('id', $id)
            ->where('role', 'Adviser')
            ->first();

        if (!$adviser) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        return response()->json($adviser);
    }

    /**
     * Update the specified adviser in storage.
     */
    public function update(Request $request, $id)
    {
        // MODIFIED: Fetch the Eloquent model to use its methods
        $adviser = User::where('id', $id)->where('role', 'Adviser')->first();
        if (!$adviser) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            // ADDED: Allow email updates
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'hashed_email')->ignore($adviser->id),
            ],
        ]);

        // MODIFIED: Use an array for updates to handle email logic
        $updateData = $validatedData;
        $emailChanged = false;

        // Check if email is being updated and if it's different
        if (isset($validatedData['email']) && $validatedData['email'] !== $adviser->getEmailForVerification()) {
            $email = $validatedData['email'];
            $updateData['encrypted_email'] = Crypt::encryptString($email);
            $updateData['hashed_email'] = hash('sha256', $email);
            $updateData['email_verified_at'] = null; // Reset verification
            $emailChanged = true;
            unset($updateData['email']); // Remove plain email from update array
        } elseif (isset($validatedData['email'])) {
            unset($updateData['email']); // Remove if it's the same
        }

        if (empty($updateData)) {
            return response()->json(['message' => 'No data provided for update.'], 400);
        }

        $updateData['updated_at'] = now();

        // Use Eloquent update
        $adviser->update($updateData);

        // --- ADDED: Re-send Verification Email if it was changed ---
        if ($emailChanged) {
            try {
                $plainTextEmail = $adviser->getEmailForVerification(); // Gets the new email
                $hash = sha1($plainTextEmail);
                $backendVerificationUrl = URL::temporarySignedRoute(
                    'verification.verify',
                    now()->addMinutes(config('auth.verification.expire', 60)),
                    ['id' => $adviser->id, 'hash' => $hash]
                );
                $parts = parse_url($backendVerificationUrl);
                parse_str($parts['query'], $query);
                SendVerificationEmailJob::dispatch(
                    $plainTextEmail,
                    (string) $adviser->id,
                    $hash,
                    $query['expires'],
                    $query['signature']
                );
            } catch (\Exception $e) {
                Log::error("Failed to re-send verification email for adviser {$adviser->id} (admin update): " . $e->getMessage());
            }
        }
        // --- END: Re-send Verification Email ---

        $actionType = ActionType::firstOrCreate(['action_name' => 'update_adviser']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Updated details for Adviser (ID: {$id})."
        ]);

        // MODIFIED: Return the full user object with decrypted email
        $adviser->refresh();
        $adviser->email = $adviser->encrypted_email; // Use accessor

        return response()->json($adviser);
    }

    /**
     * Set the adviser's status to 'restricted'.
     */
    public function destroy($id)
    {
        $adviser = User::where('id', $id)->where('role', 'Adviser')->first();
        if (!$adviser) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        $affectedRows = DB::table('users')
            ->where('id', $id)
            ->where('role', 'Adviser')
            ->update([
                'status' => 'restricted',
                'updated_at' => now(),
            ]);

        if ($affectedRows === 0) {
            // This case might happen if status was already 'restricted'
            // but we'll keep the 404 logic as it was
            return response()->json(['message' => 'Adviser not found or no change made.'], 404);
        }

        $actionType = ActionType::firstOrCreate(['action_name' => 'restrict_adviser']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Restricted Adviser account for {$adviser->first_name} {$adviser->last_name} (ID: {$id})."
        ]);

        return response()->json(['message' => 'Adviser status has been set to restricted.']);
    }

    /**
     * Get suggestions by a specific adviser, with optional filtering.
     */
    public function adviserSuggestions(Request $request, $id)
    {
        // Check if the user is a valid adviser
        $adviserExists = DB::table('users')->where('id', $id)->where('role', 'Adviser')->exists();
        if (!$adviserExists) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        $query = DB::table('suggestions')->where('adviser_id', $id);

        // Check for 'archived' query parameter to filter suggestions
        if ($request->has('archived')) {
            $isArchived = filter_var($request->query('archived'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_archived', $isArchived);
        }

        $suggestions = $query->get();

        return response()->json($suggestions);
    }

    /**
     * Get all suggestions with advanced filtering.
     * By default, it returns active suggestions.
     * Filters: ?archived=true, ?from_year=YYYY, ?to_year=YYYY
     */
    public function allSuggestions(Request $request)
    {
        $user = $request->user();
        // Sanitize the role name to match the setting key format (e.g., "Super Admin" -> "superadmin")
        $settingRoleKey = strtolower(str_replace(' ', '', $user->role));

        // Guard Clause: Check if the 'viewSuggestions' feature is enabled for the user's role
        $settingName = $settingRoleKey . '_viewSuggestions';
        $isFeatureEnabled = Cache::remember($settingName, 60, function () use ($settingName) {
            $setting = SystemSetting::where('setting_name', $settingName)->first();
            return $setting ? $setting->is_enabled : false; // Default to false if not found
        });

        // This check is bypassed if the user is a Super Admin
        if (!$isFeatureEnabled && $user->role !== 'Super Admin') {
            return response()->json([
                'message' => 'You do not have permission to view suggestions.'
            ], 403);
        }

        $request->validate([
            'from_year' => 'nullable|integer|digits:4',
            'to_year' => 'nullable|integer|digits:4|gte:from_year',
            'adviser_name' => 'nullable|string|max:255',
        ]);

        $query = DB::table('suggestions as s')
            ->join('users as u', 's.adviser_id', '=', 'u.id')
            ->select(
                's.suggestion_id',
                's.adviser_id',
                's.title',
                's.suggestion_text',
                's.submission_date',
                's.is_archived',
                DB::raw("TRIM(CONCAT(u.first_name, ' ', IFNULL(CONCAT(u.middle_name, ' '), ''), u.last_name)) as adviser_name")
            );

        // Filter by archive status. Defaults to active (is_archived = false).
        if ($request->has('archived')) {
            $isArchived = filter_var($request->query('archived'), FILTER_VALIDATE_BOOLEAN);
            $query->where('s.is_archived', $isArchived);
        } else {
            $query->where('s.is_archived', false);
        }

        // Filter by submission year range
        if ($request->filled('from_year')) {
            $query->whereYear('s.submission_date', '>=', $request->input('from_year'));
        }

        if ($request->filled('to_year')) {
            $query->whereYear('s.submission_date', '<=', $request->input('to_year'));
        }

        // START: NEWLY ADDED SEARCH LOGIC
        // Filter by adviser name
        if ($request->filled('adviser_name')) {
            $name = $request->input('adviser_name');
            $query->where(DB::raw("CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name)"), 'LIKE', "%{$name}%");
        }
        // END: NEWLY ADDED SEARCH LOGIC

        $suggestions = $query->orderBy('s.submission_date', 'desc')->paginate(15);

        return response()->json($suggestions);
    }
}
