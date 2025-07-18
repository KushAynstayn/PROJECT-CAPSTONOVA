<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Whitelist;
use Illuminate\Support\Collection;
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
        $this->validateRows($rows);

        if (!empty($this->errors)) {
            return;
        }

        DB::transaction(function () use ($rows) {
            foreach ($rows as $row) {
                $adviser = $this->findAdviser($row['adviser_name']);

                Whitelist::create([
                    'student_email' => $row['student_email'],
                    'student_id'    => $row['student_id'],
                    'adviser_id'    => $adviser->id,
                ]);

                $this->processedRows++;
            }
        });
    }

    private function findAdviser(string $fullName)
    {
        $searchTerm = trim(preg_replace('/\s+/', ' ', $fullName));

        return User::where('role', 'Adviser')
            ->where(function ($query) use ($searchTerm) {
                $query->where(DB::raw("CONCAT(first_name, ' ', last_name)"), 'LIKE', "%{$searchTerm}%")
                    ->orWhere(DB::raw("CONCAT(first_name, ' ', middle_name, ' ', last_name)"), 'LIKE', "%{$searchTerm}%");
            })
            ->first();
    }

    private function validateRows(Collection $rows)
    {
        $emailsInFile = $rows->pluck('student_email')->map('strtolower')->all();
        $studentIdsInFile = $rows->pluck('student_id')->all();

        // Check for duplicate emails or student IDs within the Excel file
        if (count($emailsInFile) !== count(array_unique($emailsInFile))) {
            $this->errors[] = 'The Excel file contains duplicate email addresses.';
        }
        if (count($studentIdsInFile) !== count(array_unique($studentIdsInFile))) {
            $this->errors[] = 'The Excel file contains duplicate student IDs.';
        }
        if (!empty($this->errors)) return;

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // Account for header row

            $validator = Validator::make($row->toArray(), [
                'student_email' => 'required|email|unique:whitelist,student_email',
                'student_id'    => 'required|numeric|unique:whitelist,student_id',
                'adviser_name'  => 'required|string',
            ]);

            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $error) {
                    $this->errors[] = "Row {$rowNumber}: {$error}";
                }
                continue; // Skip to the next row on validation failure
            }

            if (!$this->findAdviser($row['adviser_name'])) {
                $this->errors[] = "Row {$rowNumber}: Adviser '{$row['adviser_name']}' not found.";
            }
        }
    }

    public function rules(): array
    {
        // This validates the presence of columns on a high level.
        return [
            'student_email' => 'required',
            'student_id'    => 'required',
            'adviser_name'  => 'required',
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
