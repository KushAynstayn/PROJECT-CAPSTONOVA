<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if Super Admin already exists to prevent duplicates
        $email = 'superadmin1@superadmin.com';
        $hashedEmail = hash('sha256', $email);

        if (User::where('hashed_email', $hashedEmail)->exists()) {
            return;
        }

        User::factory()->create([
            'first_name' => 'Super Admin',
            'last_name' => 'User 1',
            'role' => 'Super Admin',
            'encrypted_email' => Crypt::encryptString($email),
            'hashed_email' => $hashedEmail,
            'password' => Hash::make('password'),
            'status' => 'active',
        ]);
    }
}
