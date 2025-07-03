<?php

namespace Database\Seeders;

use App\Models\Whitelist;
use Illuminate\Database\Seeder;

class WhitelistSeeder extends Seeder
{
    public function run(): void
    {
        Whitelist::factory()->count(10)->create();
    }
}