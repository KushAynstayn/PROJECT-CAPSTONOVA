<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PlatformTypeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'platform_name' => fake()->unique()->word(),
        ];
    }
}
