<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Models\User;
use Illuminate\Http\Request;
use App\Jobs\SendNotification;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rules\Password;
use App\Models\ActionType;
use App\Models\UserLog;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendVerificationEmailJob;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;

class MSuperAdminController extends Controller
{
    /**
     * Display a listing of active Super Admins.
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'Super Admin')->where('status', 'active');

        if ($request->has('name') && $request->query('name') !== '') {
            $name = $request->query('name');
            $query->where(function ($q) use ($name) {
                $q->where('first_name', 'like', "%{$name}%")
                    ->orWhere('last_name', 'like', "%{$name}%");
            });
        }

        $superAdmins = $query->paginate(15)->withQueryString();

        // Add email attribute to each user for frontend
        $superAdmins->getCollection()->transform(function ($user) {
            $user->email = $user->encrypted_email; // This will use the accessor to decrypt
            return $user;
        });

        return response()->json($superAdmins);
    }

    /**
     * Store a newly created Super Admin in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
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
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $email = $validatedData['email'];

        $superAdmin = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'middle_name' => $validatedData['middle_name'] ?? null,
            'encrypted_email' => Crypt::encryptString($email),
            'hashed_email' => hash('sha256', $email),
            'password' => Hash::make($validatedData['password']),
            'role' => 'Super Admin',
            'status' => 'active',
            // email_verified_at will be null by default
        ]);

        // --- ADDED: Send Verification Email ---
        try {
            $plainTextEmail = $validatedData['email'];

            // Create the signed API-only URL
            $hash = sha1($superAdmin->getEmailForVerification());
            $backendVerificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(config('auth.verification.expire', 60)),
                [
                    'id' => $superAdmin->id,
                    'hash' => $hash,
                ]
            );

            // Parse the backend URL to extract query parameters
            $parts = parse_url($backendVerificationUrl);
            parse_str($parts['query'], $query);

            // Dispatch the job
            SendVerificationEmailJob::dispatch(
                $plainTextEmail,
                (string) $superAdmin->id,
                $hash,
                $query['expires'],
                $query['signature']
            );
        } catch (\Exception $e) {
            Log::error("Failed to dispatch verification email for new super admin {$superAdmin->id}: " . $e->getMessage());
        }
        // --- END: Send Verification Email ---

        // Notify all *other* Super Admins
        $otherSuperAdminIds = User::where('role', 'Super Admin')
            ->where('id', '!=', $superAdmin->id)
            ->pluck('id')
            ->toArray();

        $newAdminName = $validatedData['first_name'] . ' ' . $validatedData['last_name'];
        $notificationMessage = "A new Super Admin account has been created for {$newAdminName}.";

        if (!empty($otherSuperAdminIds)) {
            SendNotification::dispatch('New Super Admin Account', $notificationMessage, null, $otherSuperAdminIds);
        }

        $actionType = ActionType::firstOrCreate(['action_name' => 'create_super_admin']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Created a new Super Admin account for {$newAdminName}."
        ]);

        // Add email attribute for the response
        $superAdmin->email = $email;

        return response()->json($superAdmin, 201);
    }

    /**
     * Display the specified Super Admin.
     * Note: We use {superAdmin} in the route to match the variable name.
     */
    public function show(User $superAdmin)
    {
        if ($superAdmin->role !== 'Super Admin') {
            return response()->json(['message' => 'Super Admin user not found.'], 404);
        }

        // Add email attribute for the response
        $superAdmin->email = $superAdmin->encrypted_email; // This will use the accessor to decrypt

        return response()->json($superAdmin);
    }

    /**
     * Update the specified Super Admin in storage.
     */
    public function update(Request $request, User $superAdmin)
    {
        if ($superAdmin->role !== 'Super Admin') {
            return response()->json(['message' => 'Super Admin user not found.'], 404);
        }

        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'hashed_email')->ignore($superAdmin->id),
            ],
        ]);

        $emailChanged = false; // Flag to track email change

        // If email is being updated, update both encrypted and hashed versions
        if (isset($validatedData['email'])) {
            // Check if the email is actually different from the current one
            if ($validatedData['email'] !== $superAdmin->getEmailForVerification()) {
                $email = $validatedData['email'];
                $superAdmin->encrypted_email = Crypt::encryptString($email);
                $superAdmin->hashed_email = hash('sha256', $email);
                $superAdmin->email_verified_at = null; // Reset verification status
                $emailChanged = true;             // Set flag to true
            }
            unset($validatedData['email']); // Unset to avoid mass assignment error
        }

        $superAdmin->update($validatedData);

        // --- ADDED: Re-send Verification Email if it was changed ---
        if ($emailChanged) {
            try {
                // Get the newly set, decrypted email
                $plainTextEmail = $superAdmin->getEmailForVerification();
                $hash = sha1($plainTextEmail);
                $backendVerificationUrl = URL::temporarySignedRoute(
                    'verification.verify',
                    now()->addMinutes(config('auth.verification.expire', 60)),
                    ['id' => $superAdmin->id, 'hash' => $hash]
                );
                $parts = parse_url($backendVerificationUrl);
                parse_str($parts['query'], $query);
                SendVerificationEmailJob::dispatch(
                    $plainTextEmail,
                    (string) $superAdmin->id,
                    $hash,
                    $query['expires'],
                    $query['signature']
                );
            } catch (\Exception $e) {
                Log::error("Failed to re-send verification email for super admin {$superAdmin->id}: " . $e->getMessage());
            }
        }
        // --- END: Re-send Verification Email ---

        $actionType = ActionType::firstOrCreate(['action_name' => 'update_super_admin']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Updated details for Super Admin (ID: {$superAdmin->id})."
        ]);

        // Refresh the model and add email attribute for response
        $superAdmin->refresh();
        $superAdmin->email = $superAdmin->encrypted_email; // This will use the accessor to decrypt

        return response()->json($superAdmin);
    }

    /**
     * Set the Super Admin's status to 'restricted'.
     */
    public function setStatusToRestricted(User $superAdmin)
    {
        if ($superAdmin->role !== 'Super Admin') {
            return response()->json(['message' => 'Super Admin user not found.'], 404);
        }

        // Add guard clause to prevent self-restriction
        if ($superAdmin->id === Auth::id()) {
            return response()->json(['message' => 'You cannot restrict your own account.'], 403);
        }

        $superAdmin->status = 'restricted';
        $superAdmin->save();

        $actionType = ActionType::firstOrCreate(['action_name' => 'restrict_super_admin']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Restricted Super Admin account for {$superAdmin->first_name} {$superAdmin->last_name} (ID: {$superAdmin->id})."
        ]);

        // Add email attribute for the response
        $superAdmin->email = $superAdmin->encrypted_email; // This will use the accessor to decrypt

        return response()->json([
            'message' => "Super Admin status successfully updated to restricted.",
            'user' => $superAdmin
        ]);
    }
}
