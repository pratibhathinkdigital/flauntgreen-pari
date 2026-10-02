<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Get active testimonials for public pages.
     * Query param: ?page=home or ?page=dog_togs
     */
    public function index(Request $request)
    {
        $page = $request->query('page');
        $query = Testimonial::where('is_active', true)->orderBy('sort_order')->orderBy('created_at', 'desc');

        if ($page && in_array($page, ['home', 'dog_togs'])) {
            $query->whereIn('page', [$page, 'both']);
        }

        $testimonials = $query->get();
        return response()->json($testimonials);
    }

    /**
     * Admin: Get all testimonials with filtering, search, and page counts.
     */
    public function adminIndex(Request $request)
    {
        $page = $request->query('page');
        $status = $request->query('status');
        $search = $request->query('search');

        $query = Testimonial::orderBy('sort_order')->orderBy('created_at', 'desc');

        if ($page && $page !== 'all' && in_array($page, ['home', 'dog_togs', 'both'])) {
            $query->where('page', $page);
        }

        if ($status !== null && $status !== 'all') {
            $isActive = filter_var($status, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('quote', 'like', "%{$search}%");
            });
        }

        $testimonials = $query->get();

        $totalCount = Testimonial::count();
        $homeCount = Testimonial::whereIn('page', ['home', 'both'])->count();
        $dogTogsCount = Testimonial::whereIn('page', ['dog_togs', 'both'])->count();

        return response()->json([
            'testimonials' => $testimonials,
            'counts' => [
                'total'    => $totalCount,
                'home'     => $homeCount,
                'dog_togs' => $dogTogsCount,
            ]
        ]);
    }

    /**
     * Admin: Create a new testimonial.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'city'       => 'nullable|string|max:255',
            'quote'      => 'required|string|max:2000',
            'rating'     => 'required|integer|between:1,5',
            'page'       => 'required|in:home,dog_togs,both',
            'is_active'  => 'boolean',
            'sort_order' => 'nullable|integer',
            'avatar'     => 'nullable|string',
        ]);

        $testimonial = Testimonial::create([
            'name'       => $validated['name'],
            'city'       => $validated['city'] ?? null,
            'quote'      => $validated['quote'],
            'rating'     => $validated['rating'],
            'page'       => $validated['page'],
            'is_active'  => $validated['is_active'] ?? true,
            'sort_order' => $validated['sort_order'] ?? 0,
            'avatar'     => $validated['avatar'] ?? null,
        ]);

        return response()->json([
            'success'     => true,
            'message'     => 'Testimonial created successfully',
            'testimonial' => $testimonial,
        ], 201);
    }

    /**
     * Admin: Update an existing testimonial.
     */
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'city'       => 'nullable|string|max:255',
            'quote'      => 'required|string|max:2000',
            'rating'     => 'required|integer|between:1,5',
            'page'       => 'required|in:home,dog_togs,both',
            'is_active'  => 'boolean',
            'sort_order' => 'nullable|integer',
            'avatar'     => 'nullable|string',
        ]);

        $testimonial->update($validated);

        return response()->json([
            'success'     => true,
            'message'     => 'Testimonial updated successfully',
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Admin: Toggle active status.
     */
    public function toggleActive($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->is_active = !$testimonial->is_active;
        $testimonial->save();

        return response()->json([
            'success'     => true,
            'message'     => 'Status updated successfully',
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Admin: Delete testimonial.
     */
    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimonial deleted successfully',
        ]);
    }
}
