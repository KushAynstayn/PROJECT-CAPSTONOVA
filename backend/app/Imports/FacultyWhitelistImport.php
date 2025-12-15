<?php

namespace App\Imports;

use App\Models\FacultyWhitelist;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class FacultyWhitelistImport implements ToCollection, WithHeadingRow, WithValidation
{
    private array $errors = [];
    private int $processedRows = 0;

    public function collection(Collection $rows)
    {
        // 1. Validate all rows before touching the database
        $this->validateRows($rows);

        if (!empty($this->errors)) {
            return;
        }

        // 2. Insert validated rows
        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $email = $row['email'];

                FacultyWhitelist::create([
                    'faculty_id'      => (string) $row['faculty_id'],
                    'role'            => ucfirst(strtolower($row['role'])),
                    // FIX: Pass the PLAIN email. The Model's mutator will handle the encryption.
                    // DO NOT use Crypt::encryptString($email) here.
                    'encrypted_email' => $email,
                    'hashed_email'    => hash('sha256', $email),
                ]);

                $this->processedRows++;
            }
        });
    }

    private function validateRows(Collection $rows)
    {
        $emailsInFile = $rows->pluck('email')->map('strtolower')->all();
        $facultyIdsInFile = $rows->pluck('faculty_id')->all();

        // Check for duplicates within the file itself
        if (count($emailsInFile) !== count(array_unique($emailsInFile))) {
            $this->errors[] = 'The Excel file contains duplicate email addresses.';
        }
        if (count($facultyIdsInFile) !== count(array_unique($facultyIdsInFile))) {
            $this->errors[] = 'The Excel file contains duplicate Faculty IDs.';
        }
        if (!empty($this->errors)) return;

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;

            $validator = Validator::make($row->toArray(), [
                'faculty_id' => 'required|max:50|distinct|unique:faculty_whitelist,faculty_id',
                'email'      => 'required|email',
                'role'       => 'required|in:Admin,Adviser,admin,adviser',
            ]);

            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $error) {
                    $this->errors[] = "Row {$rowNumber}: {$error}";
                }
                continue;
            }

            // Check email uniqueness using the hash column
            $hashedEmail = hash('sha256', $row['email']);
            if (FacultyWhitelist::where('hashed_email', $hashedEmail)->exists()) {
                $this->errors[] = "Row {$rowNumber}: The email '{$row['email']}' is already whitelisted.";
            }
        }
    }

    public function rules(): array
    {
        return [
            'faculty_id' => 'required',
            'email'      => 'required',
            'role'       => 'required',
        ];
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getProcessedCount(): int
    {
        return $this->processedRows;
    }
}
