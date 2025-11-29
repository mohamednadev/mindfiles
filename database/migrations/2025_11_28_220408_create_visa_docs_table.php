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
        Schema::create('visa_docs', function (Blueprint $table) {
            $table->id();

            // Document name/title
            $table->string('name');
            $table->string('description');
            $table->string('goals')->nullable();

            // File path (to store DOC/DOCX/PDF/etc.)
            $table->string('file')->nullable();

            // Status: apostilled, translated, done, pending
            $table->enum('status', [
                'pending',
                'in_progress',
                'done',
            ])->default('pending');

            // Category of the document
            $table->enum('category', [
                'personal',
                'sponsor',
                'study',
                'rent',
                'flight reservation',
                'medical',
                'bank statements',
            ])->default('personal');

            $table->timestamps();
            $table->softDeletes();                  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visa_docs');
    }
};