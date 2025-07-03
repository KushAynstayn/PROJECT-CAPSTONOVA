<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CapstoneProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(6),
            'abstract' => fake()->paragraph(3),
            'adviser_id' => User::factory(['role' => 'Adviser']),
            'submission_date' => fake()->date(),
            'submission_year' => fake()->year(),
            'is_archived' => fake()->boolean(10),
            'platform_type' => fake()->randomElement(['Web', 'Mobile', 'IoT', 'Desktop']),
        ];
    }
}