<?php

namespace App\Http\Controllers\Api\UserManagement;

use Throwable;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Jobs\SendNotification;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use App\Models\ActionType;
use App\Models\UserLog;
use App\Jobs\SendVerificationEmailJob;
use Illuminate\Support\Facades\URL;


class MViewerController extends Controller
{
    /**
     * Display a listing of active viewers.
     */
    public function index(Request $request)
    {
        // Base query remains the same
        $query = User::with('userDetail')
            ->where('role', 'Viewer')
            ->where('status', 'active');

        // Search logic is adapted for the new encrypted/hashed columns
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            // We must hash the search term to find a matching email
            $hashedSearchTerm = hash('sha256', $searchTerm);

            $query->where(function ($q) use ($searchTerm, $hashedSearchTerm) {
                $q->where('first_name', 'like', "%{$searchTerm}%")
                    ->orWhere('last_name', 'like', "%{$searchTerm}%")
                    // CHANGE: Search is now an exact match on the hashed email
                    ->orWhere('hashed_email', $hashedSearchTerm)
                    ->orWhereHas('userDetail', function ($subQ) use ($searchTerm) {
                        $subQ->where('student_id', 'like', "%{$searchTerm}%")
                            ->orWhere('program', 'like', "%{$searchTerm}%");
                    });
            });
        }

        $viewers = $query->latest()->paginate(15);

        // CHANGE: Transform the collection to maintain the original JSON structure.
        // This is the critical step for backward compatibility.
        $viewers->through(function ($user) {
            // 1. Get the raw encrypted string, bypassing the model's decryption accessor.
            $rawEncryptedEmail = $user->getRawOriginal('encrypted_email');

            // 2. Overwrite the 'email' attribute on the model for the JSON response.
            // The frontend will receive an 'email' key, just like before.
            $user->email = Str::limit($rawEncryptedEmail, 12, '...');

            // 3. Hide the new database columns from the final JSON output.
            $user->makeHidden(['encrypted_email', 'hashed_email']);

            return $user;
        });

