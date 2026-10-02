<?php

namespace App\Mail;

use App\Models\Coupon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CouponPromoMail extends Mailable
{
    use Queueable, SerializesModels;

    public Coupon $coupon;
    public string $customerName;
    public ?string $customMessage;

    /**
     * Create a new message instance.
     */
    public function __construct(Coupon $coupon, string $customerName, ?string $customMessage = null)
    {
        $this->coupon = $coupon;
        $this->customerName = $customerName;
        $this->customMessage = $customMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $discountText = $this->coupon->type === 'percent'
            ? "{$this->coupon->value}% OFF"
            : "₹{$this->coupon->value} OFF";

        return new Envelope(
            subject: "Special Gift from Flaunt Green: Use code {$this->coupon->code} for {$discountText}!",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.coupon_promo',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
