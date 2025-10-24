<?php

namespace Database\Seeders;

use App\Models\CapstoneProject;
use App\Models\Keyword;
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
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $faker->seed(1234); // Seed for deterministic results [cite: 2196]
        $adviserIds = User::where('role', 'Adviser')->pluck('id');
        $keywordIds = Keyword::pluck('id');
        $languageIds = ProgrammingLanguage::pluck('id');

        if ($adviserIds->isEmpty() || $keywordIds->isEmpty() || $languageIds->isEmpty()) {
            $this->command->warn('Advisers, keywords, or programming languages not found. Skipping CapstoneProjectSeeder.');
            return;
        }

        $proponentIds = collect();

        DB::transaction(function () use ($faker, $adviserIds, $keywordIds, $languageIds, &$proponentIds) {
            // MODIFIED: Changed start year from 2010 to 2000
            for ($year = 2000; $year <= 2025; $year++) {
                $projectsPerYear = $faker->numberBetween(5, 25);
                for ($i = 0; $i < $projectsPerYear; $i++) {
                    // Create or reuse a proponent
                    $proponent = $this->getOrCreateProponent($faker, $adviserIds, $proponentIds);
                    $submissionDate = $faker->dateTimeBetween("$year-01-01", "$year-12-31");

                    $project = CapstoneProject::factory()->create([
                        'adviser_id' => $adviserIds->random(),
                        'submission_year' => $year, // This is the loop year
                        'submission_date' => $submissionDate, // This date is generated within that year
                        'platform_type' => $faker->randomElement(['Web', 'Mobile', 'IoT', 'Desktop']),
                        'is_archived' => $faker->boolean(10), // ~10% chance of being archived
                    ]);

                    // Attach Keywords (2-5)
                    $project->keywords()->attach(
                        $keywordIds->random($faker->numberBetween(2, 5))->all()
                    );

                    // Attach Programming Languages (1-3)
                    if ($project->sourceCode) {
                        $project->sourceCode->programmingLanguages()->attach(
                            $languageIds->random($faker->numberBetween(1, 3))->all()
                        );
                    }

                    // Create a single ProjectResearcher entry with random names for other members
                    ProjectResearcher::create([
                        'project_id' => $project->id,
                        'user_id' => $proponent->id, // The real proponent user [cite: 2232]
                        'member_hacker' => $proponent->first_name . ' ' . $proponent->last_name,
                        'member_hipster1' => $faker->name(), // Random placeholder name [cite: 2234]
                        'member_hipster2' => $faker->boolean(75) ? $faker->name() : null, // Optional random placeholder name [cite: 2235]
                    ]);
                }
            }

            // Ensure at least 100 proponents exist
            while ($proponentIds->count() < 100) {
                $this->getOrCreateProponent($faker, $adviserIds, $proponentIds);
            }
        });
    }

    private function getOrCreateProponent($faker, $adviserIds, &$proponentIds)
    {
        $shouldCreateNew = $proponentIds->isEmpty() || $faker->boolean(60); // Higher chance to create new initially
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
