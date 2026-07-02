<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(
        Request $request
    ): JsonResponse {

        $payments = Payment::with([
            'user',
            'order'
        ])
            ->latest()
            ->paginate(20);

        return response()->json([
            'data' => $payments
        ]);
    }

    public function show(
        Payment $payment
    ): JsonResponse {

        $payment->load([
            'user',
            'order'
        ]);

        return response()->json([
            'data' => $payment
        ]);
    }
}
