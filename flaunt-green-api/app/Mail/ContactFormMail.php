<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $senderName;
    public string $senderEmail;
    public string $senderPhone;
    public string $contactSubject;
    public string $messageBody;

    /**
     * Create a new message instance.
     */
    public function __construct(string $name, string $email, string $phone, string $subject, string $message)
    {
        $this->senderName  = $name;
        $this->senderEmail = $email;
        $this->senderPhone = $phone;
        $this->contactSubject = $subject;
        $this->messageBody = $message;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Form Enquiry: ' . $this->contactSubject,
            replyTo: [
                new \Illuminate\Mail\Mailables\Address($this->senderEmail, $this->senderName),
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
            with: [
                'senderName'  => $this->senderName,
                'senderEmail' => $this->senderEmail,
                'senderPhone' => $this->senderPhone,
                'subject'     => $this->contactSubject,
                'messageBody' => $this->messageBody,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
