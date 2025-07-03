<?php

namespace Database\Seeders;

use App\Models\DocumentRequest;
use Illuminate\Database\Seeder;

class DocumentRequestSeeder extends Seeder
{
    public function run(): void
    {
        DocumentRequest::factory()->count(30)->create();
    }
}