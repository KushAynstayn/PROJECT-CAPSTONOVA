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
        Schema::create('file_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chunked_upload_id')->constrained('chunked_uploads')->cascadeOnDelete();
            $table->unsignedInteger('chunk_number');
            $table->string('chunk_path');
            $table->timestamps();

            // Ensures a chunk number can't be duplicated for the same upload
            $table->unique(['chunked_upload_id', 'chunk_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_chunks');
    }
};
