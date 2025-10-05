<?php

namespace Database\Factories;

use App\Models\CapstoneManuscript;
use App\Models\CapstoneProject;
use App\Models\CapstoneSourceCode;
use App\Models\ProjectAttachment;
use App\Models\ProjectResearcher;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CapstoneProjectFactory extends Factory
{
    protected $model = CapstoneProject::class;

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

    public function configure()
    {
        return $this->afterCreating(function (CapstoneProject $project) {
            CapstoneManuscript::factory()->create(['project_id' => $project->id]);
            CapstoneSourceCode::factory()->create(['project_id' => $project->id]);
            // ProjectAttachment::factory()->create(['project_id' => $project->id]); // <-- REMOVED as requested to ignore the project_attachments table.
        });
    }
}
