<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserDetailFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'student_id' => fake()->unique()->numerify('########'),
            'department' => fake()->word(),
            'program' => fake()->word(),
            'adviser_id' => User::factory(['role' => 'Adviser']),
        ];
    }
}