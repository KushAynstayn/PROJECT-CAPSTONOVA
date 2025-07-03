<?php

namespace Database\Factories;

use App\Models\CapstoneProject;
use App\Models\Keyword;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectKeywordFactory extends Factory
{
    public function definition(): array
    {
        return [
            'project_id' => CapstoneProject::factory(),
            'keyword_id' => Keyword::factory(),
        ];
    }
}