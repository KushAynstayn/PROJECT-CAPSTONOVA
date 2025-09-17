<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class MAdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'Admin');

        if ($request->has('name') && $request->query('name') !== '') {
            $name = $request->query('name');
            $query->where(function ($q) use ($name) {
                $q->where('first_name', 'like', "%{$name}%")
                    ->orWhere('last_name', 'like', "%{$name}%");
            });
        }

        $admins = $query->paginate(15)->withQueryString();

        return response()->json($admins);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $admin = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'middle_name' => $validatedData['middle_name'] ?? null,
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => 'Admin',
            'status' => 'active',
        ]);

        return response()->json($admin, 201);
    }

    public function show(User $admin)
    {
        if ($admin->role !== 'Admin') {
            return response()->json(['message' => 'Admin user not found.'], 404);
        }
        return response()->json($admin);
    }

    public function update(Request $request, User $admin)
    {
        if ($admin->role !== 'Admin') {
            return response()->json(['message' => 'Admin user not found.'], 404);
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
                Rule::unique('users')->ignore($admin->id),
            ],
        ]);

        $admin->update($validatedData);

        return response()->json($admin);
    }

    public function setStatusToRestricted(User $admin)
    {
        if ($admin->role !== 'Admin') {
            return response()->json(['message' => 'Admin user not found.'], 404);
        }

        $admin->status = 'restricted';
        $admin->save();

        return response()->json([
            'message' => "Admin status successfully updated to restricted.",
            'user' => $admin
        ]);
    }
}
