<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    /**
     * Get reviews for a product.
     * Rule: Approved reviews are visible to everyone.
     * The author always sees their own review (pending or approved) as long as not deleted.
     */
    public function index(Request $request)
    {
        $slug = $request->query('product_slug');
        $user = auth('sanctum')->user();
        $userId = $user?->id ?: $request->query('user_id');
        $userEmail = $user?->email ?: $request->query('email');

        $query = Review::query()->orderBy('created_at', 'desc');

        if ($slug) {
            $query->where('product_slug', $slug);
        }

        // Visibility Rule: Show approved reviews OR reviews submitted by this specific user
        $query->where(function ($q) use ($userId, $userEmail) {
            $q->where('status', 'approved');
            if ($userId) {
                $q->orWhere('user_id', $userId);
            }
            if ($userEmail) {
                $q->orWhere('email', $userEmail);
            }
        });

        $reviews = $query->get()->map(function ($rev) use ($userId, $userEmail) {
            $isOwn = false;
            if ($userId && $rev->user_id == $userId) {
                $isOwn = true;
            } elseif ($userEmail && strtolower($rev->email ?? '') === strtolower($userEmail)) {
                $isOwn = true;
            }
            $rev->is_own_review = $isOwn;
            return $rev;
        });

        // Compute stats for approved reviews (and count)
        $approvedReviews = $reviews->where('status', 'approved');
        $count = $approvedReviews->count();
        $sum = $approvedReviews->sum('rating');
        $avg = $count > 0 ? round($sum / $count, 1) : 0;

        $distribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
        foreach ($approvedReviews as $rev) {
            $r = max(1, min(5, (int)$rev->rating));
            $distribution[$r]++;
        }

        return response()->json([
            'reviews'      => $reviews->values(),
            'stats'        => [
                'count'        => $count,
                'avg'          => $avg,
                'distribution' => $distribution,
            ],
        ]);
    }

    /**
     * Submit a new review (with strict image validation, verified buyer check, and authentication).
     */
    public function store(Request $request)
    {
        $user = $request->user() ?: auth('sanctum')->user();
        if (!$user) {
            return response()->json([
                'message' => 'Authentication required. Please sign in to submit a review.',
            ], 401);
        }

        $rules = [
            'rating'       => 'required|integer|between:1,5',
            'title'        => 'nullable|string|max:255',
            'body'         => 'required|string|max:4000',
            'product_slug' => 'required|string|max:255',
            'product_name' => 'nullable|string|max:255',
            'product_id'   => 'nullable|integer',
            'name'         => 'nullable|string|max:255',
        ];

        if ($request->hasFile('images')) {
            $rules['images']   = 'nullable|array|max:5';
            $rules['images.*'] = 'file|mimes:jpeg,jpg,png,webp|max:5120';
        } else {
            $rules['images']   = 'nullable|array|max:5';
            $rules['images.*'] = 'string';
        }

        $validated = $request->validate($rules);

        $userId = $user->id;
        $name = !empty($validated['name']) ? trim($validated['name']) : ($user->name ?: 'Anonymous');
        $email = $user->email; // Enforce authenticated account email

        // Prevent duplicate reviews for the same product by the same user
        $alreadyReviewed = Review::where('user_id', $userId)
            ->where('product_slug', $validated['product_slug'])
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'success' => false,
                'message' => 'You have already submitted a review for this product.',
            ], 422);
        }

        $productId = $validated['product_id'] ?? null;
        $productName = $validated['product_name'] ?? null;

        if (!$productId || !$productName) {
            $product = Product::where('slug', $validated['product_slug'])->first();
            if ($product) {
                $productId = $productId ?: $product->id;
                $productName = $productName ?: $product->name;
            }
        }

        // Check if user is a verified buyer of this product
        $isVerified = OrderItem::whereHas('order', function ($q) use ($userId) {
            $q->where('user_id', $userId)
              ->where(function ($sub) {
                  $sub->where('payment_status', 'paid')
                      ->orWhereIn('status', ['delivered', 'shipped', 'completed', 'processing']);
              });
        })->where(function ($q) use ($productId, $productName, $validated) {
            if ($productId) {
                $q->where('product_id', $productId);
            }
            if ($productName) {
                $q->orWhere('name', 'like', '%' . $productName . '%');
            }
            $q->orWhere('name', 'like', '%' . $validated['product_slug'] . '%');
        })->exists();

        // ── Process review images (Production-grade security & validation) ────
        $savedImages = [];
        if (!Storage::disk('public')->exists('reviews')) {
            Storage::disk('public')->makeDirectory('reviews');
        }

        // 1. If multipart file uploads
        if ($request->hasFile('images')) {
            foreach (array_slice($request->file('images'), 0, 4) as $file) {
                if ($file->isValid()) {
                    $path = $file->store('reviews', 'public');
                    $savedImages[] = '/storage/' . $path;
                }
            }
        }
        // 2. If Base64 Data URLs (Strict magic-bytes & GD verification)
        elseif (!empty($validated['images']) && is_array($validated['images'])) {
            $finfo = new \finfo(FILEINFO_MIME_TYPE);
            $allowedMimes = [
                'image/jpeg' => 'jpg',
                'image/png'  => 'png',
                'image/webp' => 'webp',
            ];

            foreach (array_slice($validated['images'], 0, 4) as $imgStr) {
                if (!is_string($imgStr)) {
                    continue;
                }

                if (preg_match('/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/is', $imgStr, $matches)) {
                    $decoded = base64_decode($matches[2], true);
                    if ($decoded === false) {
                        return response()->json([
                            'message' => 'Invalid image encoding for uploaded review photo.',
                        ], 422);
                    }

                    // Max 5MB size limit (5 * 1024 * 1024 = 5,242,880 bytes)
                    if (strlen($decoded) > 5242880) {
                        return response()->json([
                            'message' => 'Review photos must be less than 5MB each.',
                        ], 422);
                    }

                    // Strict MIME type detection via file magic bytes
                    $detectedMime = $finfo->buffer($decoded);
                    if (!isset($allowedMimes[$detectedMime])) {
                        return response()->json([
                            'message' => 'Uploaded photo file type is not allowed. Only JPG, PNG, and WebP are supported.',
                        ], 422);
                    }

                    // Verify image integrity with GD
                    $imgSize = @getimagesizefromstring($decoded);
                    if ($imgSize === false) {
                        return response()->json([
                            'message' => 'Uploaded file is corrupted or not a valid image.',
                        ], 422);
                    }

                    $extension = $allowedMimes[$detectedMime];
                    $filename = 'reviews/rev_' . Str::random(24) . '_' . time() . '.' . $extension;
                    Storage::disk('public')->put($filename, $decoded);
                    $savedImages[] = '/storage/' . $filename;
                } else {
                    // Block arbitrary URLs or raw strings
                    return response()->json([
                        'message' => 'Invalid image format. Direct URL links are not allowed; please upload real image files.',
                    ], 422);
                }
            }
        }

        $review = Review::create([
            'user_id'      => $userId,
            'product_id'   => $productId,
            'product_slug' => $validated['product_slug'],
            'product_name' => $productName ?: $validated['product_slug'],
            'name'         => $name,
            'email'        => $email,
            'rating'       => $validated['rating'],
            'title'        => $validated['title'] ?? null,
            'body'         => $validated['body'],
            'images'       => $savedImages,
            'status'       => 'pending',
            'is_verified'  => $isVerified,
            'likes_count'  => 0,
        ]);

        $review->is_own_review = true;

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully! It is visible to you immediately and will appear publicly once approved by moderation.',
            'review'  => $review,
        ], 201);
    }

    /**
     * Mark review as helpful (thumbs up).
     */
    public function helpful($id)
    {
        $review = Review::findOrFail($id);
        $review->increment('likes_count');

        return response()->json([
            'success' => true,
            'likes_count' => $review->likes_count,
        ]);
    }

    /**
     * Admin: Get all reviews with status counts.
     */
    public function adminIndex(Request $request)
    {
        $status = $request->query('status');
        $query = Review::with('user')->orderBy('created_at', 'desc');

        if ($status && in_array($status, ['pending', 'approved', 'hidden'])) {
            $query->where('status', $status);
        }

        $reviews = $query->get();

        $totalAll = Review::count();
        $totalApproved = Review::where('status', 'approved')->count();
        $totalPending = Review::where('status', 'pending')->count();
        $totalHidden = Review::where('status', 'hidden')->count();

        return response()->json([
            'reviews' => $reviews,
            'counts'  => [
                'total'    => $totalAll,
                'approved' => $totalApproved,
                'pending'  => $totalPending,
                'hidden'   => $totalHidden,
            ],
        ]);
    }

    /**
     * Admin: Update review status (approve/hide).
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,hidden',
        ]);

        $review = Review::findOrFail($id);
        $review->status = $validated['status'];
        $review->save();

        return response()->json([
            'success' => true,
            'message' => 'Review status updated to ' . $validated['status'],
            'review'  => $review,
        ]);
    }

    /**
     * Admin: Delete review.
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        
        // Remove stored images if exist
        if (!empty($review->images) && is_array($review->images)) {
            foreach ($review->images as $img) {
                if (Str::startsWith($img, '/storage/reviews/')) {
                    $path = str_replace('/storage/', '', $img);
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully',
        ]);
    }
}
