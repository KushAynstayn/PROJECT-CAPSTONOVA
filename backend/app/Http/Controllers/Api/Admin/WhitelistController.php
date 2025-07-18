<?php

namespace App\Http\Controllers\Api\Admin;

use Throwable;
use App\Models\Whitelist;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class WhitelistController extends Controller
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
                'distinct:ignore_case', // Ensures emails are unique within the request array
                Rule::unique('whitelist', 'student_email') // Ensures emails are unique in the database
            ],
            'entries.*.student_id' => ['required', 'integer'],
            'entries.*.adviser_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where('role', 'Adviser'),
            ],
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            $formattedErrors = [];
            // This loop restructures the flat error array ("entries.1.field")
            // into the desired nested format ("1": {"field": [...]})
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
                    $result[] = Whitelist::create($entry);
                }
                return $result;
            });

            return response()->json([
                'success' => true,
                'data' => $createdEntries,
            ], Response::HTTP_CREATED);
        } catch (Throwable $e) {
            report($e); // Log the exception

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred during the database transaction.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
