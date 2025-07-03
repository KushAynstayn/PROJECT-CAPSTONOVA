<?php

namespace Database\Factories;

use App\Models\CapstoneProject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApprovalHistoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'viewer_id' => User::factory(['role' => 'Viewer']),
            'project_id' => CapstoneProject::factory(),
            'request_date' => fake()->dateTime(),
            'approval_date' => fake()->dateTime(),
            'expiry_date' => fake()->optional()->dateTime(),
            'approver_id' => User::factory(['role' => 'Admin']),
        ];
    }
}