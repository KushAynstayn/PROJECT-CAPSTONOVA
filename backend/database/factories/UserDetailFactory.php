<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserDetail>
 */
class UserDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => fake()->unique()->numerify('########'),
            // Only use allowed department and program values
            'department' => fake()->randomElement(['BSIT', 'BIT-CT', 'BSIS']),
            'program' => fake()->randomElement(['Day program', 'Evening program']),
            'adviser_id' => User::factory(['role' => 'Adviser']),
        ];
    }
}
