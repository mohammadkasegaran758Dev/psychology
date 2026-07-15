<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()->latest()->paginate(15);

        return response()->json([
            'message' => 'My orders fetched successfully.',
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Order $order, Request $request): JsonResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403, 'You do not have access to this order.');

        return response()->json([
            'message' => 'Order fetched successfully.',
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'paid_at' => $order->paid_at,
            ],
        ]);
    }
}
