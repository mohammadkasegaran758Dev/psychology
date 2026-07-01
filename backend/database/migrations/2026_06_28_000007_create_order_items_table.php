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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('course_id')
                ->constrained()
                ->cascadeOnDelete();

            // قیمت دوره هنگام خرید
            $table->unsignedBigInteger('price');

            // تخفیف روی این آیتم
            $table->unsignedBigInteger('discount_amount')->default(0);

            // قیمت نهایی
            $table->unsignedBigInteger('final_price');

            $table->timestamps();

            // جلوگیری از ثبت تکراری
            $table->unique(['order_id', 'course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
