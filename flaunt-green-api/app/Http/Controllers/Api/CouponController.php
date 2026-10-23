<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Mail\CouponPromoMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

use App\Mail\MultipleCouponsPromoMail;

class CouponController extends Controller
{
    /**
     * Public endpoint: Validate a coupon code or multiple stacked codes against a subtotal.
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code'     => 'nullable|string',
            'codes'    => 'nullable|array',
            'codes.*'  => 'string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $subtotal = (float)$request->subtotal;

        // If an array of codes is provided
        if ($request->has('codes') && is_array($request->codes)) {
            $rawCodes = array_unique(array_filter(array_map('trim', $request->codes)));
            if (count($rawCodes) > 3) {
                return response()->json([
                    'valid'   => false,
                    'message' => 'You can apply a maximum of 3 promo codes per order.',
                ], 422);
            }

            $validCoupons = [];
            $totalDiscount = 0;
            $invalidMessages = [];

            foreach ($rawCodes as $code) {
                $coupon = Coupon::where('code', strtoupper($code))->first();
                if (!$coupon) {
                    $invalidMessages[] = "Coupon '{$code}' not found.";
                    continue;
                }

                $err = null;
                if (!$coupon->isValidFor($subtotal, $err)) {
                    $invalidMessages[] = "Coupon '{$code}': " . $err;
                    continue;
                }

                $discount = $coupon->calculateDiscount($subtotal);
                $label = $coupon->type === 'percent'
                    ? "{$coupon->value}% off"
                    : "₹" . number_format($coupon->value, 0) . " off";

                $validCoupons[] = [
                    'id'              => $coupon->id,
                    'code'            => $coupon->code,
                    'type'            => $coupon->type,
                    'value'           => $coupon->value,
                    'min_spend'       => $coupon->min_spend,
                    'max_discount'    => $coupon->max_discount,
                    'discount_amount' => $discount,
                    'label'           => $label,
                    'description'     => $coupon->description,
                ];
                $totalDiscount += $discount;
            }

            $totalDiscount = min($totalDiscount, $subtotal);

            return response()->json([
                'valid'            => count($validCoupons) > 0,
                'coupons'          => $validCoupons,
                'total_discount'   => round($totalDiscount, 2),
                'invalid_messages' => $invalidMessages,
            ]);
        }

        // Single code validation
        if (!$request->code) {
            return response()->json([
                'valid'   => false,
                'message' => 'Please provide a promo code.',
            ], 422);
        }

        $code = strtoupper(trim($request->code));
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json([
                'valid'   => false,
                'message' => 'Invalid promo code. Please check and try again.',
            ], 404);
        }

        $errorMessage = null;
        if (!$coupon->isValidFor($subtotal, $errorMessage)) {
            return response()->json([
                'valid'   => false,
                'message' => $errorMessage,
            ], 422);
        }

        $discount = $coupon->calculateDiscount($subtotal);
        $label = $coupon->type === 'percent'
            ? "{$coupon->value}% off"
            : "₹" . number_format($coupon->value, 0) . " off";

        return response()->json([
            'valid'  => true,
            'coupon' => [
                'id'              => $coupon->id,
                'code'            => $coupon->code,
                'type'            => $coupon->type,
                'value'           => $coupon->value,
                'min_spend'       => $coupon->min_spend,
                'max_discount'    => $coupon->max_discount,
                'discount_amount' => $discount,
                'label'           => $label,
                'description'     => $coupon->description,
            ],
        ]);
    }

    /**
     * Admin: List all coupons.
     */
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->get();
        return response()->json($coupons);
    }

    /**
     * Admin: Create a new coupon.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'         => 'required|string|max:50|unique:coupons,code',
            'type'         => 'required|in:percent,fixed',
            'value'        => 'required|numeric|min:0.01',
            'min_spend'    => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit'  => 'nullable|integer|min:1',
            'expires_at'   => 'nullable|date',
            'description'  => 'nullable|string|max:255',
            'is_active'    => 'nullable|boolean',
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['min_spend'] = $validated['min_spend'] ?? 0;

        $coupon = Coupon::create($validated);

        return response()->json([
            'message' => 'Coupon created successfully',
            'coupon'  => $coupon,
        ], 201);
    }

    /**
     * Admin: Update coupon.
     */
    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code'         => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type'         => 'required|in:percent,fixed',
            'value'        => 'required|numeric|min:0.01',
            'min_spend'    => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit'  => 'nullable|integer|min:1',
            'expires_at'   => 'nullable|date',
            'description'  => 'nullable|string|max:255',
            'is_active'    => 'nullable|boolean',
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $coupon->update($validated);

        return response()->json([
            'message' => 'Coupon updated successfully',
            'coupon'  => $coupon,
        ]);
    }

    /**
     * Admin: Delete coupon.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json([
            'message' => 'Coupon deleted successfully',
        ]);
    }

    /**
     * Admin: Send coupon code directly to a customer's email.
     */
    public function sendEmail(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'customer_name'  => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'custom_message' => 'nullable|string|max:1000',
        ]);

        if (!$coupon->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This promo code is currently inactive and cannot be sent.',
            ], 422);
        }

        if ($coupon->expires_at && \Carbon\Carbon::now()->greaterThan($coupon->expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'This promo code has expired and cannot be sent to customers.',
            ], 422);
        }

        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json([
                'success' => false,
                'message' => 'This promo code has reached its maximum usage limit.',
            ], 422);
        }

        try {
            Mail::to($validated['customer_email'])->send(
                new CouponPromoMail(
                    $coupon,
                    $validated['customer_name'],
                    $validated['custom_message'] ?? null
                )
            );

            return response()->json([
                'success' => true,
                'message' => "Promo code {$coupon->code} sent to {$validated['customer_email']} successfully!",
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to send coupon email: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Could not send email: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Send multiple coupon codes in a single email to a customer.
     */
    public function sendMultipleEmail(Request $request)
    {
        $validated = $request->validate([
            'coupon_ids'     => 'required|array|min:1',
            'coupon_ids.*'   => 'integer|exists:coupons,id',
            'customer_name'  => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'custom_message' => 'nullable|string|max:1000',
        ]);

        $coupons = Coupon::whereIn('id', $validated['coupon_ids'])
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>=', now());
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                  ->orWhereRaw('used_count < usage_limit');
            })
            ->get();

        if ($coupons->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No active or unexpired coupons found to send.',
            ], 422);
        }

        try {
            Mail::to($validated['customer_email'])->send(
                new MultipleCouponsPromoMail(
                    $coupons,
                    $validated['customer_name'],
                    $validated['custom_message'] ?? null
                )
            );

            $count = $coupons->count();
            return response()->json([
                'success' => true,
                'message' => "{$count} valid promo codes sent to {$validated['customer_email']} successfully!",
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to send multiple coupons email: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Could not send email: ' . $e->getMessage(),
            ], 500);
        }
    }
}
