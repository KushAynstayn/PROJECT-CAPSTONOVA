<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserDetailFactory extends Factory
{
    public function definition(): array
    {
        return [
            // user_id is now expected to be passed from the Seeder.
            'student_id' => fake()->unique()->numerify('########'),
            // Updated with your new business logic
            'department' => fake()->randomElement(['BSIT', 'BIT-CT', 'BSIS']),
            'program' => fake()->randomElement(['Day program', 'Evening program']),
            'adviser_id' => User::factory(['role' => 'Adviser']),
        ];
    }
}
