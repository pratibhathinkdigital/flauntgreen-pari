<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Handle the incoming contact form submission.
     */
    public function send(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|max:150',
            'phone'   => 'nullable|string|max:20',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|min:10|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        try {
            // Save to database
            \App\Models\ContactMessage::create($data);

            // Send email
            Mail::to(config('mail.admin_address', 'support@flauntgreen.in'))
                ->send(new ContactFormMail(
                    name:    $data['name'],
                    email:   $data['email'],
                    phone:   $data['phone'] ?? '',
                    subject: $data['subject'],
                    message: $data['message'],
                ));

            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully. We\'ll get back to you soon!',
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Contact Form Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send your message. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
