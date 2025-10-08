<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Create 1 Super Admin
            $this->createFixedUser('Super Admin', 1);

            // Create 10 Admins
            $this->createFixedUser('Admin', 10);

            // Create 30 Advisers
            $this->createFixedUser('Adviser', 30);
            $adviserIds = User::where('role', 'Adviser')->pluck('id');

            // Create 50 Viewers
            if ($adviserIds->isNotEmpty()) {
                for ($i = 1; $i <= 50; $i++) {
                    $email = "viewer{$i}@viewer.com";
                    $user = User::factory()->create([
                        'first_name' => 'Viewer',
                        'last_name' => "User {$i}",
                        'role' => 'Viewer',
                        'encrypted_email' => Crypt::encryptString($email),
                        'hashed_email' => hash('sha256', $email),
                        'password' => Hash::make('password'),
                    ]);

                    UserDetail::factory()->create([
                        'user_id' => $user->id,
                        'adviser_id' => $adviserIds->random(),
                    ]);
                }
            }
        });
    }

    /**
     * Helper function to create a fixed user with a predictable email.
     */
    private function createFixedUser(string $role, int $count): void
    {
        for ($i = 1; $i <= $count; $i++) {
            $roleHandle = str_replace(' ', '', strtolower($role));
            $email = "{$roleHandle}{$i}@{$roleHandle}.com";
            User::factory()->create([
                'first_name' => $role,
                'last_name' => "User {$i}",
                'role' => $role,
                'encrypted_email' => Crypt::encryptString($email),
                'hashed_email' => hash('sha256', $email),
                'password' => Hash::make('password'),
            ]);
        }
    }
}
