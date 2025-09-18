<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class MAdviserController extends Controller
{
    /**
     * Display a listing of all advisers, with optional name filtering.
     */
    public function index(Request $request)
    {
        $nameQuery = $request->query('name');

        $baseQuery = "
            SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.middle_name,
                u.email,
                (SELECT COUNT(*) FROM capstone_projects cp WHERE cp.adviser_id = u.id) as advisees_count
            FROM
                users u
            WHERE
                u.role = ?
        ";

        $bindings = ['Adviser'];

        if ($nameQuery) {
            $baseQuery .= " AND CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name) LIKE ?";
            $bindings[] = '%' . $nameQuery . '%';
        }

        $advisers = DB::select($baseQuery, $bindings);

        // Format the response
        $formattedAdvisers = array_map(function ($adviser) {
            return [
                'id' => $adviser->id,
                'name' => trim($adviser->first_name . ' ' . ($adviser->middle_name ? $adviser->middle_name . ' ' : '') . $adviser->last_name),
                'email' => $adviser->email,
                'advisees_count' => $adviser->advisees_count,
            ];
        }, $advisers);

        return response()->json($formattedAdvisers);
    }

    /**
     * Store a newly created adviser in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $adviserId = DB::table('users')->insertGetId([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'middle_name' => $validatedData['middle_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => 'Adviser',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $adviser = DB::table('users')->find($adviserId);

        return response()->json($adviser, 201);
    }

    /**
     * Display the specified adviser's name details.
     */
    public function show($id)
    {
        $adviser = DB::table('users')
            ->select('first_name', 'last_name', 'middle_name')
            ->where('id', $id)
            ->where('role', 'Adviser')
            ->first();

        if (!$adviser) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        return response()->json($adviser);
    }

    /**
     * Update the specified adviser in storage.
     */
    public function update(Request $request, $id)
    {
        // First, check if the adviser exists
        $adviser = DB::table('users')->where('id', $id)->where('role', 'Adviser')->first();
        if (!$adviser) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
        ]);

        if (empty($validatedData)) {
            return response()->json(['message' => 'No data provided for update.'], 400);
        }

        $validatedData['updated_at'] = now();

        DB::table('users')->where('id', $id)->update($validatedData);

        $updatedAdviser = DB::table('users')->find($id);

        return response()->json($updatedAdviser);
    }

    /**
     * Set the adviser's status to 'restricted'.
     */
    public function destroy($id)
    {
        $affectedRows = DB::table('users')
            ->where('id', $id)
            ->where('role', 'Adviser')
            ->update([
                'status' => 'restricted',
                'updated_at' => now(),
            ]);

        if ($affectedRows === 0) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        return response()->json(['message' => 'Adviser status has been set to restricted.']);
    }

    /**
     * Get suggestions by a specific adviser, with optional filtering.
     */
    public function adviserSuggestions(Request $request, $id)
    {
        // Check if the user is a valid adviser
        $adviserExists = DB::table('users')->where('id', $id)->where('role', 'Adviser')->exists();
        if (!$adviserExists) {
            return response()->json(['message' => 'Adviser not found.'], 404);
        }

        $query = DB::table('suggestions')->where('adviser_id', $id);

        // Check for 'archived' query parameter to filter suggestions
        if ($request->has('archived')) {
            $isArchived = filter_var($request->query('archived'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_archived', $isArchived);
        }

        $suggestions = $query->get();

        return response()->json($suggestions);
    }

    /**
     * Get all suggestions with advanced filtering.
     * By default, it returns active suggestions.
     * Filters: ?archived=true, ?from_year=YYYY, ?to_year=YYYY
     */
    public function allSuggestions(Request $request)
    {
        $request->validate([
            'from_year' => 'nullable|integer|digits:4',
            'to_year' => 'nullable|integer|digits:4|gte:from_year',
            'adviser_name' => 'nullable|string|max:255',
        ]);

        $query = DB::table('suggestions as s')
            ->join('users as u', 's.adviser_id', '=', 'u.id')
            ->select(
                's.suggestion_id',
                's.adviser_id',
                's.title',
                's.suggestion_text',
                's.submission_date',
                's.is_archived',
                DB::raw("TRIM(CONCAT(u.first_name, ' ', IFNULL(CONCAT(u.middle_name, ' '), ''), u.last_name)) as adviser_name")
            );

        // Filter by archive status. Defaults to active (is_archived = false).
        if ($request->has('archived')) {
            $isArchived = filter_var($request->query('archived'), FILTER_VALIDATE_BOOLEAN);
            $query->where('s.is_archived', $isArchived);
        } else {
            $query->where('s.is_archived', false);
        }

        // Filter by submission year range
        if ($request->filled('from_year')) {
            $query->whereYear('s.submission_date', '>=', $request->input('from_year'));
        }

        if ($request->filled('to_year')) {
            $query->whereYear('s.submission_date', '<=', $request->input('to_year'));
        }

        // START: NEWLY ADDED SEARCH LOGIC
        // Filter by adviser name
        if ($request->filled('adviser_name')) {
            $name = $request->input('adviser_name');
            $query->where(DB::raw("CONCAT_WS(' ', u.first_name, u.middle_name, u.last_name)"), 'LIKE', "%{$name}%");
        }
        // END: NEWLY ADDED SEARCH LOGIC

        $suggestions = $query->orderBy('s.submission_date', 'desc')->paginate(15);

        return response()->json($suggestions);
    }
}
