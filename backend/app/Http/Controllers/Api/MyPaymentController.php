<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $payments = $request->user()->payments()->latest()->get();

        return response()->json([
            'message' => 'My payments fetched successfully.',
            'data' => $payments->map(fn($payment) => [
                'id' => $payment->id,
                'order_id' => $payment->order_id,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'gateway' => $payment->gateway,
                'paid_at' => $payment->paid_at,
            ]),
        ]);
    }

    public function show(Payment $payment, Request $request): JsonResponse
    {
        abort_unless($payment->user_id === $request->user()->id, 403, 'You do not have access to this payment.');

        return response()->json([
            'message' => 'Payment fetched successfully.',
            'data' => [
                'id' => $payment->id,
                'order_id' => $payment->order_id,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'gateway' => $payment->gateway,
                'paid_at' => $payment->paid_at,
            ],
        ]);
    }
}
