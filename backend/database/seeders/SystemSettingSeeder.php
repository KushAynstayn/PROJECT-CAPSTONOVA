<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing settings to prevent duplicates on re-seeding
        SystemSetting::query()->delete();

        $settings = [
            // Admin toggles
            'updateProfile',
            'changePassword',
            'createAdviserAccount',
            'uploadWhitelist',
            'viewWhitelist',
            'viewSubmissions',
            'searchProjects',
            'archiveProjects',
            'restoreProjects',
            'viewSuggestions',
            'viewArchived',
            'dataAnalyticsView',
            'reportsView',
            'getNotifications',

            // Adviser toggles
            'viewAdvisee',
            'viewProjects',
            'createSuggestion',
            'viewOwnSuggestion',
            'viewOthersSuggestion',
            'viewArchivedSuggestions',
            'archiveOwnSuggestion',
            'returnArchivedSuggestion',

            // Proponent toggles
            'uploadProjects',

            // Viewer toggles
            'registerAccount',
            'viewAbstract',
            'requestFullAccess',
        ];

        // Remove duplicates that apply to multiple roles
        $uniqueSettings = array_unique($settings);

        foreach ($uniqueSettings as $settingName) {
            SystemSetting::create([
                'setting_name' => $settingName,
                'is_enabled' => true, // Enable all features by default
                'description' => 'Enables the ' . $settingName . ' feature.',
            ]);
        }
    }
}
