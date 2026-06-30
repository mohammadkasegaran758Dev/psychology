<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('total_price', 12, 2);

            $table->enum('status', ['pending', 'paid', 'failed'])
                ->default('pending');

            $table->string('payment_gateway')->nullable();
            $table->string('payment_ref')->nullable();
            $table->string('tracking_code')->nullable();


            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
