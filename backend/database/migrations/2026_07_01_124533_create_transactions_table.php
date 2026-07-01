<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained()
                ->cascadeOnDelete();

            // درگاه پرداخت
            $table->string('gateway');

            // مبلغ
            $table->unsignedBigInteger('amount');

            // وضعیت
            $table->enum('status', [
                'pending',
                'success',
                'failed'
            ])->default('pending');

            // authority یا token
            $table->string('authority')->nullable();

            // ref id بانک
            $table->string('reference_id')->nullable();

            // پاسخ کامل بانک
            $table->json('gateway_response')->nullable();

            // زمان تایید
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('authority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
