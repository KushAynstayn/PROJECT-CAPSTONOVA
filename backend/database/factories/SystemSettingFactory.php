<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SystemSettingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'setting_name' => fake()->unique()->word(),
            'is_enabled' => fake()->boolean(),
            'description' => fake()->optional()->sentence(),
        ];
    }
}