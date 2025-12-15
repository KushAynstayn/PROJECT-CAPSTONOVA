<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\ActionType;
use App\Models\FacultyWhitelist;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FacultyWhitelistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = FacultyWhitelist::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                // Search by faculty_id or the hash of the email
                $q->where('faculty_id', 'like', "%{$search}%")
                    ->orWhere('hashed_email', hash('sha256', $search));
            });
        }

        // Filter by role (Admin/Adviser)
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $whitelist = $query->paginate(10);

        // Transform the collection to decrypt emails before sending
        $whitelist->getCollection()->transform(function ($item) {
            return $this->formatData($item);
        });

        return response()->json($whitelist);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'faculty_id' => 'required|string|max:50|unique:faculty_whitelist,faculty_id',
            'role'       => 'required|in:Admin,Adviser',
            'email'      => [
                'required',
                'email',
                function ($attribute, $value, $fail) {
                    // Check uniqueness against the hashed_email column
                    $hash = hash('sha256', $value);
                    if (FacultyWhitelist::where('hashed_email', $hash)->exists()) {
                        $fail('The ' . $attribute . ' has already been whitelisted.');
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the record
        // The 'encrypted_email' attribute is automatically encrypted by the model mutator
        $whitelist = FacultyWhitelist::create([
            'faculty_id'      => $request->faculty_id,
            'role'            => $request->role,
            'encrypted_email' => $request->email,
            'hashed_email'    => hash('sha256', $request->email),
        ]);

        // LOGGING
        $actionType = ActionType::firstOrCreate(['action_name' => 'add_faculty_whitelist_entry']);
        UserLog::create([
            'user_id'        => Auth::id(),
            'action_type_id' => $actionType->id,
            'details'        => "Added faculty whitelist entry for Faculty ID {$whitelist->faculty_id} ({$whitelist->role}).",
        ]);

        return response()->json([
            'message' => 'Faculty added to whitelist successfully.',
            'data'    => $this->formatData($whitelist)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Use primary key 'faculty_whitelist_id' via findOrFail
        $whitelist = FacultyWhitelist::findOrFail($id);
        return response()->json(['data' => $this->formatData($whitelist)]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $whitelist = FacultyWhitelist::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'faculty_id' => [
                'required',
                'string',
                'max:50',
                // Ignore the current record during unique check
                Rule::unique('faculty_whitelist')->ignore($whitelist->faculty_whitelist_id, 'faculty_whitelist_id')
            ],
            'role' => 'required|in:Admin,Adviser',
            'email' => [
                'required',
                'email',
                function ($attribute, $value, $fail) use ($whitelist) {
                    $hash = hash('sha256', $value);
                    // Check if hash exists AND belongs to a different ID
                    if (FacultyWhitelist::where('hashed_email', $hash)
                        ->where('faculty_whitelist_id', '!=', $whitelist->faculty_whitelist_id)
                        ->exists()
                    ) {
                        $fail('The ' . $attribute . ' has already been whitelisted.');
                    }
                },
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $whitelist->faculty_id = $request->faculty_id;
        $whitelist->role = $request->role;

        // Only update email fields if the value has changed
        if (hash('sha256', $request->email) !== $whitelist->hashed_email) {
            $whitelist->encrypted_email = $request->email; // Triggers mutator
            $whitelist->hashed_email = hash('sha256', $request->email);
        }

        $whitelist->save();

        // LOGGING
        $actionType = ActionType::firstOrCreate(['action_name' => 'update_faculty_whitelist_entry']);
        UserLog::create([
            'user_id'        => Auth::id(),
            'action_type_id' => $actionType->id,
            'details'        => "Updated faculty whitelist entry for Faculty ID {$whitelist->faculty_id}.",
        ]);

        return response()->json([
            'message' => 'Faculty whitelist updated successfully.',
            'data'    => $this->formatData($whitelist)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $whitelist = FacultyWhitelist::findOrFail($id);

        // Capture details for log before deletion
        $facultyId = $whitelist->faculty_id;

        $whitelist->delete();

        // LOGGING
        $actionType = ActionType::firstOrCreate(['action_name' => 'delete_faculty_whitelist_entry']);
        UserLog::create([
            'user_id'        => Auth::id(),
            'action_type_id' => $actionType->id,
            'details'        => "Deleted faculty whitelist entry for Faculty ID {$facultyId}.",
        ]);

        return response()->json(['message' => 'Faculty whitelist entry deleted successfully.'], 200);
    }

    /**
     * Format the model data for API response.
     */
    private function formatData(FacultyWhitelist $whitelist): array
    {
        return [
            'id'         => $whitelist->faculty_whitelist_id,
            'faculty_id' => $whitelist->faculty_id,
            'role'       => $whitelist->role,
            // The accessor in the model automatically decrypts this value
            'email'      => $whitelist->encrypted_email,
            'created_at' => $whitelist->created_at->toDateTimeString(),
            'updated_at' => $whitelist->updated_at->toDateTimeString(),
        ];
    }
}
