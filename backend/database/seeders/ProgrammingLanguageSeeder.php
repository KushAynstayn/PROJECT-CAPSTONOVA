<?php

namespace Database\Seeders;

use App\Models\ProgrammingLanguage;
use Illuminate\Database\Seeder;

class ProgrammingLanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = ['PHP', 'Java', 'Swift', 'Python', 'C++'];
        $frameworks = ['Laravel', 'Django', 'Flutter', 'React', 'Vue'];

        foreach ($languages as $language) {
            ProgrammingLanguage::create(['language_name' => $language, 'is_framework' => false]);
        }

        foreach ($frameworks as $framework) {
            ProgrammingLanguage::create(['language_name' => $framework, 'is_framework' => true]);
        }
    }
}