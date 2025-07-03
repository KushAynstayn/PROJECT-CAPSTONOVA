<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ActionTypeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'action_name' => fake()->unique()->word(),
        ];
    }
}