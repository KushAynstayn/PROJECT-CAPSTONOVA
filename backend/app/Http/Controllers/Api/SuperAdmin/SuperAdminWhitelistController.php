<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Models\User;
use App\Models\Whitelist;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;

class SuperAdminWhitelistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
        $query = Whitelist::query()->with(['adviser:id,first_name,last_name,email']);

        $query->when($request->query('student_id'), function ($q, $student_id) {
            return $q->where('student_id', $student_id);
        });

        $query->when($request->query('adviser_id'), function ($q, $adviser_id) {
            return $q->where('adviser_id', $adviser_id);
        });

        $whitelist = $query->select('whitelist_id', 'student_id', 'student_email', 'adviser_id')
            ->paginate()
            ->through(function ($entry) {
                return [
                    'whitelist_id' => $entry->whitelist_id,
                    'student_id' => $entry->student_id,
                    'student_email' => $entry->student_email,
                    'adviser' => [
                        'name' => trim($entry->adviser->first_name . ' ' . $entry->adviser->last_name),
                        'email' => $entry->adviser->email,
                    ],
                ];
            });

        return response()->json($whitelist);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
        $validator = Validator::make($request->all(), [
            'student_id' => ['required', 'integer', 'unique:whitelist,student_id'],
            'student_email' => ['required', 'string', 'email', 'max:255', 'unique:whitelist,student_email'],
            'adviser_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    return $query->where('role', 'Adviser');
                }),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $whitelistEntry = Whitelist::create($validator->validated());

        return response()->json($whitelistEntry, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
        $whitelistEntry = Whitelist::with('adviser')->findOrFail($id);
        return response()->json($whitelistEntry);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
        $whitelistEntry = Whitelist::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'student_id' => ['sometimes', 'required', 'integer', Rule::unique('whitelist', 'student_id')->ignore($id, 'whitelist_id')],
            'student_email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('whitelist', 'student_email')->ignore($id, 'whitelist_id')],
            'adviser_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    return $query->where('role', 'Adviser');
                }),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $whitelistEntry->update($validator->validated());

        return response()->json($whitelistEntry);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (!Gate::allows('isSuperAdmin')) {
            abort(403, 'Unauthorized - Super Admin access required');
        }
        $whitelistEntry = Whitelist::findOrFail($id);
        $whitelistEntry->delete();

        return response()->json(null, 204);
    }
}
