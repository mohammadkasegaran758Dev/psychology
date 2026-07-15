<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function request(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
        ]);

        $order = Order::findOrFail($validated['order_id']);
        abort_unless($order->user_id === $request->user()->id, 403, 'You do not have access to this order.');

        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $request->user()->id,
            'gateway' => 'zarinpal',
            'status' => 'pending',
            'amount' => $order->total_amount,
            'authority' => 'A' . Str::random(24),
        ]);

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

        return response()->json([
            'message' => 'Payment verified successfully.',
            'data' => [
                'payment_id' => $payment->id,
                'order_id' => $order->id,
                'payment_status' => $payment->status,
                'order_status' => $order->status,
                'enrollment_created' => true,
            ],
        ]);
    }
}
