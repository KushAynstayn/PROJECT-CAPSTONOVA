<?php

namespace Database\Factories;

use App\Models\ActionType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'action_type_id' => ActionType::factory(),
            'details' => fake()->optional()->sentence(),
        ];
    }
}