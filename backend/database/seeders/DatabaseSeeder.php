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
            PlatformTypeSeeder::class, // Added here
            SystemSettingSeeder::class,
            UserSeeder::class,
            WhitelistSeeder::class,
            SuggestionSeeder::class,
            CapstoneProjectSeeder::class,
            PanelSeeder::class,
            DocumentRequestSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
