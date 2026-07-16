<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')
            ->latest()
            ->paginate(20);

        return response()->json($orders);
    }

    public function show(Order $order)
    {
        $order->load([
            'user',
            'items.course',
            'payments'
        ]);

        return response()->json($order);
    }

    public function updateStatus(
        Request $request,
        Order $order,
        EnrollmentService $enrollmentService
    ) {

        $data = $request->validate([
            'status' => [
                'required',
                'in:pending,paid,failed,cancelled,refunded'
            ]
        ]);

        $oldStatus = $order->status;

        $order->update([
            'status' => $data['status']
        ]);

        /*
        فقط زمانی enrollment بساز
        که:
        pending -> paid
        */
        if (
            $oldStatus !== 'paid'
            && $data['status'] === 'paid'
        ) {
            $enrollmentService->enrollFromOrder($order);
        }

        return response()->json([
            'message' => 'وضعیت سفارش بروزرسانی شد.'
        ]);
    }
}
