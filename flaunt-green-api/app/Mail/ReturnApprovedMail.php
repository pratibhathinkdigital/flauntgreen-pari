<?php

namespace App\Mail;

use App\Models\ReturnRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReturnApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public ReturnRequest $returnRequest;

    public function __construct(ReturnRequest $returnRequest)
    {
        $this->returnRequest = $returnRequest;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Return Request Approved for Order #{$this->returnRequest->order_number} - Flaunt Green",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.return_approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
