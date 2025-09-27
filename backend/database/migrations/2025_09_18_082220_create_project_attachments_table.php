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
        Schema::create('project_attachments', function (Blueprint $table) {
            $table->id('attachment_id');
            $table->foreignId('project_id')->unique()
                ->constrained('capstone_projects')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('user_manual_path', 255)->nullable();
            $table->string('usage_guide_path', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_attachments');
    }
};
