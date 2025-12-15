<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('tickets', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('description')->nullable();

        $table->enum('status', [
            'pending','inprogress','completed','onhold'
        ])->default('pending');

        $table->string('file')->nullable();

        $table->foreignId('assigned_to')
              ->nullable()->constrained('users')
              ->nullOnDelete();

        $table->timestamp('assigned_at')->nullable();

        $table->foreignId('created_by')
              ->constrained('users')->cascadeOnDelete();

        $table->timestamp('completed_at')->nullable();

        $table->softDeletes();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
