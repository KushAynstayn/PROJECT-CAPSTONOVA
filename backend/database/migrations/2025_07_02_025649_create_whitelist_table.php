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
        Schema::create('whitelist', function (Blueprint $table) {
            $table->id('whitelist_id');
            // REMOVED: The user_id foreign key was removed as the whitelist
            // contains users who have not registered yet.
            $table->integer('student_id')->unique(); // Based on Data Dictionary [cite: 28]
            $table->text('encrypted_email'); // Based on Data Dictionary [cite: 28]
            $table->string('hashed_email')->unique(); // Based on Data Dictionary [cite: 28]
            $table->foreignId('adviser_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete(); // Based on Data Dictionary [cite: 28]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whitelist');
    }
};
