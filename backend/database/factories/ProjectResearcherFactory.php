<?php

namespace Database\Factories;

use App\Models\CapstoneProject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectResearcherFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id' => CapstoneProject::factory(),
            'user_id' => User::factory(['role' => 'Proponent']),
            'member_hacker' => fake()->name(),
            'member_hipster1' => fake()->name(),
            'member_hipster2' => fake()->optional()->name(),
        ];
    }
}