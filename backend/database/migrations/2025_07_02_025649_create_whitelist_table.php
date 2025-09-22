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
            // NEW: Foreign key to the user being whitelisted
            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->integer('student_id');
            // NEW: Replaced student_email with encrypted and hashed versions
            $table->text('encrypted_email');
            $table->string('hashed_email')->unique();
            $table->foreignId('adviser_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
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
