<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProgrammingLanguageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'language_name' => fake()->unique()->word(),
            'is_framework' => fake()->boolean(),
        ];
    }
}