<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class EnrollmentService
{
    /**
     * اعطای دسترسی به یک کاربر برای یک دوره خاص
     */
    public function enroll(int $userId, int $courseId, ?int $orderId = null, string $accessType = 'manual'): Enrollment
    {
        return Enrollment::updateOrCreate(
            [
                'user_id' => $userId,
                'course_id' => $courseId,
            ],
            [
                'order_id' => $orderId,
                'access_type' => $accessType,
                'status' => 'active',
                'expires_at' => null // یا مقداردهی در صورت نیاز به دسترسی مدت‌دار
            ]
        );
    }

    /**
     * لغو دسترسی کاربر به یک دوره (ابطال دسترسی)
     */
    public function revoke(int $userId, int $courseId): bool
    {
        $enrollment = Enrollment::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();

        if ($enrollment) {
            return $enrollment->update(['status' => 'revoked']);
        }

        return false;
    }

    /**
     * فعال‌سازی دسترسی برای تمام آیتم‌های یک سفارش (پس از پرداخت موفق)
     */
    public function enrollFromOrder(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $this->enroll(
                    userId: $order->user_id,
                    courseId: $item->course_id,
                    orderId: $order->id,
                    accessType: 'purchase'
                );
            }
        });
    }
}
