<?php

namespace App\Http\Controllers\Api\UserManagement;

use App\Models\User;
use Illuminate\Http\Request;
use App\Jobs\SendNotification;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rules\Password;
use Illuminate\Pagination\LengthAwarePaginator;
use Exception;
use App\Models\ActionType;
use App\Models\UserLog;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendVerificationEmailJob;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;

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
            // MODIFIED: Custom closure to check uniqueness against the HASH of the email
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (User::where('hashed_email', hash('sha256', $value))->exists()) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
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
                // email_verified_at is null by default
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

        // --- ADDED: Send Verification Email ---
        $user = User::find($newUserId);
        if ($user) {
            try {
                $plainTextEmail = $validatedData['email'];
                $hash = sha1($user->getEmailForVerification());
                $backendVerificationUrl = URL::temporarySignedRoute(
                    'verification.verify',
                    now()->addMinutes(config('auth.verification.expire', 60)),
                    [
                        'id' => $user->id,
                        'hash' => $hash,
                    ]
                );

                $parts = parse_url($backendVerificationUrl);
                parse_str($parts['query'], $query);

                SendVerificationEmailJob::dispatch(
                    $plainTextEmail,
                    (string) $user->id,
                    $hash,
                    $query['expires'],
                    $query['signature']
                );
            } catch (\Exception $e) {
                Log::error("Failed to dispatch verification email for new proponent {$user->id} (created by admin): " . $e->getMessage());
            }
        }
        // --- END: Send Verification Email ---

        $adminIds = User::whereIn('role', ['Super Admin', 'Admin'])->pluck('id')->toArray();
        $newProponentName = $validatedData['first_name'] . ' ' . $validatedData['last_name'];
        $notificationMessage = "A new Proponent account has been created for {$newProponentName}.";

        SendNotification::dispatch('New Proponent Account', $notificationMessage, null, $adminIds);

        $actionType = ActionType::firstOrCreate(['action_name' => 'create_proponent']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Created a new Proponent account for {$newProponentName}."
        ]);

        return $this->show($newUserId);
    }

    /**
     * Display the specified proponent's personal details for the edit form.
     */
    public function show($id)
    {
        $proponent = DB::selectOne("
            SELECT
                u.id, u.first_name, u.last_name, u.middle_name,
                u.encrypted_email, u.hashed_email,
                ud.student_id, ud.department, ud.program, ud.adviser_id
            FROM users u
            LEFT JOIN user_details ud ON u.id = ud.user_id
            WHERE u.id = ? AND u.role = 'Proponent'
        ", [$id]);

        if (!$proponent) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }

        try {
            $decryptedEmail = Crypt::decryptString($proponent->encrypted_email);
        } catch (Exception $e) {
            $decryptedEmail = 'Email not available';
        }

        $response = [
            'id' => $proponent->id,
            'first_name' => $proponent->first_name,
            'last_name' => $proponent->last_name,
            'middle_name' => $proponent->middle_name,
            'email' => $decryptedEmail,
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
        $user = User::where('id', $id)->where('role', 'Proponent')->first();
        if (!$user) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }

        $currentEmail = $user->getEmailForVerification();
        $emailChanged = false;

        $validatedData = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'middle_name' => 'sometimes|nullable|string|max:100',
            // MODIFIED: Custom closure to ignore the current user's ID
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                function ($attribute, $value, $fail) use ($id) {
                    $hashedValue = hash('sha256', $value);
                    if (User::where('hashed_email', $hashedValue)->where('id', '!=', $id)->exists()) {
                        $fail('The email has already been taken.');
                    }
                },
            ],
            'student_id' => 'sometimes|required|string|max:50',
            'department' => 'sometimes|required|string|max:50',
            'program' => 'sometimes|required|string|max:50',
            'adviser_id' => 'sometimes|required|integer|exists:users,id',
        ]);

        DB::transaction(function () use ($validatedData, $id, $currentEmail, &$emailChanged) {
            // Update 'users' table
            $userFields = array_intersect_key($validatedData, array_flip(['first_name', 'last_name', 'middle_name', 'email']));
            if (!empty($userFields)) {
                $updateClauses = [];
                $bindings = [];

                foreach ($userFields as $key => $value) {
                    if ($key === 'email') {
                        if ($value !== $currentEmail) {
                            $updateClauses[] = 'encrypted_email = ?';
                            $updateClauses[] = 'hashed_email = ?';
                            $updateClauses[] = 'email_verified_at = ?';
                            $bindings[] = Crypt::encryptString($value);
                            $bindings[] = hash('sha256', $value);
                            $bindings[] = null;
                            $emailChanged = true;
                        }
                    } else {
                        $updateClauses[] = "$key = ?";
                        $bindings[] = $value;
                    }
                }

                if (!empty($bindings)) {
                    $bindings[] = $id;
                    DB::update('UPDATE users SET ' . implode(', ', $updateClauses) . ' WHERE id = ?', $bindings);
                }
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

        // --- ADDED: Re-send Verification Email if it was changed ---
        if ($emailChanged) {
            $user = User::find($id);
            try {
                $plainTextEmail = $user->getEmailForVerification();
                $hash = sha1($plainTextEmail);
                $backendVerificationUrl = URL::temporarySignedRoute(
                    'verification.verify',
                    now()->addMinutes(config('auth.verification.expire', 60)),
                    ['id' => $user->id, 'hash' => $hash]
                );
                $parts = parse_url($backendVerificationUrl);
                parse_str($parts['query'], $query);
                SendVerificationEmailJob::dispatch(
                    $plainTextEmail,
                    (string) $user->id,
                    $hash,
                    $query['expires'],
                    $query['signature']
                );
            } catch (\Exception $e) {
                Log::error("Failed to re-send verification email for proponent {$id} (admin update): " . $e->getMessage());
            }
        }
        // --- END: Re-send Verification Email ---

        $actionType = ActionType::firstOrCreate(['action_name' => 'update_proponent']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Updated details for Proponent (ID: {$id})."
        ]);

        return $this->show($id);
    }

    /**
     * Set the proponent's status to 'restricted'.
     */
    public function destroy($id)
    {
        $proponent = User::where('id', $id)->where('role', 'Proponent')->first();
        if (!$proponent) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }

        $affected = DB::update("UPDATE users SET status = 'restricted' WHERE id = ? AND role = 'Proponent'", [$id]);
        if ($affected === 0) {
            return response()->json(['message' => 'Proponent not found.'], 404);
        }

        $actionType = ActionType::firstOrCreate(['action_name' => 'restrict_proponent']);
        UserLog::create([
            'user_id' => Auth::id(),
            'action_type_id' => $actionType->id,
            'details' => "Restricted Proponent account for {$proponent->first_name} {$proponent->last_name} (ID: {$id})."
        ]);

        return response()->json(['message' => 'Proponent has been restricted successfully.']);
    }
}
