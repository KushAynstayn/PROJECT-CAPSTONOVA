<?php

namespace App\Http\Controllers\Api\UserManagement;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rules\Password;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Foundation\Exceptions\Renderer\Exception;

class MProponentController extends Controller
{
    /**
     * Display a listing of active proponents with their details.
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 50;
        $offset = ($page - 1) * $perPage;

        // Base query to select active Proponents and their advisers.
        $baseSql = "
    FROM users u
    LEFT JOIN user_details ud ON u.id = ud.user_id
    LEFT JOIN users adv ON ud.adviser_id = adv.id
    WHERE u.role = 'Proponent' AND u.status = 'active'
";

        $bindings = [];
        $searchSql = '';

        // Handle search requests.
        if ($request->has('search') && $request->input('search')) {
            $plainSearchTerm = $request->input('search');
            $likeSearchTerm = '%' . $plainSearchTerm . '%';
            // Hash the search term to allow for exact-match searching on the email.
            $hashedSearchTerm = hash('sha256', $plainSearchTerm);

            // The search query now checks 'u.hashed_email' for exact matches.
            // Other fields continue to use a LIKE comparison.
            $searchSql = "
        AND (
            u.first_name LIKE ? OR u.last_name LIKE ? OR u.hashed_email = ? OR
            ud.student_id LIKE ? OR ud.department LIKE ? OR ud.program LIKE ? OR
            adv.first_name LIKE ? OR adv.last_name LIKE ?
        )
    ";

            // The bindings array is updated to include the hashed search term.
            $bindings = [
                $likeSearchTerm,
                $likeSearchTerm,
                $hashedSearchTerm,
                $likeSearchTerm,
                $likeSearchTerm,
                $likeSearchTerm,
                $likeSearchTerm,
                $likeSearchTerm
            ];
        }

        // Get the total count of records for pagination.
        $total = DB::selectOne("SELECT count(u.id) as total " . $baseSql . $searchSql, $bindings)->total;

        // The SELECT statement now fetches 'u.encrypted_email' instead of a plain email.
        $results = DB::select("
    SELECT
        u.id,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        u.encrypted_email,
        ud.student_id as id_number,
        ud.department,
        ud.program,
        CONCAT(adv.first_name, ' ', adv.last_name) as adviser
    " . $baseSql . $searchSql . "
    ORDER BY u.created_at DESC LIMIT ? OFFSET ?
", [...$bindings, $perPage, $offset]);

        // Transform the raw database results to show encrypted email with ellipsis
        $transformedResults = array_map(function ($item) {
            // Show first 12 characters of the encrypted email with ellipsis
            $item->email = strlen($item->encrypted_email) > 12
                ? substr($item->encrypted_email, 0, 12) . '...'
                : $item->encrypted_email;

            // Remove the encrypted field so the final JSON response is clean
            unset($item->encrypted_email);
            return $item;
        }, $results);

        // Create a paginator instance manually for the JSON response.
        $paginator = new LengthAwarePaginator(
            $transformedResults,
            $total,
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

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
            'middle_name' => 'nullable|string|max:100',
            'email' => 'required|string|email|max:255|unique:users,hashed_email', // Check uniqueness against hashed_email
            'password' => ['required', 'confirmed', Password::defaults()],
            'student_id' => 'required|string|max:50',
            'department' => 'required|string|max:50',
            'program' => 'required|string|max:50',
            'adviser_id' => 'required|integer|exists:users,id',
        ]);

        $newUserId = null;
        DB::transaction(function () use ($validatedData, &$newUserId) {
            $now = now();
            $email = $validatedData['email']; // Frontend still sends plain email

            // Encrypt and hash the email for database storage
            $encryptedEmail = Crypt::encryptString($email);
            $hashedEmail = hash('sha256', $email);

            DB::insert('
            INSERT INTO users (first_name, last_name, middle_name, encrypted_email, hashed_email, password, role, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ', [
                $validatedData['first_name'],
                $validatedData['last_name'],
                $validatedData['middle_name'] ?? null,
                $encryptedEmail,
                $hashedEmail,
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
            u.id, u.first_name, u.last_name, u.middle_name,
            u.encrypted_email, u.hashed_email, -- Select the encrypted/hashed fields
            ud.student_id, ud.department, ud.program, ud.adviser_id
        FROM users u
        LEFT JOIN user_details ud ON u.id = ud.user_id
        WHERE u.id = ? AND u.role = 'Proponent'
    ", [$id]);

        if (!$proponent) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }

        // Decrypt the email for the frontend response (maintains same JSON structure)
        try {
            $decryptedEmail = Crypt::decryptString($proponent->encrypted_email);
        } catch (Exception $e) {
            // Fallback in case decryption fails
            $decryptedEmail = 'Email not available';
        }

        // Reconstruct the response object with the decrypted email
        $response = [
            'id' => $proponent->id,
            'first_name' => $proponent->first_name,
            'last_name' => $proponent->last_name,
            'middle_name' => $proponent->middle_name,
            'email' => $decryptedEmail, // Return as 'email' for frontend compatibility
            'student_id' => $proponent->student_id,
            'department' => $proponent->department,
            'program' => $proponent->program,
            'adviser_id' => $proponent->adviser_id,
        ];

        return response()->json($response);
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
            'middle_name' => 'sometimes|nullable|string|max:100',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'hashed_email')->ignore($id)], // Check uniqueness against hashed_email
            'student_id' => 'sometimes|required|string|max:50',
            'department' => 'sometimes|required|string|max:50',
            'program' => 'sometimes|required|string|max:50',
            'adviser_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validatedData, $id) {
            // Update 'users' table
            $userFields = array_intersect_key($validatedData, array_flip(['first_name', 'last_name', 'middle_name', 'email']));
            if (!empty($userFields)) {
                $updateClauses = [];
                $bindings = [];

                foreach ($userFields as $key => $value) {
                    if ($key === 'email') {
                        // Handle email encryption and hashing
                        $updateClauses[] = 'encrypted_email = ?';
                        $updateClauses[] = 'hashed_email = ?';
                        $bindings[] = Crypt::encryptString($value);
                        $bindings[] = hash('sha256', $value);
                    } else {
                        $updateClauses[] = "$key = ?";
                        $bindings[] = $value;
                    }
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
