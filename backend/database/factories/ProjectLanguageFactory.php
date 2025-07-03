<?php

namespace Database\Factories;

use App\Models\CapstoneSourceCode;
use App\Models\ProgrammingLanguage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectLanguageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'source_code_id' => CapstoneSourceCode::factory(),
            'language_id' => ProgrammingLanguage::factory(),
        ];
    }
}