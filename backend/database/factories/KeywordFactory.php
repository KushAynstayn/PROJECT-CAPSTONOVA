<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class KeywordFactory extends Factory
{
    public function definition(): array
    {
        return [
            'keyword_name' => fake()->unique()->word(),
        ];
    }
}