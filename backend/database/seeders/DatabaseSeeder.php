<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ActionTypeSeeder::class,
            KeywordSeeder::class,
            ProgrammingLanguageSeeder::class,
            SystemSettingSeeder::class,
            UserSeeder::class, // This now handles User and UserDetail creation
            WhitelistSeeder::class,
            CapstoneProjectSeeder::class,
            SuggestionSeeder::class,
            DocumentRequestSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
