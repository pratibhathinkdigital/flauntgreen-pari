<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages/enquiries.
     */
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        if ($request->has('is_read') && $request->is_read !== '' && $request->is_read !== null) {
            $isRead = filter_var($request->is_read, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($isRead !== null) {
                $query->where('is_read', $isRead);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $enquiries = $query->latest()->get();

        return response()->json($enquiries);
    }

    /**
     * Display the specified contact message/enquiry.
     */
    public function show($id)
    {
        $enquiry = ContactMessage::findOrFail($id);
        return response()->json($enquiry);
    }

    /**
     * Update the specified contact message (e.g. toggle is_read).
     */
    public function update(Request $request, $id)
    {
        $enquiry = ContactMessage::findOrFail($id);

        $validated = $request->validate([
            'is_read' => 'required|boolean',
        ]);

        $enquiry->update($validated);

        return response()->json($enquiry);
    }

    /**
     * Remove the specified contact message.
     */
    public function destroy($id)
    {
        $enquiry = ContactMessage::findOrFail($id);
        $enquiry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Enquiry deleted successfully.'
        ]);
    }
}
