<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Static data first
            ActionTypeSeeder::class,
            KeywordSeeder::class,
            ProgrammingLanguageSeeder::class,
            SystemSettingSeeder::class,

            // Base users (Admins, Advisers, Viewers)
            UserSeeder::class,

            // Data dependent on users
            WhitelistSeeder::class,
            SuggestionSeeder::class,

            // Complex data with on-the-fly user creation (Proponents)
            CapstoneProjectSeeder::class,

            // Remaining dependent data
            DocumentRequestSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
