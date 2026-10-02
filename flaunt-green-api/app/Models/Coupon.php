<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_spend',
        'max_discount',
        'usage_limit',
        'used_count',
        'expires_at',
        'is_active',
        'description',
    ];

    protected $casts = [
        'value'        => 'float',
        'min_spend'    => 'float',
        'max_discount' => 'float',
        'usage_limit'  => 'integer',
        'used_count'   => 'integer',
        'is_active'    => 'boolean',
        'expires_at'   => 'datetime',
    ];

    /**
     * Check if the coupon is valid given a subtotal amount.
     */
    public function isValidFor(float $subtotal, ?string &$errorMessage = null): bool
    {
        if (!$this->is_active) {
            $errorMessage = 'This promo code is no longer active.';
            return false;
        }

        if ($this->expires_at && Carbon::now()->greaterThan($this->expires_at)) {
            $errorMessage = 'This promo code has expired.';
            return false;
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            $errorMessage = 'This promo code has reached its maximum redemption limit.';
            return false;
        }

        if ($this->min_spend > 0 && $subtotal < $this->min_spend) {
            $errorMessage = 'This promo code requires a minimum order of ₹' . number_format($this->min_spend, 2);
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount for a given subtotal.
     */
    public function calculateDiscount(float $subtotal): float
    {
        if ($this->type === 'percent') {
            $discount = ($subtotal * $this->value) / 100;
            if ($this->max_discount !== null && $this->max_discount > 0) {
                $discount = min($discount, $this->max_discount);
            }
            return round($discount, 2);
        }

        // Fixed discount
        return round(min($this->value, $subtotal), 2);
    }
}
