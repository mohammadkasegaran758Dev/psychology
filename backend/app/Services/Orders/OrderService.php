<?php

namespace App\Services\Orders;

use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Str;

class OrderService
{
    public function createOrder(int $userId, int $courseId): Order
    {
        $course = Course::findOrFail($courseId);
        $finalPrice = (float) ($course->discount_price ?? $course->price);
        $subtotal = (int) round((float) $course->price);
        $discountAmount = max(0, $subtotal - (int) round($finalPrice));
        $totalAmount = (int) round($finalPrice);

        $order = Order::create([
            'user_id' => $userId,
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

        return $order;
    }
}
