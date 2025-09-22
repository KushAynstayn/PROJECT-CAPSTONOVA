<?php

namespace App\Http\Controllers\Api\UserManagement;

use Exception;
use Throwable;
use App\Models\Whitelist;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Imports\WhitelistImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Api\Admin\ImportWhitelistRequest;

class MWhitelistController extends Controller
{
    /**
     * Store newly created resources in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $rules = [
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.student_email' => [
                'required',
                'email',
                'distinct:ignore_case',
            ],
            'entries.*.student_id' => [
                'required',
                'integer',
                'distinct',
                Rule::unique('whitelist', 'student_id'),
            ],
            'entries.*.adviser_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where('role', 'Adviser'),
            ],
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $formattedErrors = [];
            foreach ($validator->errors()->getMessages() as $key => $messages) {
                [, $index, $field] = explode('.', $key);
                $formattedErrors[$index][$field] = $messages;
            }

            return response()->json([
                'success' => false,
                'message' => 'Validation failed for ' . count($formattedErrors) . ' ' . \Illuminate\Support\Str::plural('entry', count($formattedErrors)),
                'errors' => $formattedErrors,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validatedEntries = $validator->validated()['entries'];

        try {
            $createdEntries = DB::transaction(function () use ($validatedEntries) {
                $result = [];
                foreach ($validatedEntries as $entry) {
                    // Transform the email to encrypted and hashed format
                    $studentEmail = $entry['student_email'];

                    $transformedEntry = [
                        'student_id' => $entry['student_id'],
                        'encrypted_email' => Crypt::encryptString($studentEmail),
                        'hashed_email' => hash('sha256', $studentEmail),
                        'adviser_id' => $entry['adviser_id'],
                    ];

                    $result[] = Whitelist::create($transformedEntry);
                }
                return $result;
            });

            return response()->json([
                'success' => true,
                'data' => $createdEntries,
            ], Response::HTTP_CREATED);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred during the database transaction.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param ImportWhitelistRequest $request
     * @return JsonResponse
     */
    public function uploadExcel(ImportWhitelistRequest $request): JsonResponse
    {
        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $file = $request->file('file');

        try {
            $import = new WhitelistImport();
            Excel::import($import, $file);

            $errors = $import->getErrors();
            if (!empty($errors)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed. Please check the errors.',
                    'data'    => [
                        'processed_count' => 0,
                        'failed_rows'     => $errors,
                        'errors'          => $errors,
                    ],
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => 'Whitelist has been successfully uploaded.',
                'data'    => [
                    'processed_count' => $import->getProcessedCount(),
                    'failed_rows'     => [],
                    'errors'          => [],
                ],
            ], 200);
        } catch (Exception $e) {
            // Log the exception for auditing and debugging
            Log::error('Excel Upload Failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred during file processing.',
                'data'    => [
                    'processed_count' => 0,
                    'failed_rows'     => [],
                    'errors'          => [$e->getMessage()],
                ],
            ], 500);
        }
    }

    /**
     * Display a listing of the whitelist entries with adviser names.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $query = DB::table('whitelist')
            ->join('users', 'whitelist.adviser_id', '=', 'users.id')
            ->select(
                'whitelist.whitelist_id',
                'whitelist.student_id',
                DB::raw("CONCAT(LEFT(whitelist.encrypted_email, 12), '...') AS student_email"),
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) AS adviser_name")
            );

        if ($request->has('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $query->where('whitelist.encrypted_email', 'like', $searchTerm);
        }

        $whitelistEntries = $query->latest('whitelist.created_at')->paginate(50);

        return response()->json($whitelistEntries);
    }

    /**
     * Display a specific whitelist entry with the adviser's name.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        $whitelistEntry = DB::table('whitelist')
            ->join('users', 'whitelist.adviser_id', '=', 'users.id')
            ->where('whitelist.whitelist_id', '=', $id)
            ->select(
                'whitelist.*',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) AS adviser_name")
            )
            ->first();

        if (!$whitelistEntry) {
            return response()->json(['message' => 'Entry not found.'], Response::HTTP_NOT_FOUND);
        }

        // Decrypt the email for display
        try {
            $decryptedEmail = Crypt::decryptString($whitelistEntry->encrypted_email);
            $whitelistEntry->student_email = $decryptedEmail;
        } catch (Exception $e) {
            $whitelistEntry->student_email = 'Unable to decrypt email';
        }

        return response()->json($whitelistEntry);
    }

    /**
     * Remove the specified whitelist entry from storage.
     *
     * @param  \App\Models\Whitelist  $whitelist
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Whitelist $whitelist): JsonResponse
    {
        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        try {
            $whitelist->delete();
            return response()->json([
                'success' => true,
                'message' => 'Whitelist entry deleted successfully.',
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            report($e);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete the whitelist entry.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Whitelist  $whitelist
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Whitelist $whitelist): JsonResponse
    {
        if (!Gate::allows('isAdmin')) {
            abort(403, 'Unauthorized - Admin access required');
        }

        try {
            // This will automatically validate the request and throw an exception with
            // detailed errors if it fails, which is caught below.
            $validatedData = $request->validate([
                'student_email' => [
                    'required',
                    'email',
                    // Ensures the email is unique, ignoring the current entry being updated [cite: 259, 262]
                    Rule::unique('whitelist', 'student_email')->ignore($whitelist->whitelist_id, 'whitelist_id'),
                ],
                'student_id' => [
                    'required',
                    'integer',
                    // Ensures the student ID is unique, ignoring the current entry being updated [cite: 259-261]
                    Rule::unique('whitelist', 'student_id')->ignore($whitelist->whitelist_id, 'whitelist_id'),
                ],
                'adviser_id' => [
                    'required',
                    'integer',
                    // Ensures the adviser exists in the 'users' table and has the 'Adviser' role [cite: 59, 263]
                    Rule::exists('users', 'id')->where('role', 'Adviser'),
                ],
            ]);

            // Perform the update within a database transaction for safety
            DB::transaction(function () use ($whitelist, $validatedData) {
                $whitelist->update($validatedData);
            });

            // Re-fetch the data with the adviser's name to return the updated record
            $updatedEntry = DB::table('whitelist')
                ->join('users', 'whitelist.adviser_id', '=', 'users.id')
                ->where('whitelist.whitelist_id', $whitelist->whitelist_id)
                ->select(
                    'whitelist.student_id',
                    'whitelist.student_email',
                    DB::raw("CONCAT(users.first_name, ' ', users.last_name) AS adviser_name")
                )
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Whitelist entry updated successfully.',
                'data' => $updatedEntry
            ]);
        } catch (Throwable $e) {
            // Log the detailed error for server-side debugging
            Log::error('Whitelist Update Failed: ' . $e->getMessage());

            // Return a detailed error message in the response
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], $e instanceof \Illuminate\Validation\ValidationException ? Response::HTTP_UNPROCESSABLE_ENTITY : Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
