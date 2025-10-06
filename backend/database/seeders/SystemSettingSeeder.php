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
        // Clear existing settings to start fresh
        SystemSetting::query()->delete();

        // Define settings grouped by user role based on the provided images
        $roleSettings = [
            'admin' => [
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
            ],
            'adviser' => [
                'updateProfile',
                'changePassword',
                'viewAdvisee',
                'viewProjects',
                'searchProjects',
                'createSuggestion',
                'viewOwnSuggestion',
                'viewOthersSuggestion',
                'viewArchivedSuggestions',
                'archiveOwnSuggestion',
                'returnArchivedSuggestion',
                'dataAnalyticsView',
                'getNotifications',
            ],
            'proponent' => [
                'updateProfile',
                'changePassword',
                'uploadProjects',
                'getNotifications',
            ],
            'viewer' => [
                'updateProfile',
                'changePassword',
                'registerAccount',
                'viewAbstract',
                'requestFullAccess',
                'viewSuggestions',
                'dataAnalyticsView',
                'getNotifications',
            ],
        ];

        // Iterate through each role and its settings to create prefixed entries
        foreach ($roleSettings as $role => $settings) {
            foreach ($settings as $settingName) {
                // Create the prefixed setting name (e.g., 'admin_updateProfile')
                $prefixedName = $role . '_' . $settingName;

                SystemSetting::create([
                    'setting_name' => $prefixedName,
                    'is_enabled'   => true, // Enable all features by default
                    'description'  => 'Enables the ' . $settingName . ' feature for the ' . ucfirst($role) . ' role.',
                ]);
            }
        }
    }
}
