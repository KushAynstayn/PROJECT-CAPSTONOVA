<?php

namespace Database\Factories;

use App\Models\ProjectResearcher;
use Illuminate\Database\Eloquent\Factories\Factory;

class PanelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_researcher_id' => ProjectResearcher::factory(),
            'panel_member_1' => fake()->name(),
            'panel_member_2' => fake()->name(),
            'panel_member_3' => fake()->name(),
        ];
    }
}
