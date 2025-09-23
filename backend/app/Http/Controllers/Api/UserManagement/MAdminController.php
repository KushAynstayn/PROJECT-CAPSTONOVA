<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
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

        // Add email attribute to each admin for frontend
        $admins->getCollection()->transform(function ($admin) {
            $admin->email = $admin->encrypted_email; // This will use the accessor to decrypt
            return $admin;
        });

        return response()->json($admins);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'email' => 'required|string|email|max:255|unique:users,hashed_email',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $email = $validatedData['email'];

        $admin = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'middle_name' => $validatedData['middle_name'] ?? null,
            'encrypted_email' => Crypt::encryptString($email),
            'hashed_email' => hash('sha256', $email),
            'password' => Hash::make($validatedData['password']),
            'role' => 'Admin',
            'status' => 'active',
        ]);

        // Add email attribute for the response
        $admin->email = $email;

        return response()->json($admin, 201);
    }

    public function show(User $admin)
    {
        if ($admin->role !== 'Admin') {
            return response()->json(['message' => 'Admin user not found.'], 404);
        }

        // Add email attribute for the response
        $admin->email = $admin->encrypted_email; // This will use the accessor to decrypt

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
                Rule::unique('users', 'hashed_email')->ignore($admin->id),
            ],
        ]);

        // If email is being updated, update both encrypted and hashed versions
        if (isset($validatedData['email'])) {
            $email = $validatedData['email'];
            $admin->encrypted_email = Crypt::encryptString($email);
            $admin->hashed_email = hash('sha256', $email);
            unset($validatedData['email']);
        }

        $admin->update($validatedData);

        // Refresh the model and add email attribute for response
        $admin->refresh();
        $admin->email = $admin->encrypted_email; // This will use the accessor to decrypt

        return response()->json($admin);
    }

    public function setStatusToRestricted(User $admin)
    {
        if ($admin->role !== 'Admin') {
            return response()->json(['message' => 'Admin user not found.'], 404);
        }

        $admin->status = 'restricted';
        $admin->save();

        // Add email attribute for the response
        $admin->email = $admin->encrypted_email; // This will use the accessor to decrypt

        return response()->json([
            'message' => "Admin status successfully updated to restricted.",
            'user' => $admin
        ]);
    }
}
