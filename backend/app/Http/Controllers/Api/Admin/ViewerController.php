<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ViewerController extends Controller
{
    /**
     * Display a listing of the viewers.
     */
    /**
     * Display a listing of the viewers.
     */
    public function index(Request $request)
    {
        // For a more robust implementation, consider using a dedicated API Resource class.
        $query = User::with('userDetail')
            ->where('role', 'Viewer')
            ->where('status', 'active');

        // Handle search query
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
    public function show(User $user)
    {
        // Ensure the requested user is a viewer
        if ($user->role !== 'Viewer') {
            return response()->json(['message' => 'User not found or is not a Viewer.'], 404);
        }

        return response()->json($user->load('userDetail'));
    }

    /**
     * Update the specified viewer in storage.
     */
    public function update(Request $request, User $user)
    {
        // Ensure the user being updated is a viewer
        if ($user->role !== 'Viewer') {
            return response()->json(['message' => 'User not found or is not a Viewer.'], 404);
        }

        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'student_id' => 'sometimes|required|string|max:50',
            'department' => 'sometimes|required|string|max:50',
            'program' => 'sometimes|required|string|max:50',
            'adviser_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validatedData, $user, $request) {
            // Update User fields if present
            if (isset($validatedData['first_name']) || isset($validatedData['last_name']) || isset($validatedData['email'])) {
                $user->update($request->only(['first_name', 'last_name', 'email']));
            }

            // Update UserDetail fields if present
            if ($user->userDetail && (isset($validatedData['student_id']) || isset($validatedData['department']) || isset($validatedData['program']) || isset($validatedData['adviser_id']))) {
                $user->userDetail->update($request->only(['student_id', 'department', 'program', 'adviser_id']));
            }
        });

        return response()->json($user->load('userDetail'));
    }

    /**
     * Set the viewer's status to 'restricted'.
     */
    public function destroy(User $user)
    {
        // Ensure the user being "deleted" is a viewer
        if ($user->role !== 'Viewer') {
            return response()->json(['message' => 'User not found or is not a Viewer.'], 404);
        }

        $user->status = 'restricted';
        $user->save();

        return response()->json(['message' => 'User has been restricted successfully.'], 200);
    }
}
