<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Whitelist;
use Illuminate\Database\Seeder;

class WhitelistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing Advisers to assign them to whitelisted students.
        $advisers = User::where('role', 'Adviser')->pluck('id');

        // Ensure at least one adviser exists before running the seeder.
        if ($advisers->isEmpty()) {
            // Create one adviser if none exist.
            $adviser = User::factory()->create(['role' => 'Adviser']);
            $advisers = collect([$adviser->id]);
        }

        // REVISED LOGIC: Create 50 new whitelist entries for students who are
        // now eligible to register in the system.
        for ($i = 0; $i < 50; $i++) {
            Whitelist::factory()->create([
                'adviser_id' => $advisers->random(),
            ]);
        }
    }
}
