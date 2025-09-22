<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Whitelist;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class WhitelistImport implements ToCollection, WithHeadingRow, WithValidation
{
    private array $errors = [];
    private int $processedRows = 0;

    public function collection(Collection $rows)
    {
        // First, run all validations. The method populates the $this->errors array.
        $this->validateRows($rows);

        // If any errors were found during validation, stop processing.
        if (!empty($this->errors)) {
            return;
        }

        // If validation passes, proceed with creating the entries within a database transaction.
        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $adviser = $this->findAdviser($row['adviser_name']);
                $studentEmail = $row['student_email'];

                // CHANGE: Adapt the create call for the new schema.
                Whitelist::create([
                    'student_id'      => $row['student_id'],
                    'encrypted_email' => Crypt::encryptString($studentEmail),
                    'hashed_email'    => hash('sha256', $studentEmail),
                    'adviser_id'      => $adviser->id,
                ]);

                $this->processedRows++;
            }
        });
    }

    private function validateRows(Collection $rows)
    {
        $emailsInFile = $rows->pluck('student_email')->map('strtolower')->all();
        $studentIdsInFile = $rows->pluck('student_id')->all();

        // Check for duplicate emails or student IDs within the Excel file itself.
        if (count($emailsInFile) !== count(array_unique($emailsInFile))) {
            $this->errors[] = 'The Excel file contains duplicate email addresses.';
        }
        if (count($studentIdsInFile) !== count(array_unique($studentIdsInFile))) {
            $this->errors[] = 'The Excel file contains duplicate student IDs.';
        }
        if (!empty($this->errors)) return; // Stop if file-level duplicates are found.

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // Account for the header row in Excel for user-friendly error messages.

            // CHANGE: The 'unique' rule for student_email is removed from here
            // because it will be checked manually against the hashed_email column.
            $validator = Validator::make($row->toArray(), [
                'student_email' => 'required|email',
                'student_id'    => 'required|numeric|unique:whitelist,student_id',
                'adviser_name'  => 'required|string',
            ]);

            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $error) {
                    $this->errors[] = "Row {$rowNumber}: {$error}";
                }
                continue; // Skip to the next row on validation failure.
            }

            // CHANGE: Manually check for email uniqueness against the hashed_email column in the database.
            $hashedEmail = hash('sha256', $row['student_email']);
            if (Whitelist::where('hashed_email', $hashedEmail)->exists()) {
                $this->errors[] = "Row {$rowNumber}: The email '{$row['student_email']}' has already been whitelisted.";
                continue;
            }

            // Check if the specified adviser can be found in the database.
            if (!$this->findAdviser($row['adviser_name'])) {
                $this->errors[] = "Row {$rowNumber}: Adviser '{$row['adviser_name']}' not found.";
            }
        }
    }

    private function findAdviser(string $fullName)
    {
        // Cleans up the name from the Excel file for a more reliable search.
        $searchTerm = trim(preg_replace('/\s+/', ' ', $fullName));

        // Searches for an adviser by full name (with or without a middle name).
        return User::where('role', 'Adviser')
            ->where(function ($query) use ($searchTerm) {
                $query->where(DB::raw("CONCAT(first_name, ' ', last_name)"), 'LIKE', "%{$searchTerm}%")
                    ->orWhere(DB::raw("CONCAT(first_name, ' ', middle_name, ' ', last_name)"), 'LIKE', "%{$searchTerm}%");
            })
            ->first();
    }

    /**
     * High-level validation rules to ensure required columns are present.
     */
    public function rules(): array
    {
        return [
            'student_email' => 'required',
            'student_id'    => 'required',
            'adviser_name'  => 'required',
        ];
    }

    /**
     * Returns the collection of validation errors.
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Returns the count of successfully processed rows.
     */
    public function getProcessedCount(): int
    {
        return $this->processedRows;
    }
}
