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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use App\Models\ActionType;
use App\Models\UserLog;
use Illuminate\Support\Facades\Auth;

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

        $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->toArray();
        $newViewerName = $validatedData['first_name'] . ' ' . $validatedData['last_name'];
        $notificationMessage = "A new Viewer account has been created for {$newViewerName}.";
        SendNotification::dispatch(null, $notificationMessage, $adminIds);

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
     */
    /**
     * Update the specified viewer in storage using raw SQL.
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

            DB::transaction(function () use ($validatedData, $id) {
                // --- Update the 'users' table ---
                $userFieldsToUpdate = [];
                $userBindings = [];

                if (isset($validatedData['first_name'])) {
                    $userFieldsToUpdate[] = 'first_name = ?';
                    $userBindings[] = $validatedData['first_name'];
                }
                if (isset($validatedData['last_name'])) {
                    $userFieldsToUpdate[] = 'last_name = ?';
                    $userBindings[] = $validatedData['last_name'];
                }
                if (isset($validatedData['email'])) {
                    $userFieldsToUpdate[] = 'encrypted_email = ?';
                    $userBindings[] = Crypt::encryptString($validatedData['email']);
                    $userFieldsToUpdate[] = 'hashed_email = ?';
                    $userBindings[] = hash('sha256', $validatedData['email']);
                }

                if (!empty($userFieldsToUpdate)) {
                    $userBindings[] = $id;
                    $sql = 'UPDATE users SET ' . implode(', ', $userFieldsToUpdate) . ' WHERE id = ?';
                    DB::update($sql, $userBindings);
                }

                // --- Update or Create 'user_details' record ---
                $userDetailData = array_intersect_key($validatedData, array_flip(['student_id', 'department', 'program', 'adviser_id']));

                if (!empty($userDetailData)) {
                    $existingDetail = DB::table('user_details')->where('user_id', $id)->first();

                    if ($existingDetail) {
                        // THE FIX: Manually add the 'updated_at' timestamp to the update data.
                        $userDetailData['updated_at'] = now();

                        $bindings = array_values($userDetailData);
                        $fieldsToUpdate = array_map(fn($key) => "$key = ?", array_keys($userDetailData));
                        $bindings[] = $id;
                        $sql = 'UPDATE user_details SET ' . implode(', ', $fieldsToUpdate) . ' WHERE user_id = ?';
                        DB::update($sql, $bindings);
                    } else {
                        // The INSERT logic already correctly includes timestamps.
                        $userDetailData['user_id'] = $id;
                        $userDetailData['created_at'] = now();
                        $userDetailData['updated_at'] = now();
                        $columns = implode(', ', array_keys($userDetailData));
                        $placeholders = implode(', ', array_fill(0, count($userDetailData), '?'));
                        $bindings = array_values($userDetailData);
                        $sql = "INSERT INTO user_details ($columns) VALUES ($placeholders)";
                        DB::insert($sql, $bindings);
                    }
                }
            });

            $actionType = ActionType::firstOrCreate(['action_name' => 'update_viewer']);
            UserLog::create([
                'user_id' => Auth::id(),
                'action_type_id' => $actionType->id,
                'details' => "Updated details for Viewer (ID: {$id})."
            ]);

            $updatedViewer = User::with('userDetail')->find($id);

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
                // This 'error' key will contain the specific database message.
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
