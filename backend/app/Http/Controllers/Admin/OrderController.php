<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * لیست سفارشات همراه با اطلاعات خریدار و فیلتر وضعیت
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['user:id,name,email', 'transaction']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('order_number')) {
            $query->where('order_number', 'like', "%{$request->order_number}%");
        }

        $orders = $query->latest()->paginate(15);

        return response()->json($orders);
    }

    /**
     * جزئیات کامل یک سفارش همراه با آیتم‌های خرید و تراکنش‌ها
     */
    public function show(Order $order): JsonResponse
    {
        return response()->json(
            $order->load(['user:id,name,email', 'items.course:id,title,price', 'transaction'])
        );
    }

    /**
     * تایید یا تغییر دستی وضعیت سفارش توسط ادمین (مثلاً پرداخت کارت به کارت یا آفلاین)
     */
    public function updateStatus(Request $request, Order $order, EnrollmentService $enrollmentService): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,cancelled,refunded',
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        if ($oldStatus === $newStatus) {
            return response()->json(['message' => 'وضعیت تغییری نکرده است.'], 400);
        }

        $order->update([
            'status' => $newStatus,
            'paid_at' => $newStatus === 'paid' ? now() : $order->paid_at,
        ]);

        // اگر سفارش به وضعیت "پرداخت شده" تغییر یافت، دسترسی به دوره‌ها صادر شود
        if ($newStatus === 'paid') {
            $enrollmentService->enrollFromOrder($order);
        }

        return response()->json([
            'message' => 'وضعیت سفارش با موفقیت به روز رسانی شد.',
            'order' => $order
        ]);
    }
}
