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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('course_id')
                ->constrained()
                ->cascadeOnDelete();

            // سفارش مرتبط
            $table->foreignId('order_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // نوع دسترسی
            $table->enum('access_type', [
                'purchase',
                'gift',
                'manual',
                'subscription'
            ])->default('purchase');

            // وضعیت
            $table->enum('status', [
                'active',
                'expired',
                'revoked'
            ])->default('active');

            // تاریخ انقضا (برای اشتراک)
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();

            // جلوگیری از ثبت تکراری
            $table->unique(['user_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
