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
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id('suggestion_id');
            $table->foreignId('adviser_id')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->text('suggestion_text');
            $table->date('submission_date');
            $table->boolean('is_archived')->default(false);
            $table->foreignId('interested_student_id')->nullable()->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suggestions');
    }
};
