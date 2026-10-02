<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    private $razorpay;

    public function __construct()
    {
        $key = config('services.razorpay.key');
        $secret = config('services.razorpay.secret');

        if ($key && $secret) {
            $this->razorpay = new Api($key, $secret);
        }
    }

    public function createIntent(Request $request)
    {
        $validated = $request->validate([
            'amount'           => 'required|numeric|min:1',
            'currency'         => 'required|string|size:3',
            'shipping_name'    => 'required|string|max:255',
            'shipping_phone'   => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'shipping_cost'    => 'nullable|numeric|min:0',
            'coupon_code'      => 'nullable|string|max:50',
            'items'            => 'required|array|min:1',
            'items.*.id'       => 'nullable|integer',
            'items.*.name'     => 'required|string',
            'items.*.price'    => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size'     => 'nullable|string',
            'items.*.color'    => 'nullable|string',
            'items.*.image'    => 'nullable|string',
        ]);

        if (!$this->razorpay) {
            return response()->json(['error' => 'Payment gateway not configured'], 500);
        }

        // ── Server-side price & coupon verification ───────────────────────────
        $serverSubtotal = 0;
        foreach ($validated['items'] as $item) {
            if (!empty($item['id'])) {
                $product = Product::find($item['id']);
                if ($product && $product->is_active) {
                    $serverSubtotal += $product->price * $item['quantity'];
                } else {
                    Log::warning('PaymentController: product id=' . $item['id'] . ' not found, using client price.');
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

        // Strict price verification: Tolerance ₹2 (for rounding only, not ₹500)
        $clientAmount = (float) $validated['amount'];
        if (abs($clientAmount - $serverCalculatedTotal) > 2) {
            Log::error("PaymentController: Price mismatch. Client: {$clientAmount}, Server: {$serverCalculatedTotal} (Subtotal: {$serverSubtotal}, Disc: {$discountAmount}, Ship: {$shippingCost})");
            return response()->json(['error' => 'Price mismatch. Please refresh your cart and try again.'], 422);
        }

        // ── Server-side stock verification ──────────────────────────────────
        foreach ($validated['items'] as $item) {
            if (!empty($item['id'])) {
                $variantQuery = \App\Models\ProductVariant::where('product_id', $item['id']);
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

        DB::beginTransaction();
        try {
            $amountInPaise = intval($clientAmount * 100);

            // Create Razorpay Order
            $orderData = [
                'receipt'         => 'rcptid_' . uniqid(),
                'amount'          => $amountInPaise,
                'currency'        => $validated['currency'],
                'payment_capture' => 1, // auto capture
            ];

            $razorpayOrder = $this->razorpay->order->create($orderData);

            // Create our DB Order (Pending status)
            $order = Order::create([
                'user_id'          => auth()->id(),
                'order_number'     => 'FG-' . strtoupper(uniqid()),
                'razorpay_order_id'=> $razorpayOrder['id'],
                'shipping_name'    => $validated['shipping_name'],
                'shipping_phone'   => $validated['shipping_phone'],
                'shipping_address' => $validated['shipping_address'],
                'subtotal'         => $clientAmount,
                'total'            => $clientAmount,
                'status'           => 'pending',
                'payment_method'   => 'razorpay',
                'payment_status'   => 'pending',
            ]);

            // Create Order Items
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['id'] ?? null,
                    'name'       => $item['name'],
                    'price'      => $item['price'],
                    'quantity'   => $item['quantity'],
                    'size'       => $item['size'] ?? null,
                    'color'      => $item['color'] ?? null,
                    'image'      => $item['image'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'id'          => $razorpayOrder['id'],
                'amount'      => $razorpayOrder['amount'],
                'currency'    => $razorpayOrder['currency'],
                'db_order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Razorpay Create Order Error: ' . $e->getMessage());
            return response()->json([
                'error'   => 'Failed to create payment intent.',
                'message' => app()->isProduction() ? 'An unexpected error occurred.' : $e->getMessage(),
            ], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $validated = $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
        ]);

        if (!$this->razorpay) {
            return response()->json(['error' => 'Payment gateway not configured'], 500);
        }

        try {
            // Verify Razorpay HMAC signature – this is the critical security check
            $this->razorpay->utility->verifyPaymentSignature([
                'razorpay_order_id'   => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature'  => $validated['razorpay_signature'],
            ]);

            $order = Order::where('razorpay_order_id', $validated['razorpay_order_id'])
                          ->where('user_id', auth()->id()) // Ensure the order belongs to the current user
                          ->first();

            if (!$order) {
                Log::warning('PaymentController: Order not found for razorpay_order_id=' . $validated['razorpay_order_id']);
                return response()->json(['success' => false, 'error' => 'Order not found.'], 404);
            }

            // Prevent double-processing
            if ($order->payment_status === 'paid') {
                return response()->json(['success' => true, 'message' => 'Payment already verified.', 'order_number' => $order->order_number]);
            }

            $this->processOrderSuccess($order, $validated['razorpay_payment_id']);

            return response()->json(['success' => true, 'message' => 'Payment verified successfully.', 'order_number' => $order->order_number]);

        } catch (\Razorpay\Api\Errors\SignatureVerificationError $e) {
            Log::error('Razorpay Signature Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Invalid payment signature.'], 400);
        } catch (\Exception $e) {
            Log::error('Razorpay Verify Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error'   => 'Payment verification failed.',
                'message' => app()->isProduction() ? 'An unexpected error occurred.' : $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Razorpay Webhooks (Real-time payment capture & failure events)
     */
    public function webhook(Request $request)
    {
        $webhookSecret = config('services.razorpay.webhook_secret');
        if (empty($webhookSecret)) {
            Log::error('Razorpay Webhook Error: RAZORPAY_WEBHOOK_SECRET is not configured in .env');
            return response()->json(['error' => 'Webhook secret not configured on server'], 500);
        }

        $signature = $request->header('X-Razorpay-Signature');
        if (!$signature) {
            Log::warning('Razorpay Webhook Warning: Missing X-Razorpay-Signature header');
            return response()->json(['error' => 'Missing signature header'], 400);
        }

        $rawBody = $request->getContent();
        if (empty($rawBody)) {
            return response()->json(['error' => 'Empty webhook payload'], 400);
        }

        // Verify HMAC-SHA256 signature
        $expectedSignature = hash_hmac('sha256', $rawBody, $webhookSecret);
        if (!hash_equals($expectedSignature, $signature)) {
            Log::error('Razorpay Webhook Error: Signature verification failed.');
            return response()->json(['error' => 'Invalid webhook signature'], 400);
        }

        $payload = json_decode($rawBody, true);
        if (!$payload || !isset($payload['event'])) {
            return response()->json(['error' => 'Invalid JSON payload'], 400);
        }

        $event = $payload['event'];
        Log::info("Razorpay Webhook received event: {$event}");

        try {
            switch ($event) {
                case 'payment.captured':
                case 'order.paid':
                    $paymentEntity = $payload['payload']['payment']['entity'] ?? null;
                    $orderEntity   = $payload['payload']['order']['entity'] ?? null;

                    $razorpayOrderId   = $orderEntity['id'] ?? ($paymentEntity['order_id'] ?? null);
                    $razorpayPaymentId = $paymentEntity['id'] ?? null;

                    if ($razorpayOrderId) {
                        $order = Order::where('razorpay_order_id', $razorpayOrderId)->first();
                        if ($order) {
                            $this->processOrderSuccess($order, $razorpayPaymentId ?: 'webhook_captured');
                            Log::info("Razorpay Webhook: Order #{$order->order_number} marked paid successfully.");
                        } else {
                            Log::warning("Razorpay Webhook: Order not found for razorpay_order_id: {$razorpayOrderId}");
                        }
                    }
                    break;

                case 'payment.failed':
                    $paymentEntity = $payload['payload']['payment']['entity'] ?? null;
                    $razorpayOrderId = $paymentEntity['order_id'] ?? null;
                    $errorDesc = $paymentEntity['error_description'] ?? 'Payment failed';

                    if ($razorpayOrderId) {
                        $order = Order::where('razorpay_order_id', $razorpayOrderId)->first();
                        if ($order && $order->payment_status === 'pending') {
                            $order->payment_status = 'failed';
                            $order->notes = trim(($order->notes ? $order->notes . ' | ' : '') . 'Failure: ' . $errorDesc);
                            $order->save();
                            Log::info("Razorpay Webhook: Order #{$order->order_number} marked as failed ({$errorDesc}).");
                        }
                    }
                    break;

                default:
                    Log::info("Razorpay Webhook: Unhandled event '{$event}' acknowledged.");
                    break;
            }

            return response()->json(['status' => 'success', 'event' => $event], 200);

        } catch (\Exception $e) {
            Log::error("Razorpay Webhook Exception: " . $e->getMessage());
            return response()->json(['error' => 'Server error processing webhook'], 500);
        }
    }

    /**
     * Mark order as paid and deduct stock atomically with lock protection.
     */
    private function processOrderSuccess(Order $order, string $paymentId): void
    {
        // Prevent double processing if already paid
        if ($order->payment_status === 'paid') {
            return;
        }

        DB::transaction(function () use ($order, $paymentId) {
            // Lock order row to ensure thread-safety against concurrent webhook & verify requests
            $lockedOrder = Order::where('id', $order->id)->lockForUpdate()->first();
            if (!$lockedOrder || $lockedOrder->payment_status === 'paid') {
                return;
            }

            $lockedOrder->payment_status      = 'paid';
            $lockedOrder->status              = 'processing';
            $lockedOrder->razorpay_payment_id = $paymentId;
            $lockedOrder->save();

            // Deduct product variant stock for each purchased item
            foreach ($lockedOrder->items as $item) {
                if ($item->product_id) {
                    $variantQuery = \App\Models\ProductVariant::where('product_id', $item->product_id);
                    if (!empty($item->size)) {
                        $variantQuery->where('size', $item->size);
                    }
                    if (!empty($item->color)) {
                        $variantQuery->where('color_name', $item->color);
                    }
                    $variant = $variantQuery->lockForUpdate()->first();
                    if ($variant) {
                        $deductQty = min((int)$variant->stock, (int)$item->quantity);
                        $variant->decrement('stock', $deductQty);
                    }
                }
            }
        });

        // Send order confirmation email upon successful payment
        try {
            $customerEmail = $order->user?->email;
            if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                \Illuminate\Support\Facades\Mail::to($customerEmail)->send(new \App\Mail\OrderPlacedMail($order));
            }
        } catch (\Throwable $mailEx) {
            Log::warning("Order confirmation email failed for paid Order #{$order->order_number}: " . $mailEx->getMessage());
        }
    }
}
