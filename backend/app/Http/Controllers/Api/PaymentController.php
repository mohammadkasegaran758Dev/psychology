<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\Payments\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(protected PaymentService $paymentService)
    {
    }

    public function request(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
        ]);

        $order = Order::findOrFail($validated['order_id']);
        abort_unless($order->user_id === $request->user()->id, 403, 'You do not have access to this order.');

        $payment = $this->paymentService->createPendingPayment($order, $request->user()->id);

        return response()->json([
            'message' => 'Payment request created successfully.',
            'data' => [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'gateway' => $payment->gateway,
                'authority' => $payment->authority,
                'payment_url' => 'https://example.test/pay/' . $payment->authority,
            ],
        ], 201);
    }

    public function verify(Request $request): JsonResponse
    {
        $authority = $request->query('authority');
        $status = $request->query('status');

        if (!$authority || $status !== 'OK') {
            return response()->json([
                'message' => 'Payment verification failed.',
            ], 400);
        }

        $payment = Payment::where('authority', $authority)->firstOrFail();
        abort_unless($payment->user_id === $request->user()->id, 403, 'You do not have access to this payment.');

        $result = $this->paymentService->verifyPayment($payment);

        $payment = $result['payment'];
        $order = $result['order'];

        return response()->json([
            'message' => 'Payment verified successfully.',
            'data' => [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'payment_status' => $payment->status,
                'order_status' => $order->status,
                'enrollment_created' => $order->status === 'paid',
            ],
        ]);
    }
}
