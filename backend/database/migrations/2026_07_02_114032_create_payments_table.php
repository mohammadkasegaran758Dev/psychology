<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {

            $table->id();

            $table->foreignId('order_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // zarinpal / idpay / nextpay
            $table->string('gateway');

            // pending/success/failed/refunded
            $table->string('status')
                ->default('pending');

            // مبلغ پرداخت
            $table->decimal('amount', 12, 2);

            // authority token gateway
            $table->string('authority')
                ->nullable();

            // ref id بعد verify
            $table->string('ref_id')
                ->nullable();

            // payload خام درگاه
            $table->json('gateway_response')
                ->nullable();

            $table->timestamp('paid_at')
                ->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
