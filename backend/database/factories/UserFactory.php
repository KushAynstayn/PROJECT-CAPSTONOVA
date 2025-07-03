<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => fake()->optional()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => fake()->randomElement(['Super Admin', 'Admin', 'Adviser', 'Proponent', 'Viewer']),
            'status' => fake()->randomElement(['active', 'inactive', 'restricted']),
            'remember_token' => Str::random(10),
        ];
    }
}