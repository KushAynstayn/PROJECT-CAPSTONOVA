<?php

namespace Database\Seeders;

use App\Models\Keyword;
use Illuminate\Database\Seeder;

class KeywordSeeder extends Seeder
{
    public function run(): void
    {
        $keywords = ['Banking', 'Automation', 'AI', 'Healthcare', 'Agriculture', 'Management'];

        foreach ($keywords as $keyword) {
            Keyword::create(['keyword_name' => $keyword]);
        }
    }
}