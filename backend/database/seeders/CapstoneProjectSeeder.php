<?php

namespace Database\Seeders;

use App\Models\CapstoneProject;
use App\Models\Keyword;
use App\Models\ProgrammingLanguage;
use App\Models\ProjectResearcher;
use App\Models\User;
use Illuminate\Database\Seeder;

class CapstoneProjectSeeder extends Seeder
{
    public function run(): void
    {
        $advisers = User::where('role', 'Adviser')->get();
        $proponents = User::where('role', 'Proponent')->get();
        $keywords = Keyword::all();
        $languages = ProgrammingLanguage::all();

        if ($advisers->isEmpty() || $proponents->isEmpty()) {
            return;
        }

        CapstoneProject::factory(20)
            ->hasManuscripts(1)
            ->hasSourceCodes(1)
            ->create([
                'adviser_id' => $advisers->random()->id,
            ])
            ->each(function ($project) use ($proponents, $keywords, $languages) {
                // Attach Researchers
                ProjectResearcher::factory()->create([
                    'project_id' => $project->id,
                    'user_id' => $proponents->random()->id,
                ]);

                // Attach Keywords
                $project->keywords()->attach(
                    $keywords->random(rand(2, 4))->pluck('id')->toArray()
                );

                // Attach Languages
                $sourceCode = $project->sourceCodes->first();
                if ($sourceCode) {
                    $sourceCode->programmingLanguages()->attach(
                        $languages->random(rand(2, 3))->pluck('id')->toArray()
                    );
                }
            });
    }
}