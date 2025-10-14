<?php

namespace Database\Seeders;

use App\Models\Panel;
use App\Models\ProjectResearcher;
use Illuminate\Database\Seeder;

class PanelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projectResearchers = ProjectResearcher::all();

        if ($projectResearchers->isEmpty()) {
            $this->command->warn('No project researchers found. Skipping PanelSeeder.');
            return;
        }

        foreach ($projectResearchers as $researcher) {
            Panel::factory()->create([
                'project_researcher_id' => $researcher->id,
            ]);
        }
    }
}
