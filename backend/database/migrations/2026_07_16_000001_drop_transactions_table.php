<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('transactions');
    }

    public function down(): void
    {
        Schema::create('transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('gateway');
            $table->unsignedBigInteger('amount');
            $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
            $table->string('authority')->nullable();
            $table->string('reference_id')->nullable();
            $table->json('gateway_response')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            $table->index('status');
            $table->index('authority');
        });
    }
};
