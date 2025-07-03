<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Seeder;

class UserDetailSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::whereIn('role', ['Proponent', 'Viewer'])->get();
        foreach ($students as $student) {
            if (!$student->userDetail) {
                UserDetail::factory()->create(['user_id' => $student->id]);
            }
        }
    }
}