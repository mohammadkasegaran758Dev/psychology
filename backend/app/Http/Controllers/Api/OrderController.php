<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'integer', 'exists:courses,id'],
        ]);

        $course = Course::findOrFail($validated['course_id']);

        $finalPrice = (float) ($course->discount_price ?? $course->price);
        $subtotal = (int) round((float) $course->price);
        $discountAmount = max(0, $subtotal - (int) round($finalPrice));
        $totalAmount = (int) round($finalPrice);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'course_id' => $course->id,
            'price' => $subtotal,
            'discount_amount' => $discountAmount,
            'final_price' => $totalAmount,
        ]);

        return response()->json([
            'message' => 'Order created successfully.',
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
                'subtotal_amount' => $order->subtotal,
                'discount_amount' => $order->discount_amount,
                'total_amount' => $order->total_amount,
                'items' => [
                    [
                        'course_id' => $course->id,
                        'title' => $course->title,
                        'price' => $subtotal,
                        'discount_price' => $finalPrice,
                        'final_price' => $totalAmount,
                    ]
                ],
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
