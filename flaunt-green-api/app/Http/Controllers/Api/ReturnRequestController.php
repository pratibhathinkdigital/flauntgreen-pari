<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ReturnRequest;
use App\Mail\ReturnApprovedMail;
use App\Mail\ReturnRejectedMail;
use App\Mail\ReturnRefundedMail;
use App\Mail\ReturnReplacementMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ReturnRequestController extends Controller
{
    /**
     * Customer submits a return/exchange request.
     */
    public function customerStore(Request $request, Order $order)
    {
        // 1. Verify ownership
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        // 2. Verify order is delivered
        if ($order->status !== 'delivered') {
            return response()->json([
                'message' => 'Returns can only be requested once the order has been delivered.'
            ], 422);
        }

        // 3. Verify 48-Hour delivery window
        $deliveredAt = $order->delivered_at ? Carbon::parse($order->delivered_at) : Carbon::parse($order->updated_at);
        $hoursPassed = Carbon::now()->diffInHours($deliveredAt);
        if ($hoursPassed > 48) {
            return response()->json([
                'message' => 'The 48-hour return window has passed. As per Flaunt Green\'s Slow-Fashion & Small-Batch Policy, return requests must be submitted within 48 hours of delivery.'
            ], 422);
        }

        // 4. Check for existing active return request
        $existing = ReturnRequest::where('order_id', $order->id)
            ->whereIn('status', ['pending', 'approved', 'replacement_dispatched', 'refunded'])
            ->first();
        if ($existing) {
            return response()->json([
                'message' => 'A return request is already active for this order.',
                'return_request' => $existing
            ], 422);
        }

        // 5. Validate input
        $validated = $request->validate([
            'reason' => 'required|in:incorrect_product,incorrect_size',
            'items' => 'nullable|array',
            'customer_notes' => 'nullable|string|max:1500',
            'images' => 'nullable|array|max:4',
            'images.*' => 'nullable',
            'refund_account_details' => 'nullable|array',
            'refund_account_details.upi_id' => 'nullable|string|max:100',
            'refund_account_details.account_holder' => 'nullable|string|max:100',
            'refund_account_details.account_number' => 'nullable|string|max:50',
            'refund_account_details.ifsc' => 'nullable|string|max:20',
        ]);

        // Process proof photos securely
        $imageUrls = [];
        if (!Storage::disk('public')->exists('returns')) {
            Storage::disk('public')->makeDirectory('returns');
        }

        if ($request->hasFile('images')) {
            foreach (array_slice($request->file('images'), 0, 4) as $file) {
                if ($file->isValid() && in_array(strtolower($file->getClientOriginalExtension()), ['jpg', 'jpeg', 'png', 'webp'])) {
                    $path = $file->store('returns', 'public');
                    $imageUrls[] = '/storage/' . $path;
                }
            }
        } elseif (!empty($validated['images']) && is_array($validated['images'])) {
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $allowedMimes = [
                'image/jpeg' => 'jpg',
                'image/png'  => 'png',
                'image/webp' => 'webp',
            ];

            foreach (array_slice($validated['images'], 0, 4) as $img) {
                if (!is_string($img)) continue;

                if (preg_match('/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/is', $img, $matches)) {
                    $decoded = base64_decode($matches[2], true);
                    if ($decoded !== false && strlen($decoded) <= 5242880) {
                        $mime = $finfo->buffer($decoded);
                        if (isset($allowedMimes[$mime]) && @getimagesizefromstring($decoded) !== false) {
                            $ext = $allowedMimes[$mime];
                            $filename = 'returns/ret_' . \Illuminate\Support\Str::random(24) . '_' . time() . '.' . $ext;
                            Storage::disk('public')->put($filename, $decoded);
                            $imageUrls[] = '/storage/' . $filename;
                        }
                    }
                }
            }
        }

        // Create return request
        $returnRequest = ReturnRequest::create([
            'order_id' => $order->id,
            'user_id' => auth()->id(),
            'order_number' => $order->order_number,
            'reason' => $validated['reason'],
            'items' => $validated['items'] ?? $order->items->toArray(),
            'images' => $imageUrls,
            'customer_notes' => $validated['customer_notes'] ?? null,
            'status' => 'pending',
            'refund_payment_method' => $order->payment_method,
            'refund_account_details' => $validated['refund_account_details'] ?? null,
        ]);

        $order->return_status = 'requested';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Return request submitted successfully. Our team will review your proof photos within 24 hours.',
            'return_request' => $returnRequest
        ], 201);
    }

    /**
     * Customer view return request for their order.
     */
    public function customerShow(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $returnRequest = ReturnRequest::where('order_id', $order->id)->latest()->first();

        return response()->json([
            'order' => $order,
            'return_request' => $returnRequest
        ]);
    }

    /**
     * Admin: List all return requests.
     */
    public function adminIndex(Request $request)
    {
        $query = ReturnRequest::with(['order', 'user'])->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('reason') && $request->reason !== 'all') {
            $query->where('reason', $request->reason);
        }

        if ($request->filled('search')) {
            $s = trim($request->search);
            $query->where(function ($q) use ($s) {
                $q->where('order_number', 'like', "%{$s}%")
                  ->orWhereHas('user', function ($uq) use ($s) {
                      $uq->where('name', 'like', "%{$s}%")
                         ->orWhere('email', 'like', "%{$s}%");
                  });
            });
        }

        $returns = $query->paginate($request->input('per_page', 20));

        return response()->json($returns);
    }

    /**
     * Admin: Approve return request.
     */
    public function adminApprove(Request $request, ReturnRequest $returnRequest)
    {
        $returnRequest->update([
            'status' => 'approved',
            'admin_notes' => $request->input('admin_notes', $returnRequest->admin_notes),
        ]);

        $returnRequest->order->update([
            'return_status' => 'approved'
        ]);

        // Send official email with Dadar warehouse address
        try {
            $customerEmail = $returnRequest->user->email ?? $returnRequest->order->shipping_phone;
            if (filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                Mail::to($customerEmail)->send(new ReturnApprovedMail($returnRequest));
            }
        } catch (\Exception $e) {
            \Log::warning("ReturnApprovedMail failed: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Return request approved and official instructions email sent to customer.',
            'return_request' => $returnRequest->fresh(['order', 'user'])
        ]);
    }

    /**
     * Admin: Reject return request with reason.
     */
    public function adminReject(Request $request, ReturnRequest $returnRequest)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $returnRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'admin_notes' => $validated['admin_notes'] ?? null,
        ]);

        $returnRequest->order->update([
            'return_status' => 'rejected'
        ]);

        // Send official rejection email
        try {
            $customerEmail = $returnRequest->user->email ?? null;
            if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                Mail::to($customerEmail)->send(new ReturnRejectedMail($returnRequest));
            }
        } catch (\Exception $e) {
            \Log::warning("ReturnRejectedMail failed: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Return request rejected and notification email sent to customer.',
            'return_request' => $returnRequest->fresh(['order', 'user'])
        ]);
    }

    /**
     * Admin: Resolve return via Refund (COD UPI/Bank transfer or Online Gateway).
     */
    public function adminRefund(Request $request, ReturnRequest $returnRequest)
    {
        $validated = $request->validate([
            'refund_amount' => 'required|numeric|min:1',
            'refund_transaction_id' => 'required|string|max:100',
            'refund_payment_method' => 'required|in:cod,online,razorpay',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $returnRequest->update([
            'status' => 'refunded',
            'resolution_type' => 'refund',
            'refund_amount' => $validated['refund_amount'],
            'refund_transaction_id' => $validated['refund_transaction_id'],
            'refund_payment_method' => $validated['refund_payment_method'],
            'admin_notes' => $validated['admin_notes'] ?? $returnRequest->admin_notes,
        ]);

        $returnRequest->order->update([
            'return_status' => 'refunded',
            'payment_status' => 'refunded',
        ]);

        // Send official refund confirmation email
        try {
            $customerEmail = $returnRequest->user->email ?? null;
            if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                Mail::to($customerEmail)->send(new ReturnRefundedMail($returnRequest));
            }
        } catch (\Exception $e) {
            \Log::warning("ReturnRefundedMail failed: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => "Refund of ₹{$validated['refund_amount']} recorded and customer notified.",
            'return_request' => $returnRequest->fresh(['order', 'user'])
        ]);
    }

    /**
     * Admin: Resolve return via Replacement Dispatch.
     */
    public function adminReplacement(Request $request, ReturnRequest $returnRequest)
    {
        $validated = $request->validate([
            'replacement_tracking_number' => 'required|string|max:100',
            'replacement_courier_name' => 'nullable|string|max:100',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $returnRequest->update([
            'status' => 'replacement_dispatched',
            'resolution_type' => 'replacement',
            'replacement_tracking_number' => $validated['replacement_tracking_number'],
            'replacement_courier_name' => $validated['replacement_courier_name'] ?? 'Express Surface Courier',
            'admin_notes' => $validated['admin_notes'] ?? $returnRequest->admin_notes,
        ]);

        $returnRequest->order->update([
            'return_status' => 'replacement_dispatched'
        ]);

        // Send official replacement dispatch email
        try {
            $customerEmail = $returnRequest->user->email ?? null;
            if ($customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                Mail::to($customerEmail)->send(new ReturnReplacementMail($returnRequest));
            }
        } catch (\Exception $e) {
            \Log::warning("ReturnReplacementMail failed: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Replacement dispatch recorded and customer notified with tracking details.',
            'return_request' => $returnRequest->fresh(['order', 'user'])
        ]);
    }
}
