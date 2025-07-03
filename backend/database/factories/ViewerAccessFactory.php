<?php

namespace Database\Factories;

use App\Models\CapstoneProject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ViewerAccessFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(['role' => 'Viewer']),
            'project_id' => CapstoneProject::factory(),
            'grant_date' => fake()->dateTime(),
            'expiry_date' => fake()->optional()->dateTime(),
        ];
    }
}