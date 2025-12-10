<?php

namespace Database\Seeders;

use App\Models\CapstoneProject;
use App\Models\Keyword;
use App\Models\PlatformType; // Added import
use App\Models\ProgrammingLanguage;
use App\Models\ProjectResearcher;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class CapstoneProjectSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $faker->seed(1234);

        $adviserIds = User::where('role', 'Adviser')->pluck('id');
        $keywordIds = Keyword::pluck('id');
        $languageIds = ProgrammingLanguage::pluck('id');
        $platformTypeIds = PlatformType::pluck('id'); // Fetch Platform Types

        if ($adviserIds->isEmpty() || $keywordIds->isEmpty() || $languageIds->isEmpty() || $platformTypeIds->isEmpty()) {
            $this->command->warn('Advisers, keywords, languages, or platforms not found. Skipping CapstoneProjectSeeder.');
            return;
        }

        $proponentIds = collect();

        DB::transaction(function () use ($faker, $adviserIds, $keywordIds, $languageIds, $platformTypeIds, &$proponentIds) {
            for ($year = 2010; $year <= 2025; $year++) {
                $projectsPerYear = $faker->numberBetween(5, 25);

                for ($i = 0; $i < $projectsPerYear; $i++) {
                    $proponent = $this->getOrCreateProponent($faker, $adviserIds, $proponentIds);
                    $submissionDate = $faker->dateTimeBetween("$year-01-01", "$year-12-31");

                    $project = CapstoneProject::factory()->create([
                        'adviser_id' => $adviserIds->random(),
                        'submission_year' => $year,
                        'submission_date' => $submissionDate,
                        // platform_type removed from create
                        'is_archived' => $faker->boolean(10),
                    ]);

                    // Attach Keywords
                    $project->keywords()->attach(
                        $keywordIds->random($faker->numberBetween(2, 5))->all()
                    );

                    // NEW: Attach Platform Types (Random 1 to 2 platforms)
                    $project->platformTypes()->attach(
                        $platformTypeIds->random($faker->numberBetween(1, 2))->all()
                    );

                    if ($project->sourceCode) {
                        $project->sourceCode->programmingLanguages()->attach(
                            $languageIds->random($faker->numberBetween(1, 3))->all()
                        );
                    }

                    ProjectResearcher::create([
                        'project_id' => $project->id,
                        'user_id' => $proponent->id,
                        'member_hacker' => $proponent->first_name . ' ' . $proponent->last_name,
                        'member_hipster1' => $faker->name(),
                        'member_hipster2' => $faker->boolean(75) ? $faker->name() : null,
                    ]);
                }
            }

            while ($proponentIds->count() < 100) {
                $this->getOrCreateProponent($faker, $adviserIds, $proponentIds);
            }
        });
    }

    private function getOrCreateProponent($faker, $adviserIds, &$proponentIds)
    {
        $shouldCreateNew = $proponentIds->isEmpty() || $faker->boolean(60);

        if ($shouldCreateNew) {
            $email = $faker->unique()->safeEmail();

            $user = User::factory()->create([
                'role' => 'Proponent',
                'encrypted_email' => Crypt::encryptString($email),
                'hashed_email' => hash('sha256', $email),
                'password' => Hash::make('password'),
            ]);

            UserDetail::factory()->create([
                'user_id' => $user->id,
                'adviser_id' => $adviserIds->random(),
            ]);

            $proponentIds->push($user->id);

            return $user;
        } else {
            return User::find($proponentIds->random());
        }
    }
}
