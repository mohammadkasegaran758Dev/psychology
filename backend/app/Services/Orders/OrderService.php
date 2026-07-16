<?php

namespace App\Services\Orders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\EnrollmentService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        protected EnrollmentService $enrollmentService
    ) {
    }

    public function createOrder(int $userId, int $courseId): Order
    {
        $course = Course::findOrFail($courseId);

        if ($course->status !== 'published') {
            throw new \InvalidArgumentException('Course is not available for purchase.');
        }

        if ($this->userHasActiveEnrollment($userId, $courseId)) {
            throw new \InvalidArgumentException('User already has active access to this course.');
        }

        $pendingOrder = Order::query()
            ->where('user_id', $userId)
            ->where('status', 'pending')
            ->whereHas('items', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->first();

        if ($pendingOrder) {
            return $pendingOrder;
        }

        $finalPrice = (float) ($course->discount_price ?? $course->price);
        $subtotal = (int) round((float) $course->price);
        $discountAmount = max(0, $subtotal - (int) round($finalPrice));
        $totalAmount = (int) round($finalPrice);

        return DB::transaction(function () use ($userId, $course, $subtotal, $discountAmount, $totalAmount): Order {
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

            if ($totalAmount <= 0) {
                $order->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                $this->enrollmentService->enrollFromOrder($order);
            }

            return $order;
        });
    }

    protected function userHasActiveEnrollment(int $userId, int $courseId): bool
    {
        return Enrollment::query()
            ->where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->exists();
    }
}
