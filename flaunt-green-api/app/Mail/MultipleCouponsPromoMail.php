<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class MultipleCouponsPromoMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var Collection
     */
    public $coupons;
    public string $customerName;
    public ?string $customMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($coupons, string $customerName, ?string $customMessage = null)
    {
        $this->coupons = $coupons;
        $this->customerName = $customerName;
        $this->customMessage = $customMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $count = count($this->coupons);
        return new Envelope(
            subject: "Exclusive Promo Codes Just For You ({$count} Offers) - Flaunt Green",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.multiple_coupons_promo',
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
