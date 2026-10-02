<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Mail\CouponPromoMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CouponController extends Controller
{
    /**
     * Public endpoint: Validate a coupon code against a subtotal.
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($request->code));
        $subtotal = (float)$request->subtotal;

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
}
