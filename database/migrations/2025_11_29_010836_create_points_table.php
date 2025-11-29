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
        Schema::create('points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('meditation')->default(0); // spirituality
            $table->integer('brain')->default(0);      // intelligence
            $table->integer('skills')->default(0);     // skills
            $table->integer('diet')->default(0);       // health
            $table->integer('training')->default(0);   // body_kinesthetic
            $table->integer('analyse')->default(0);    // awareness
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points');
    }
};
