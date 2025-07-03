<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class WhitelistFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => fake()->randomNumber(8),
            'student_email' => fake()->unique()->safeEmail(),
            'adviser_id' => User::factory(['role' => 'Adviser']),
        ];
    }
}