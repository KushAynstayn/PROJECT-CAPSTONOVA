<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserProponentController extends Controller
{
    /**
     * Display a listing of active proponents with their details.
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 15;
        $offset = ($page - 1) * $perPage;

        // Base SQL query with LEFT JOINs to correctly handle optional details
        $baseSql = "
            FROM users u
            LEFT JOIN user_details ud ON u.id = ud.user_id
            LEFT JOIN users adv ON ud.adviser_id = adv.id
            WHERE u.role = 'Proponent' AND u.status = 'active'
        ";

        $bindings = [];
        $searchSql = '';

        if ($request->has('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $searchSql = "
                AND (
                    u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR
                    ud.student_id LIKE ? OR ud.department LIKE ? OR ud.program LIKE ? OR
                    adv.first_name LIKE ? OR adv.last_name LIKE ?
                )
            ";
            $bindings = array_fill(0, 8, $searchTerm);
        }

        $total = DB::selectOne("SELECT count(u.id) as total " . $baseSql . $searchSql, $bindings)->total;

        // Get paginated results with the columns required by your frontend table
        $results = DB::select("
            SELECT
                u.id,
                CONCAT(u.first_name, ' ', u.last_name) as name,
                u.email,
                ud.student_id as id_number,
                ud.department,
                ud.program,
                CONCAT(adv.first_name, ' ', adv.last_name) as adviser
            " . $baseSql . $searchSql . "
            ORDER BY u.created_at DESC LIMIT ? OFFSET ?
        ", [...$bindings, $perPage, $offset]);

        $paginator = new LengthAwarePaginator($results, $total, $perPage, $page, ['path' => $request->url()]);
        return response()->json($paginator);
    }

    /**
     * Store a newly created proponent in storage.
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

        $newUserId = null;
        DB::transaction(function () use ($validatedData, &$newUserId) {
            $now = now();
            DB::insert('
                INSERT INTO users (first_name, last_name, email, password, role, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ', [
                $validatedData['first_name'],
                $validatedData['last_name'],
                $validatedData['email'],
                Hash::make($validatedData['password']),
                'Proponent',
                'active',
                $now,
                $now
            ]);

            $newUserId = DB::getPdo()->lastInsertId();

            DB::insert('
                INSERT INTO user_details (user_id, student_id, department, program, adviser_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ', [
                $newUserId,
                $validatedData['student_id'],
                $validatedData['department'],
                $validatedData['program'],
                $validatedData['adviser_id'],
                $now,
                $now
            ]);
        });

        return $this->show($newUserId);
    }

    /**
     * Display the specified proponent's personal details for the edit form.
     */
    public function show($id)
    {
        // Selects only the necessary fields for the edit form based on your schema
        $proponent = DB::selectOne("
            SELECT
                u.id, u.first_name, u.last_name, u.email,
                ud.student_id, ud.department, ud.program, ud.adviser_id
            FROM users u
            LEFT JOIN user_details ud ON u.id = ud.user_id
            WHERE u.id = ? AND u.role = 'Proponent'
        ", [$id]);

        if (!$proponent) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }

        return response()->json($proponent);
    }

    /**
     * Update the specified proponent's personal details.
     */
    public function update(Request $request, $id)
    {
        if (!DB::selectOne('SELECT id FROM users WHERE id = ? AND role = "Proponent"', [$id])) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }

        // Validation does NOT include a profile_image field
        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'student_id' => 'sometimes|required|string|max:50',
            'department' => 'sometimes|required|string|max:50',
            'program' => 'sometimes|required|string|max:50',
            'adviser_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validatedData, $id) {
            // Update 'users' table
            $userFields = array_intersect_key($validatedData, array_flip(['first_name', 'last_name', 'email']));
            if (!empty($userFields)) {
                $updateClauses = [];
                $bindings = [];
                foreach ($userFields as $key => $value) {
                    $updateClauses[] = "$key = ?";
                    $bindings[] = $value;
                }
                $bindings[] = $id;
                DB::update('UPDATE users SET ' . implode(', ', $updateClauses) . ' WHERE id = ?', $bindings);
            }

            // Update or Insert 'user_details'
            $userDetailFields = array_intersect_key($validatedData, array_flip(['student_id', 'department', 'program', 'adviser_id']));
            if (!empty($userDetailFields)) {
                if (DB::selectOne('SELECT user_id FROM user_details WHERE user_id = ?', [$id])) {
                    $updateClauses = [];
                    $bindings = [];
                    foreach ($userDetailFields as $key => $value) {
                        $updateClauses[] = "$key = ?";
                        $bindings[] = $value;
                    }
                    $bindings[] = $id;
                    DB::update('UPDATE user_details SET ' . implode(', ', $updateClauses) . ' WHERE user_id = ?', $bindings);
                } else {
                    $userDetailFields['user_id'] = $id;
                    $columns = implode(', ', array_keys($userDetailFields));
                    $placeholders = implode(', ', array_fill(0, count($userDetailFields), '?'));
                    DB::insert("INSERT INTO user_details ($columns) VALUES ($placeholders)", array_values($userDetailFields));
                }
            }
        });

        return $this->show($id);
    }

    /**
     * Set the proponent's status to 'restricted'.
     */
    public function destroy($id)
    {
        $affected = DB::update("UPDATE users SET status = 'restricted' WHERE id = ? AND role = 'Proponent'", [$id]);
        if ($affected === 0) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }
        return response()->json(['message' => 'Proponent has been restricted successfully.']);
    }
}
