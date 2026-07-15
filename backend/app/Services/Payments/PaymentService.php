<?php

namespace App\Services\Payments;

use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Str;

class PaymentService
{
    public function createPendingPayment(Order $order, int $userId): Payment
    {
        return Payment::create([
            'order_id' => $order->id,
            'user_id' => $userId,
            'gateway' => 'zarinpal',
            'status' => 'pending',
            'amount' => $order->total_amount,
            'authority' => 'A' . Str::random(24),
        ]);
    }

    public function verifyPayment(Payment $payment): array
    {
        $payment->update([
            'status' => 'success',
            'paid_at' => now(),
            'gateway_response' => ['status' => 'OK'],
        ]);

        $order = $payment->order;
        $order->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        foreach ($order->items as $item) {
            Enrollment::firstOrCreate([
                'user_id' => $payment->user_id,
                'course_id' => $item->course_id,
                'order_id' => $order->id,
            ], [
                'access_type' => 'purchase',
                'status' => 'active',
                'expires_at' => null,
            ]);
        }

        return [
            'payment' => $payment,
            'order' => $order,
        ];
    }
}
