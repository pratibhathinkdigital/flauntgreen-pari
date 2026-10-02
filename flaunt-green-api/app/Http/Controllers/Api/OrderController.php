<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Get orders for the authenticated user.
     */
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with(['items', 'returnRequest'])->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    /**
     * Get a specific order by ID or order_number.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $query = Order::with(['items', 'returnRequest', 'user']);

        $order = is_numeric($id)
            ? $query->where('id', $id)->first()
            : $query->where('order_number', $id)->first();

        if (!$order) {
            return response()->json(['error' => 'Order not found.'], 404);
        }

        // If not admin, verify ownership
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        return response()->json($order);
    }

    /**
     * Create a new order (e.g. COD or direct placement).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_name'    => 'required|string|max:255',
            'shipping_phone'   => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'subtotal'         => 'required|numeric|min:0',
            'shipping_cost'    => 'nullable|numeric|min:0',
            'tax'              => 'nullable|numeric|min:0',
            'total'            => 'required|numeric|min:0',
            'payment_method'   => 'required|in:cod,razorpay',
            'notes'            => 'nullable|string',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'nullable',
            'items.*.name'       => 'required|string',
            'items.*.price'      => 'required|numeric',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.size'       => 'nullable|string',
            'items.*.color'      => 'nullable|string',
            'items.*.image'      => 'nullable|string',
            'coupon_code'        => 'nullable|string',
        ]);

        // Server-side stock verification
        foreach ($validated['items'] as $item) {
            $productId = $item['product_id'] ?? null;
            if ($productId) {
                $variantQuery = \App\Models\ProductVariant::where('product_id', $productId);
                if (!empty($item['size'])) {
                    $variantQuery->where('size', $item['size']);
                }
                if (!empty($item['color'])) {
                    $variantQuery->where('color_name', $item['color']);
                }
                $variant = $variantQuery->first();
                if ($variant && $item['quantity'] > $variant->stock) {
                    return response()->json([
                        'error' => "Only {$variant->stock} unit(s) of '{$item['name']}' are available in stock. Please adjust your cart quantity.",
                    ], 422);
                }
            }
        }

        // ── Server-side price & coupon verification ───────────────────────────
        $serverSubtotal = 0;
        foreach ($validated['items'] as $item) {
            if (!empty($item['product_id'])) {
                $product = \App\Models\Product::find($item['product_id']);
                if ($product && $product->is_active) {
                    $serverSubtotal += $product->price * $item['quantity'];
                } else {
                    $serverSubtotal += $item['price'] * $item['quantity'];
                }
            } else {
                $serverSubtotal += $item['price'] * $item['quantity'];
            }
        }

        // Server-side coupon verification
        $discountAmount = 0;
        if (!empty($validated['coupon_code'])) {
            $coupon = \App\Models\Coupon::where('code', strtoupper(trim($validated['coupon_code'])))->first();
            $errorMessage = null;
            if ($coupon && $coupon->isValidFor($serverSubtotal, $errorMessage)) {
                $discountAmount = $coupon->calculateDiscount($serverSubtotal);
            }
        }

        $shippingCost = (float)($validated['shipping_cost'] ?? 0);
        $serverCalculatedTotal = max(0, $serverSubtotal + $shippingCost - $discountAmount);

        // Strict price verification: Tolerance ₹2 (for rounding only)
        $clientAmount = (float) $validated['total'];
        if (abs($clientAmount - $serverCalculatedTotal) > 2) {
            \Illuminate\Support\Facades\Log::error("OrderController: COD Price mismatch. Client: {$clientAmount}, Server: {$serverCalculatedTotal} (Subtotal: {$serverSubtotal}, Disc: {$discountAmount}, Ship: {$shippingCost})");
            return response()->json(['error' => 'Price mismatch. Please refresh your cart and try again.'], 422);
        }

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id'          => auth()->id(),
                'order_number'     => 'FG-' . strtoupper(uniqid()),
                'shipping_name'    => $validated['shipping_name'],
                'shipping_phone'   => $validated['shipping_phone'],
                'shipping_address' => $validated['shipping_address'],
                'subtotal'         => $serverSubtotal,
                'shipping_cost'    => $shippingCost,
                'tax'              => $validated['tax'] ?? 0,
                'total'            => $serverCalculatedTotal,
                'payment_method'   => $validated['payment_method'],
                'payment_status'   => 'pending',
                'status'           => 'pending',
                'notes'            => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                \App\Models\OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['product_id'] ?? null,
                    'name'       => $item['name'],
                    'price'      => $item['price'],
                    'quantity'   => $item['quantity'],
                    'size'       => $item['size'] ?? null,
                    'color'      => $item['color'] ?? null,
                    'image'      => $item['image'] ?? null,
                ]);

                // Automatically deduct stock from variant
                $productId = $item['product_id'] ?? null;
                if ($productId) {
                    $variantQuery = \App\Models\ProductVariant::where('product_id', $productId);
                    if (!empty($item['size'])) {
                        $variantQuery->where('size', $item['size']);
                    }
                    if (!empty($item['color'])) {
                        $variantQuery->where('color_name', $item['color']);
                    }
                    $variant = $variantQuery->first();
                    if ($variant) {
                        $deductQty = min((int)$variant->stock, (int)$item['quantity']);
                        $variant->decrement('stock', $deductQty);
                    }
                }
            }

            \Illuminate\Support\Facades\DB::commit();

            // Attempt to dispatch order confirmation email gracefully
            try {
                $customerEmail = auth()->user()?->email;
                if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                    \Illuminate\Support\Facades\Mail::to($customerEmail)->send(new \App\Mail\OrderPlacedMail($order));
                }
            } catch (\Throwable $mailEx) {
                \Illuminate\Support\Facades\Log::warning("Order confirmation email failed for Order #{$order->order_number}: " . $mailEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order'   => $order->load('items')
            ], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json([
                'success' => false,
                'error'   => 'Failed to create order',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all orders (Admin).
     */
    public function adminIndex(Request $request)
    {
        $status = $request->query('status');
        $query = Order::with(['user', 'items', 'returnRequest'])->orderBy('created_at', 'desc');
        
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }
        
        $orders = $query->get();
        return response()->json($orders);
    }

    /**
     * Update order status (Admin).
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $prevStatus = $order->status;
        $order->status = $request->status;
        
        if ($request->status === 'delivered' && !$order->delivered_at) {
            $order->delivered_at = now();
        }
        
        $order->save();

        // If order was cancelled and wasn't already cancelled, restore stock
        if ($request->status === 'cancelled' && $prevStatus !== 'cancelled') {
            foreach ($order->items as $item) {
                if ($item->product_id) {
                    $variantQuery = \App\Models\ProductVariant::where('product_id', $item->product_id);
                    if (!empty($item->size)) {
                        $variantQuery->where('size', $item->size);
                    }
                    if (!empty($item->color)) {
                        $variantQuery->where('color_name', $item->color);
                    }
                    $variant = $variantQuery->first();
                    if ($variant) {
                        $variant->increment('stock', $item->quantity);
                    }
                }
            }
        }


        // Send Order Status Email if status changed and it's relevant
        if ($prevStatus !== $request->status && in_array($request->status, ['shipped', 'delivered', 'cancelled'])) {
            try {
                $customerEmail = $order->user?->email;
                if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                    \Illuminate\Support\Facades\Mail::to($customerEmail)->send(new \App\Mail\OrderStatusChangedMail($order));
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning("Status email failed for Order #{$order->order_number}: " . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    /**
     * Cancel an order (Customer).
     */
    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        if (!in_array($order->status, ['pending', 'placed', 'processing'])) {
            return response()->json([
                'error' => 'Order cannot be cancelled because it is already ' . $order->status . '.'
            ], 422);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $order->status = 'cancelled';
        if (!empty($validated['reason'])) {
            $order->notes = ($order->notes ? $order->notes . "\n" : '') . "Cancellation Reason: " . $validated['reason'];
        }
        $order->save();

        // Restore inventory stock for variants
        foreach ($order->items as $item) {
            if ($item->product_id) {
                $variantQuery = \App\Models\ProductVariant::where('product_id', $item->product_id);
                if (!empty($item->size)) {
                    $variantQuery->where('size', $item->size);
                }
                if (!empty($item->color)) {
                    $variantQuery->where('color_name', $item->color);
                }
                $variant = $variantQuery->first();
                if ($variant) {
                    $variant->increment('stock', $item->quantity);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully. Stock has been restored.',
            'order'   => $order->fresh()->load('items')
        ]);
    }
}
