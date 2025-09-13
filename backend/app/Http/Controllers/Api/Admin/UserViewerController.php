<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserViewerController extends Controller
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
    public function update(Request $request, $id)
    {
        $viewer = User::where('role', 'Viewer')->find($id);

        if (!$viewer) {
            return response()->json(['message' => 'Viewer not found.'], 404);
        }

        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($viewer->id)],
            'student_id' => 'sometimes|required|string|max:50',
            'department' => 'sometimes|required|string|max:50',
            'program' => 'sometimes|required|string|max:50',
            'adviser_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validatedData, $viewer, $request) {
            if ($request->hasAny(['first_name', 'last_name', 'email'])) {
                $viewer->update($request->only(['first_name', 'last_name', 'email']));
            }

            if ($viewer->userDetail && $request->hasAny(['student_id', 'department', 'program', 'adviser_id'])) {
                $viewer->userDetail->update($request->only(['student_id', 'department', 'program', 'adviser_id']));
            }
        });

        return response()->json($viewer->load('userDetail'));
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
