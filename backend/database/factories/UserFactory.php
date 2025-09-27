<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        $email = fake()->unique()->safeEmail();
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => fake()->optional()->lastName(),
            'encrypted_email' => Crypt::encryptString($email),
            'hashed_email' => hash('sha256', $email),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => fake()->randomElement(['Super Admin', 'Admin', 'Adviser', 'Proponent', 'Viewer']),
            'status' => fake()->randomElement(['active', 'inactive', 'restricted']),
            'remember_token' => Str::random(10),
        ];
    }
}
