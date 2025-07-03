<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['role' => 'Super Admin', 'first_name' => 'Super', 'last_name' => 'Admin'],
            ['role' => 'Admin', 'first_name' => 'System', 'last_name' => 'Admin'],
            ['role' => 'Adviser', 'first_name' => 'John', 'last_name' => 'Adviser'],
            ['role' => 'Proponent', 'first_name' => 'Jane', 'last_name' => 'Proponent'],
            ['role' => 'Viewer', 'first_name' => 'Guest', 'last_name' => 'Viewer'],
        ];

        foreach ($users as $userData) {
            User::factory()->create([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'email' => strtolower($userData['first_name']) . '@example.com',
                'password' => Hash::make('password'),
                'role' => $userData['role'],
            ]);
        }

        User::factory(10)->create();
    }
}