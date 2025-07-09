<?php
// database/seeders/CapstoneProjectSeeder.php

namespace Database\Seeders;

use App\Models\CapstoneProject;
use App\Models\Keyword;
use App\Models\ProgrammingLanguage;
use App\Models\User;
use Illuminate\Database\Seeder;

class CapstoneProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $advisers = User::where('role', 'Adviser')->get();
        $keywords = Keyword::all();
        $languages = ProgrammingLanguage::all();

        if ($advisers->isEmpty()) {
            return;
        }

        CapstoneProject::factory(20)
            ->create([
                'adviser_id' => $advisers->random()->id,
            ])
            ->each(function (CapstoneProject $project) use ($keywords, $languages) {
                // Attach keywords to the project
                $project->keywords()->attach(
                    $keywords->random(rand(2, 4))->pluck('id')->toArray()
                );

                // Attach programming languages to the project's source code
                $sourceCode = $project->sourceCode;
                if ($sourceCode) {
                    $sourceCode->programmingLanguages()->attach(
                        $languages->random(rand(2, 3))->pluck('id')->toArray()
                    );
                }
            });
    }
}