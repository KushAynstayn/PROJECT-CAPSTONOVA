<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SuggestionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'adviser_id' => User::factory(['role' => 'Adviser']),
            'title' => fake()->sentence(6),
            'suggestion_text' => fake()->paragraph(),
            'submission_date' => fake()->date(),
            'is_archived' => fake()->boolean(),
            'interested_student_id' => fake()->optional()->randomElement(User::where('role', 'Viewer')->pluck('id')->toArray()),
        ];
    }
}
