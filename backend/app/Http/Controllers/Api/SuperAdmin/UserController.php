<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Api\SuperAdmin\StoreUserRequest;
use App\Http\Requests\Api\SuperAdmin\UpdateUserRequest;

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
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
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
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
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
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
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
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
        $validated = $request->validated();
        $user = User::findOrFail($id);


        $userKeys = ['first_name', 'last_name', 'middle_name', 'email', 'role', 'status', 'password'];
        $userData = array_intersect_key($validated, array_flip($userKeys));


        $userDetailKeys = ['student_id', 'department', 'program', 'adviser_id'];
        $userDetailData = array_intersect_key($validated, array_flip($userDetailKeys));

        DB::transaction(function () use ($user, $userData, $userDetailData) {

            if (!empty($userData)) {
                $user->update($userData);
            }


            if (in_array($user->role, ['Proponent', 'Viewer']) && !empty($userDetailData)) {
                UserDetail::updateOrCreate(
                    ['user_id' => $user->id],
                    $userDetailData
                );
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
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }

        if ($request->user()->id == $id) {
            return response()->json(['message' => 'Action forbidden: You cannot restrict your own account.'], 403);
        }

        $user = User::findOrFail($id);

        $user->status = 'restricted';
        $user->save();

        return response()->json(['message' => 'User status updated to restricted.', 'user' => $user]);
    }
}
