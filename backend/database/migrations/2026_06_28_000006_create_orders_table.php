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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // کاربر خریدار
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // شماره سفارش
            $table->string('order_number')->unique();

            // مبلغ کل قبل تخفیف
            $table->unsignedBigInteger('subtotal')->default(0);

            // مبلغ تخفیف
            $table->unsignedBigInteger('discount_amount')->default(0);

            // مبلغ نهایی
            $table->unsignedBigInteger('total_amount')->default(0);

            // وضعیت سفارش
            $table->enum('status', [
                'pending',
                'paid',
                'failed',
                'cancelled',
                'refunded'
            ])->default('pending');

            // زمان پرداخت موفق
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();

            // ایندکس‌ها
            $table->index('status');
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
