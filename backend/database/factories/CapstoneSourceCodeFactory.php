<?php

namespace Database\Factories;

use App\Models\CapstoneProject;
use Illuminate\Database\Eloquent\Factories\Factory;

class CapstoneSourceCodeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id' => CapstoneProject::factory(),
            'file_path' => fake()->optional()->filePath(),
            'repository_url' => fake()->optional()->url(),
            'upload_date' => fake()->dateTime(),
        ];
    }
}