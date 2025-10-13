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
        Schema::create('panels', function (Blueprint $table) {
            $table->id('panel_id');
            $table->foreignId('project_researcher_id')
                ->constrained('project_researchers')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('panel_member_1', 255);
            $table->string('panel_member_2', 255)->nullable();
            $table->string('panel_member_3', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('panels');
    }
};