        // The final JSON will have the exact same structure as the old version.
        return response()->json($viewers);
    }

    /**
     * Store a newly created viewer in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:100', //
            'last_name' => 'required|string|max:100', //
            'password' => ['required', 'confirmed', Password::defaults()], //
            'student_id' => 'required|string|max:50', //
            'department' => 'required|string|max:50', //
            'program' => 'required|string|max:50', //
            'adviser_id' => 'required|integer|exists:users,id', //
            // CHANGE: Custom validation for email to check uniqueness against the 'hashed_email' column.
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    $hashedEmail = hash('sha256', $value);
                    if (User::where('hashed_email', $hashedEmail)->exists()) { //
                        $fail('The ' . $attribute . ' has already been taken.');
                    }
                },
            ],
        ]);

        $user = DB::transaction(function () use ($validatedData) {
            // CHANGE: Create the user with the new encrypted and hashed email fields.
            $newUser = User::create([
                'first_name' => $validatedData['first_name'], //
                'last_name' => $validatedData['last_name'], //
                'encrypted_email' => Crypt::encryptString($validatedData['email']), //
                'hashed_email' => hash('sha256', $validatedData['email']), //
                'password' => Hash::make($validatedData['password']), //
                'role' => 'Viewer', //
                'status' => 'active', //
            ]);

            // This part remains the same as it correctly creates the related user details.
            $newUser->userDetail()->create([
                'student_id' => $validatedData['student_id'], //
                'department' => $validatedData['department'], //
                'program' => $validatedData['program'], //
                'adviser_id' => $validatedData['adviser_id'], //
            ]);

            return $newUser;
        });

        // --- ADDED: Send Verification Email ---
        // This logic is copied from your RegisterController
        try {
            $plainTextEmail = $validatedData['email'];

            // Create the signed API-only URL
            // The getEmailForVerification() method correctly decrypts the email
            $hash = sha1($user->getEmailForVerification());
            $backendVerificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(config('auth.verification.expire', 60)),
                [
                    'id' => $user->id,
                    'hash' => $hash,
                ]
            );

            // Parse the backend URL to extract query parameters
            $parts = parse_url($backendVerificationUrl);
            parse_str($parts['query'], $query); // $query will be ['expires' => '...', 'signature' => '...']

            // Dispatch the job, passing the plain-text email and individual URL parts
            SendVerificationEmailJob::dispatch(
                $plainTextEmail,
                (string) $user->id,
                $hash,
                $query['expires'],
                $query['signature']
            );
        } catch (\Exception $e) {
            Log::error("Failed to dispatch verification email for new user {$user->id} (created by admin): " . $e->getMessage());
            // We don't fail the whole request, just log the error.
        }
        // --- END: Send Verification Email ---

        $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->toArray();
        $newViewerName = $validatedData['first_name'] . ' ' . $validatedData['last_name'];
        $notificationMessage = "A new Viewer account has been created for {$newViewerName}.";

        // MODIFIED: Added a title to the notification dispatch.
        SendNotification::dispatch('New Viewer Account', $notificationMessage, null, $adminIds);

        $actionType = ActionType::firstOrCreate(['action_name' => 'create_viewer']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Created a new Viewer account for {$newViewerName}."
        ]);

        // CHANGE: To ensure backward compatibility, modify the user object for the response.
        // We add the plain-text 'email' back and hide the new internal fields.
        $user->email = $validatedData['email'];
        $user->makeHidden(['encrypted_email', 'hashed_email']);

        // The final response will have the same structure as before the database changes.
        return response()->json($user->load('userDetail'), 201);
    }

    /**
     * Display the specified viewer.
     */
    public function show($id)
    {
        // The logic to find the specific viewer remains the same.
        $viewer = User::with('userDetail')->where('role', 'Viewer')->find($id);

        if (!$viewer) {
            return response()->json(['message' => 'Viewer not found.'], 404);
        }

        // CHANGE: To ensure backward compatibility, transform the user object before sending the response.
        // The accessor on the User model automatically decrypts the email for us.
        $viewer->email = $viewer->encrypted_email;

        // Hide the new database columns from the JSON output.
        $viewer->makeHidden(['encrypted_email', 'hashed_email']);

        // The final JSON response will have the same structure as before the database changes.
        return response()->json($viewer);
    }

    /**
     * Update the specified viewer in storage.
     * Creates a user detail record if one does not exist.
     */
    public function update(Request $request, $id)
    {
        try {
            $viewer = User::where('role', 'Viewer')->find($id);

            if (!$viewer) {
                return response()->json(['message' => 'Viewer not found.'], 404);
            }

            $validatedData = $request->validate([
                'first_name' => 'sometimes|required|string|max:100',
                'last_name' => 'sometimes|required|string|max:100',
                'student_id' => 'sometimes|required|string|max:50',
                'department' => 'sometimes|required|string|max:50',
                'program' => 'sometimes|required|string|max:50',
                'adviser_id' => 'sometimes|required|integer|exists:users,id',
                'email' => [
                    'sometimes',
                    'required',
                    'string',
                    'email',
                    'max:255',
                    function ($attribute, $value, $fail) use ($id) {
                        $hashedEmail = hash('sha256', $value);
                        if (User::where('hashed_email', $hashedEmail)->where('id', '!=', $id)->exists()) {
                            $fail('The ' . $attribute . ' has already been taken.');
                        }
                    },
                ],
            ]);

            // --- REWRITTEN: Use Eloquent for cleaner updates ---
            DB::transaction(function () use ($validatedData, $viewer) {

                // --- 1. Update the 'users' table ---
                $userUpdateData = array_intersect_key($validatedData, array_flip(['first_name', 'last_name']));
                $emailChanged = false;

                if (isset($validatedData['email'])) {
                    // Check if the email is actually different
                    if ($validatedData['email'] !== $viewer->getEmailForVerification()) {
                        $userUpdateData['encrypted_email'] = Crypt::encryptString($validatedData['email']);
                        $userUpdateData['hashed_email'] = hash('sha256', $validatedData['email']);
                        $userUpdateData['email_verified_at'] = null; // Un-verify email
                        $emailChanged = true;
                    }
                }

                // Only update the user model if there is data
                if (!empty($userUpdateData)) {
                    $viewer->update($userUpdateData);
                }

                // --- 2. If email changed, re-send verification ---
                if ($emailChanged) {
                    try {
                        $hash = sha1($viewer->getEmailForVerification()); // Get new email
                        $backendVerificationUrl = URL::temporarySignedRoute(
                            'verification.verify',
                            now()->addMinutes(config('auth.verification.expire', 60)),
                            ['id' => $viewer->id, 'hash' => $hash]
                        );
                        $parts = parse_url($backendVerificationUrl);
                        parse_str($parts['query'], $query);
                        SendVerificationEmailJob::dispatch(
                            $validatedData['email'],
                            (string) $viewer->id,
                            $hash,
                            $query['expires'],
                            $query['signature']
                        );
                    } catch (\Exception $e) {
                        Log::error("Failed to re-send verification email for user {$viewer->id} (admin update): " . $e->getMessage());
                    }
                }

                // --- 3. Update or Create 'user_details' record ---
                $userDetailData = array_intersect_key($validatedData, array_flip(['student_id', 'department', 'program', 'adviser_id']));

                if (!empty($userDetailData)) {
                    // This is the fix:
                    // It finds a user_detail with this user_id and updates it,
                    // OR it creates a new user_detail record if one doesn't exist.
                    // Eloquent handles the created_at/updated_at timestamps automatically.
                    $viewer->userDetail()->updateOrCreate(
                        ['user_id' => $viewer->id], // Find by this
                        $userDetailData              // Update with this
                    );
                }
            });
            // --- END: Eloquent Rewrite ---

            $actionType = ActionType::firstOrCreate(['action_name' => 'update_viewer']);
            UserLog::create([
                'user_id' => Auth::id(),
                'action_type_id' => $actionType->id,
                'details' => "Updated details for Viewer (ID: {$id})."
            ]);

            // We must reload the userDetail relationship after the update
            $updatedViewer = $viewer->load('userDetail');

            $updatedViewer->email = $updatedViewer->encrypted_email;
            $updatedViewer->makeHidden(['encrypted_email', 'hashed_email']);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'data' => $updatedViewer,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], 422);
        } catch (Throwable $e) {
            Log::error("User Update Failed: " . $e->getMessage() . "\n" . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'An unexpected server error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Set the viewer's status to 'restricted'.
     */
    public function destroy($id)
    {
        $viewer = User::where('role', 'Viewer')->find($id);

        if (!$viewer) {
            return response()->json(['message' => 'Viewer not found.'], 404);
        }

        $viewer->status = 'restricted';
        $viewer->save();

        $actionType = ActionType::firstOrCreate(['action_name' => 'restrict_viewer']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Restricted Viewer account for {$viewer->first_name} {$viewer->last_name} (ID: {$id})."
        ]);

        return response()->json(['message' => 'Viewer has been restricted successfully.']);
    }
}
