<?php
// database/factories/CapstoneProjectFactory.php

namespace Database\Factories;

use App\Models\CapstoneManuscript;
use App\Models\CapstoneProject;
use App\Models\CapstoneSourceCode;
use App\Models\ProjectResearcher;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CapstoneProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CapstoneProject::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(6),
            'abstract' => fake()->paragraph(3),
            'adviser_id' => User::factory(['role' => 'Adviser']),
            'submission_date' => fake()->date(),
            'submission_year' => fake()->year(),
            'is_archived' => fake()->boolean(10),
            'platform_type' => fake()->randomElement(['Web', 'Mobile', 'IoT', 'Desktop']),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (CapstoneProject $project) {
            // Create related one-to-one models after a project is created.
            CapstoneManuscript::factory()->create(['project_id' => $project->id]);
            CapstoneSourceCode::factory()->create(['project_id' => $project->id]);
            ProjectResearcher::factory()->create(['project_id' => $project->id]);
        });
    }
}