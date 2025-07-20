<?php

namespace App\Http\Controllers\Api\Admin;

use Throwable;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Api\Admin\StoreAdviserRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class AdviserController extends Controller
{
    /**
     * Store a newly created adviser in storage.
     *
     * @param StoreAdviserRequest $request
     * @return JsonResponse
     */
    public function store(StoreAdviserRequest $request): JsonResponse
    {

        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $validatedData = $request->validated();

        try {
            $adviser = DB::transaction(function () use ($validatedData) {
                // 1. Create the User record
                $newUser = User::create([
                    'first_name' => $validatedData['first_name'],
                    'last_name'  => $validatedData['last_name'],
                    'middle_name' => $validatedData['middle_name'] ?? null,
                    'email'      => $validatedData['email'],
                    'password'   => Hash::make($validatedData['password']),
                    'role'       => 'Adviser',
                    'status'     => 'active',
                ]);


                UserDetail::create([
                    'user_id'    => $newUser->id,
                    'student_id' => 'N/A',
                    'department' => $validatedData['department'],
                    'program'    => $validatedData['program'] ?? null,
                    'adviser_id' => $newUser->id,
                ]);

                return $newUser;
            });


            return response()->json($adviser->load('userDetail'), 201);
        } catch (Throwable $e) {
            report($e);
            return response()->json([
                'message' => 'An unexpected error occurred while creating the adviser.'
            ], 500);
        }
    }


    /**
     * Set the specified adviser's status to 'restricted'.
     *
     * @param User $user The user instance injected by route-model binding.
     * @return JsonResponse
     */
    public function restrict(User $user): JsonResponse
    {

        if ($user->role !== 'Adviser') {
            return response()->json(['message' => 'User is not an adviser.'], 404);
        }

        $user->status = 'restricted';
        $user->save();

        return response()->json([
            'message' => 'Adviser has been successfully restricted.',
            'adviser' => $user->load('userDetail'),
        ], 200);
    }

    public function index(Request $request): JsonResponse
    {

        $validator = Validator::make($request->query(), [
            'status' => 'required|in:active,restricted',
            'name'   => 'sometimes|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing parameters.',
                'errors'  => $validator->errors(),
            ], 400);
        }


        $status = $request->query('status');
        $query = User::query()
            ->where('role', 'Adviser')
            ->where('status', $status);


        if ($request->filled('name')) {

            $searchWords = explode(' ', $request->query('name'));

            $query->where(function ($q) use ($searchWords) {
                foreach ($searchWords as $word) {

                    if (!empty($word)) {

                        $q->orWhere('first_name', 'LIKE', "%{$word}%")
                            ->orWhere('last_name', 'LIKE', "%{$word}%")
                            ->orWhere('middle_name', 'LIKE', "%{$word}%");
                    }
                }
            });
        }


        $advisers = $query->with('userDetail')
            ->latest()
            ->paginate(10)
            ->withQueryString();


        return response()->json($advisers);
    }

    /**
     * Set the specified adviser's status to 'active'.
     *
     * @param User $user The user instance injected by route-model binding.
     * @return JsonResponse
     */
    public function activate(User $user): JsonResponse
    {

        if ($user->role !== 'Adviser') {
            return response()->json(['message' => 'User is not an adviser.'], 404);
        }


        $user->status = 'active';
        $user->save();


        return response()->json([
            'message' => 'Adviser has been successfully activated.',
            'adviser' => $user->load('userDetail'),
        ], 200);
    }
}
