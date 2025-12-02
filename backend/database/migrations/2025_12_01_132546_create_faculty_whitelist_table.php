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
        Schema::create('faculty_whitelist', function (Blueprint $table) {
            $table->id('faculty_whitelist_id');
            $table->string('faculty_id', 50)->unique();
            $table->enum('role', ['Admin', 'Adviser']);
            $table->text('encrypted_email');
            $table->string('hashed_email')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_whitelist');
    }
};
