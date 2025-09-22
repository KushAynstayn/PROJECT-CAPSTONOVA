<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;

class WhitelistFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a fake email to be encrypted and hashed
        $email = fake()->unique()->safeEmail();

        return [
            // NEW: Added user_id, defaults to creating a new Proponent user
            'user_id'       => User::factory(['role' => 'Proponent']),
            'student_id'    => fake()->randomNumber(8),
            // NEW: Encrypts the email string for storage
            'encrypted_email' => Crypt::encryptString($email),
            // NEW: Hashes the email for quick lookups
            'hashed_email'    => hash('sha256', $email),
            'adviser_id'    => User::factory(['role' => 'Adviser']),
        ];
    }
}
