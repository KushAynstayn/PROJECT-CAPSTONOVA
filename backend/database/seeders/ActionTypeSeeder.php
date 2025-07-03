<?php

namespace Database\Seeders;

use App\Models\ActionType;
use Illuminate\Database\Seeder;

class ActionTypeSeeder extends Seeder
{
    public function run(): void
    {
        $actions = ['login', 'logout', 'upload_project', 'download_manuscript', 'create_user', 'update_settings'];

        foreach ($actions as $action) {
            ActionType::create(['action_name' => $action]);
        }
    }
}