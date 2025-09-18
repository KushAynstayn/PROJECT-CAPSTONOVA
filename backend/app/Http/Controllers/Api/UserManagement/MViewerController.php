<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class MViewerController extends Controller
{
    /**
     * Display a listing of active viewers.
     */
    public function index(Request $request)
    {
        $query = User::with('userDetail')
            ->where('role', 'Viewer')
            ->where('status', 'active');

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('first_name', 'like', "%{$searchTerm}%")
                    ->orWhere('last_name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhereHas('userDetail', function ($subQ) use ($searchTerm) {
                        $subQ->where('student_id', 'like', "%{$searchTerm}%")
                            ->orWhere('program', 'like', "%{$searchTerm}%");
                    });
            });
        }

        $viewers = $query->latest()->paginate(15);
        return response()->json($viewers);
    }

    /**
     * Store a newly created viewer in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'student_id' => 'required|string|max:50',
            'department' => 'required|string|max:50',
            'program' => 'required|string|max:50',
            'adviser_id' => 'required|integer|exists:users,id',
        ]);

        $user = DB::transaction(function () use ($validatedData) {
            $newUser = User::create([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => 'Viewer',
                'status' => 'active',
            ]);

            $newUser->userDetail()->create([
                'student_id' => $validatedData['student_id'],
                'department' => $validatedData['department'],
                'program' => $validatedData['program'],
                'adviser_id' => $validatedData['adviser_id'],
            ]);

            return $newUser;
        });

        return response()->json($user->load('userDetail'), 201);
    }

    /**
     * Display the specified viewer.
     */
    public function show($id)
    {
        $viewer = User::with('userDetail')->where('role', 'Viewer')->find($id);

        if (!$viewer) {
            return response()->json(['message' => 'Viewer not found.'], 404);
        }

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
        // First, find the viewer to ensure they exist.
        $viewer = User::where('role', 'Viewer')->find($id);

        if (!$viewer) {
            return response()->json(['message' => 'Viewer not found.'], 404);
        }

        // Validate the incoming data.
        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($viewer->id)],
            'student_id' => 'sometimes|required|string|max:50',
            'department' => 'sometimes|required|string|max:50',
            'program' => 'sometimes|required|string|max:50',
            'adviser_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validatedData, $id, $viewer) {
            // Prepare and execute the update for the 'users' table
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
                $userFieldsToUpdate[] = 'email = ?';
                $userBindings[] = $validatedData['email'];
            }

            if (!empty($userFieldsToUpdate)) {
                $userBindings[] = $id;
                $sql = 'UPDATE users SET ' . implode(', ', $userFieldsToUpdate) . ' WHERE id = ?';
                DB::update($sql, $userBindings);
            }

            // Check if any user detail fields were provided
            $userDetailData = array_intersect_key($validatedData, array_flip(['student_id', 'department', 'program', 'adviser_id']));

            if (!empty($userDetailData)) {
                // Check if a UserDetail record already exists
                if ($viewer->userDetail) {
                    // --- UPDATE an existing record ---
                    $bindings = array_values($userDetailData);
                    $fieldsToUpdate = array_map(fn($key) => "$key = ?", array_keys($userDetailData));
                    $bindings[] = $id;
                    $sql = 'UPDATE user_details SET ' . implode(', ', $fieldsToUpdate) . ' WHERE user_id = ?';
                    DB::update($sql, $bindings);
                } else {
                    // --- CREATE a new record ---
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

        // Re-fetch the user with updated details to return the fresh data
        $updatedViewer = User::with('userDetail')->find($id);

        return response()->json($updatedViewer);
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

        return response()->json(['message' => 'Viewer has been restricted successfully.']);
    }
}
