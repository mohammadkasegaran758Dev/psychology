<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Models\Payment;
use App\Services\EnrollmentService;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        protected EnrollmentService $enrollmentService
    ) {
    }

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

        $this->enrollmentService->enrollFromOrder($order);

        return [
            'payment' => $payment,
            'order' => $order,
        ];
    }
}
