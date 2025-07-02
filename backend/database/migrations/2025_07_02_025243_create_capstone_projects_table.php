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
        Schema::create('capstone_projects', function (Blueprint $table) {
            $table->id('id');
            $table->string('title', 255);
            $table->text('abstract');
            $table->foreignId('adviser_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->date('submission_date');
            $table->year('submission_year');
            $table->boolean('is_archived')->default(false);
            $table->string('platform_type', 50);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capstone_projects');
    }
};
