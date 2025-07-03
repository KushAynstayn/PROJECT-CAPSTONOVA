<?php

namespace Database\Factories;

use App\Models\CapstoneProject;
use Illuminate\Database\Eloquent\Factories\Factory;

class CapstoneManuscriptFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id' => CapstoneProject::factory(),
            'file_path' => '/manuscripts/' . fake()->uuid() . '.pdf',
            'acm_path' => '/acm/' . fake()->uuid() . '.pdf',
            'project_size' => fake()->randomFloat(2, 1, 50),
            'upload_date' => fake()->dateTime(),
        ];
    }
}