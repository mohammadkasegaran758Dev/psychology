<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Orders\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);

        $order = $this->orderService->createOrder($request->user()->id, $validated['course_id']);

        return response()->json([
            'message' => 'Order created successfully.',
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
                'subtotal_amount' => $order->subtotal,
                'discount_amount' => $order->discount_amount,
                'total_amount' => $order->total_amount,
                'items' => $order->items->map(fn($item) => [
                    'course_id' => $item->course_id,
                    'title' => $item->course?->title,
                    'price' => $item->price,
                    'discount_price' => $item->discount_amount,
                    'final_price' => $item->final_price,
                ]),
            ],
        ], 201);
    }

    public function show(Order $order, Request $request): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403, 'You do not have access to this order.');

        $order->load(['items.course', 'payments']);

        return response()->json([
            'message' => 'Order fetched successfully.',
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
                'subtotal_amount' => $order->subtotal,
                'discount_amount' => $order->discount_amount,
                'total_amount' => $order->total_amount,
                'paid_at' => $order->paid_at,
                'items' => $order->items->map(fn($item) => [
                    'course_id' => $item->course_id,
                    'title' => $item->course?->title,
                    'price' => $item->price,
                    'discount_price' => $item->discount_amount,
                    'final_price' => $item->final_price,
                ]),
                'payment' => $order->payments->first() ? [
                    'id' => $order->payments->first()->id,
                    'status' => $order->payments->first()->status,
                ] : null,
            ],
        ]);
    }
}
