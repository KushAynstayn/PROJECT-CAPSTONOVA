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
        // MODIFIED: Generate a date first (from 2000-01-01 to now)
        $submissionDate = fake()->dateTimeBetween('2000-01-01', 'now');

        return [
            'title' => fake()->sentence(6),
            'abstract' => fake()->paragraph(3),
            'adviser_id' => User::factory(['role' => 'Adviser']),
            'submission_date' => $submissionDate, // Use the generated date
            'submission_year' => $submissionDate->format('Y'), // Extract the year from it
            'is_archived' => fake()->boolean(10)
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (CapstoneProject $project) {
            CapstoneManuscript::factory()->create(['project_id' => $project->id]);
            CapstoneSourceCode::factory()->create(['project_id' => $project->id]);
            // ProjectAttachment::factory()->create(['project_id' => $project->id]); // <-- REMOVED as requested to ignore the project_attachments table. [cite: 1683]
        });
    }
}
