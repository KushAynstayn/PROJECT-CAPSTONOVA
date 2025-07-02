<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('capstone_projects')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('keyword_id')->constrained('keywords')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_keywords');
    }
};
