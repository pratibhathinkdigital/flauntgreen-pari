<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderItem;
use App\Models\ReturnRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get aggregate statistics and recent data for the admin dashboard.
     */
    public function stats()
    {
        $totalRevenue = (float) Order::whereIn('payment_status', ['paid'])
            ->orWhereIn('status', ['delivered', 'completed'])
            ->sum('total');

        $totalOrders = Order::count();
        $activeCustomers = User::where('role', 'customer')->count();
        $productsCount = Product::where('is_active', true)->count();
        $pendingReturns = ReturnRequest::where('status', 'pending')->count();

        // Order status breakdown
        $statusCounts = [
            'pending'    => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped'    => Order::where('status', 'shipped')->count(),
            'delivered'  => Order::where('status', 'delivered')->count(),
            'cancelled'  => Order::where('status', 'cancelled')->count(),
        ];

        // Recent 6 orders
        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($o) {
                return [
                    'id'       => $o->order_number ?: $o->id,
                    'customer' => $o->shipping_name ?: ($o->user?->name ?: 'Guest'),
                    'product'  => $o->items->first()?->name ?: 'Order items',
                    'amount'   => (float) $o->total,
                    'status'   => $o->status,
                    'date'     => $o->created_at->format('d M'),
                ];
            });

        // Top 5 selling products by quantity sold
        $topProducts = OrderItem::select('name', DB::raw('SUM(quantity) as sales'), DB::raw('SUM(price * quantity) as revenue'))
            ->groupBy('name')
            ->orderByDesc('sales')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_revenue'    => $totalRevenue,
                'total_orders'     => $totalOrders,
                'active_customers' => $activeCustomers,
                'products'         => $productsCount,
                'pending_returns'  => $pendingReturns,
            ],
            'status_counts' => $statusCounts,
            'recent_orders' => $recentOrders,
            'top_products'  => $topProducts,
        ]);
    }
}
