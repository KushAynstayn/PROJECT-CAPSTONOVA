<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SuperAdmin\StoreUserRequest;
use App\Http\Requests\Api\SuperAdmin\UpdateUserRequest;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->with('userDetail:user_id,department,program')
            ->where('id', '!=', $request->user()->id);

        // Apply role filter if provided in the request
        $query->when($request->query('role'), function ($q, $role) {
            return $q->where('role', 'like', '%' . $role . '%');
        });

        $users = $query->select('id', 'first_name', 'last_name', 'role')
            ->paginate()
            ->through(function ($user) {
                return [
                    'full_name' => trim($user->first_name . ' ' . $user->last_name),
                    'role' => $user->role,
                    'department' => $user->userDetail?->department,
                    'program' => $user->userDetail?->program,
                ];
            });

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\Api\SuperAdmin\StoreUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            if (in_array($validated['role'], ['Proponent', 'Viewer'])) {
                $user->userDetail()->create([
                    'student_id' => $validated['student_id'],
                    'department' => $validated['department'],
                    'program' => $validated['program'],
                    'adviser_id' => $validated['adviser_id'],
                ]);
            }
            return $user;
        });

        return response()->json($user->load('userDetail'), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::with('userDetail')->findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\Api\SuperAdmin\UpdateUserRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();

        DB::transaction(function () use ($user, $validated) {
            $user->update($validated);

            if (in_array($user->role, ['Proponent', 'Viewer'])) {
                $userDetailData = [];
                if (isset($validated['student_id'])) {
                    $userDetailData['student_id'] = $validated['student_id'];
                }
                if (isset($validated['department'])) {
                    $userDetailData['department'] = $validated['department'];
                }
                if (isset($validated['program'])) {
                    $userDetailData['program'] = $validated['program'];
                }
                if (isset($validated['adviser_id'])) {
                    $userDetailData['adviser_id'] = $validated['adviser_id'];
                }

                if (!empty($userDetailData)) {
                    UserDetail::updateOrCreate(['user_id' => $user->id], $userDetailData);
                }
            }
        });

        return response()->json($user->load('userDetail'));
    }

    /**
     * Update the specified user's status to 'restricted'.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        // Prevent a user from restricting their own account
        if ($request->user()->id == $id) {
            return response()->json(['message' => 'Action forbidden: You cannot restrict your own account.'], 403);
        }

        $user = User::findOrFail($id);

        $user->status = 'restricted';
        $user->save();

        return response()->json(['message' => 'User status updated to restricted.', 'user' => $user]);
    }
}
