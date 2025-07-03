<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'message' => fake()->sentence(),
            'notification_date' => fake()->dateTime(),
            'is_read' => fake()->boolean(),
        ];
    }
}