<?php

namespace Database\Seeders;

use App\Models\PlatformType;
use Illuminate\Database\Seeder;

class PlatformTypeSeeder extends Seeder
{
    public function run(): void
    {
        $platforms = ['Web', 'Mobile', 'IoT', 'Desktop', 'Cloud', 'Embedded'];

        foreach ($platforms as $platform) {
            PlatformType::create(['platform_name' => $platform]);
        }
    }
}
