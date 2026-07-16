<?php

namespace Tests\Unit;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Services\EnrollmentService;
use App\Services\Orders\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_course_creates_paid_order_and_enrollment(): void
    {
        $user = User::factory()->create();
        $course = Course::create([
            'title' => 'Free Course',
            'slug' => 'free-course',
            'type' => 'course',
            'price' => 0,
            'discount_price' => null,
            'status' => 'published',
            'created_by' => $user->id,
        ]);

        $service = new OrderService(new EnrollmentService());
        $order = $service->createOrder($user->id, $course->id);

        $this->assertSame('paid', $order->status);
        $this->assertTrue(
            Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->exists()
        );
    }

    public function test_existing_pending_order_for_same_course_is_reused(): void
    {
        $user = User::factory()->create();
        $course = Course::create([
            'title' => 'Paid Course',
            'slug' => 'paid-course',
            'type' => 'course',
            'price' => 100,
            'discount_price' => null,
            'status' => 'published',
            'created_by' => $user->id,
        ]);

        $existingOrder = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-EXISTING',
            'subtotal' => 100,
            'discount_amount' => 0,
            'total_amount' => 100,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $existingOrder->id,
            'course_id' => $course->id,
            'price' => 100,
            'discount_amount' => 0,
            'final_price' => 100,
        ]);

        $service = new OrderService(new EnrollmentService());
        $order = $service->createOrder($user->id, $course->id);

        $this->assertSame($existingOrder->id, $order->id);
        $this->assertSame('pending', $order->status);
    }
}
