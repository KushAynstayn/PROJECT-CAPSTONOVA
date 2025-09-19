<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $this->createUsersByRole('Super Admin', 1);
        $this->createUsersByRole('Admin', 5);

        $this->createUsersByRole('Adviser', 10);
        $adviserIds = User::where('role', 'Adviser')->pluck('id');

        $this->createUsersByRole('Proponent', 20, $adviserIds);
        $this->createUsersByRole('Viewer', 30, $adviserIds);
    }

    private function createUsersByRole(string $role, int $count, $adviserIds = null): void
    {
        for ($i = 1; $i <= $count; $i++) {
            $roleHandle = str_replace(' ', '', strtolower($role));
            $email = "{$roleHandle}{$i}@{$roleHandle}.com";

            $user = User::factory()->create([
                'first_name' => $role,
                'last_name' => "User {$i}",
                'role' => $role,
                'encrypted_email' => Crypt::encryptString($email),
                'hashed_email' => hash('sha256', $email),
                'password' => Hash::make('password'),
            ]);

            if ($adviserIds && in_array($role, ['Proponent', 'Viewer'])) {
                UserDetail::factory()->create([
                    'user_id' => $user->id,
                    'adviser_id' => $adviserIds->random(),
                ]);
            }
        }
    }
}
