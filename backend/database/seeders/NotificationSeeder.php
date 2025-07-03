<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            Notification::factory(rand(1, 5))->create(['user_id' => $user->id]);
        }
    }
}