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
        $email = fake()->unique()->safeEmail();

        return [
            // REMOVED: 'user_id' is not part of the whitelist table.
            'student_id'    => fake()->unique()->randomNumber(8), // Based on Data Dictionary (INTEGER) [cite: 28]
            'encrypted_email' => Crypt::encryptString($email), // Based on Data Dictionary [cite: 28]
            'hashed_email'    => hash('sha256', $email), // Based on Data Dictionary [cite: 28]
            'adviser_id'    => User::factory(['role' => 'Adviser']), // Based on Data Dictionary [cite: 28]
        ];
    }
}
