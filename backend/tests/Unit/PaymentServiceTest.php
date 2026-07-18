<?php

namespace Tests\Unit;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\User;
use App\Services\EnrollmentService;
use App\Services\Payments\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_verify_payment_only_marks_payment_and_order_once(): void
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

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-TEST',
            'subtotal' => 100,
            'discount_amount' => 0,
            'total_amount' => 100,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'course_id' => $course->id,
            'price' => 100,
            'discount_amount' => 0,
            'final_price' => 100,
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'gateway' => 'zarinpal',
            'status' => 'pending',
            'amount' => 100,
            'authority' => 'A123456789012345678901234',
        ]);

        $service = new PaymentService(new EnrollmentService());

        $result = $service->verifyPayment($payment);
        $this->assertSame('success', $result['payment']->status);
        $this->assertSame('paid', $result['order']->status);
        $this->assertTrue(
            Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->exists()
        );
    }
}
