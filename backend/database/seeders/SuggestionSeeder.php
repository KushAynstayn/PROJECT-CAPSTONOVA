<?php

namespace Database\Seeders;

use App\Models\Suggestion;
use Illuminate\Database\Seeder;

class SuggestionSeeder extends Seeder
{
    public function run(): void
    {
        Suggestion::factory()->count(15)->create();
    }
}