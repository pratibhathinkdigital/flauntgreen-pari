<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request)
    {
        $query = User::where('role', '!=', 'admin')
            ->withCount('orders')
            ->withSum('orders', 'total');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->get();

        return response()->json($users);
    }

    /**
     * Display the specified customer details.
     */
    public function show($id)
    {
        $user = User::with(['addresses', 'orders' => function ($q) {
            $q->latest()->take(5);
        }])
        ->withCount('orders')
        ->withSum('orders', 'total')
        ->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Update customer details (Admin).
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'role'  => 'sometimes|required|in:customer,admin',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Customer profile updated successfully.',
            'user'    => $user->fresh(),
        ]);
    }

    /**
     * Delete a customer.
     */
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting an admin or self
        if ($user->role === 'admin' || $user->id === $request->user()?->id) {
            return response()->json([
                'success' => false,
                'message' => 'Admin accounts cannot be deleted.'
            ], 403);
        }

        $userName = $user->name;
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => "Customer '{$userName}' deleted successfully."
        ]);
    }
}
