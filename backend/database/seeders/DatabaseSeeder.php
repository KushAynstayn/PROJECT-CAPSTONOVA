<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Independent Data
            ActionTypeSeeder::class,
            KeywordSeeder::class,
            ProgrammingLanguageSeeder::class,
            SystemSettingSeeder::class,
            
            // User Data
            UserSeeder::class,
            UserDetailSeeder::class,
            WhitelistSeeder::class,

            // Project and related data
            CapstoneProjectSeeder::class,
            SuggestionSeeder::class,
            
            // Activity and Permissions
            DocumentRequestSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}