<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\JournalController as ApiJournalController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SeoController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Middleware\IsAdmin;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth Routes — rate-limited to prevent brute force
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/auth/resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/auth/google', [AuthController::class, 'googleRedirect']);
});

// Public Contact Form — rate-limited (3 per minute)
Route::middleware('throttle:3,1')->post('/contact', [ContactController::class, 'send']);

// Public SEO & Settings
Route::get('/seo', [SeoController::class, 'getSeoData']);
Route::get('/settings', [SettingController::class, 'index']);

// Public Product/Category/Collection Routes
Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
Route::get('/categories/{slug}', [\App\Http\Controllers\Api\CategoryController::class, 'show']);

Route::get('/collections', [\App\Http\Controllers\Api\CollectionController::class, 'index']);
Route::get('/collections/{slug}', [\App\Http\Controllers\Api\CollectionController::class, 'show']);

Route::get('/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/products/{slug}', [\App\Http\Controllers\Api\ProductController::class, 'show']);

// Public Journal Routes
Route::get('/journals', [ApiJournalController::class, 'index']);
Route::get('/journals/{slug}', [ApiJournalController::class, 'show']);

// Public Coupon Validation
Route::middleware('throttle:5,1')->post('/coupons/validate', [\App\Http\Controllers\Api\CouponController::class, 'validateCoupon']);

// Public Reviews Routes
Route::get('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'index']);
Route::post('/reviews/{id}/helpful', [\App\Http\Controllers\Api\ReviewController::class, 'helpful']);

// Public Testimonials Route
Route::get('/testimonials', [\App\Http\Controllers\Api\TestimonialController::class, 'index']);

// Razorpay Webhook (Called directly by Razorpay servers)
Route::post('/payments/webhook', [\App\Http\Controllers\Api\PaymentController::class, 'webhook']);

// Protected Routes (Require Authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Profile
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/change-password', [UserController::class, 'changePassword']);

    // User Addresses
    Route::get('/user/addresses', [AddressController::class, 'index']);
    Route::post('/user/addresses', [AddressController::class, 'store']);
    Route::put('/user/addresses/{address}', [AddressController::class, 'update']);
    Route::delete('/user/addresses/{address}', [AddressController::class, 'destroy']);

    // User Orders
    Route::get('/orders/my-orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{order}/cancel', [OrderController::class, 'cancel']);

    // Return Requests (Customer)
    Route::post('/orders/{order}/return-request', [\App\Http\Controllers\Api\ReturnRequestController::class, 'customerStore']);
    Route::get('/orders/{order}/return-request', [\App\Http\Controllers\Api\ReturnRequestController::class, 'customerShow']);
    
    // Payments (Razorpay)
    Route::post('/payments/create-intent', [\App\Http\Controllers\Api\PaymentController::class, 'createIntent']);
    Route::post('/payments/verify', [\App\Http\Controllers\Api\PaymentController::class, 'verifyPayment']);
    
    // Customer Reviews (Authenticated)
    Route::post('/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);
    
    // Admin Routes
    Route::middleware([IsAdmin::class])->group(function () {
        // Settings
        Route::put('/admin/settings', [SettingController::class, 'update']);

        // Dashboard Stats
        Route::get('/admin/stats', [\App\Http\Controllers\Admin\DashboardController::class, 'stats']);

        // Orders
        Route::get('/orders', [OrderController::class, 'adminIndex']);
        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

        // Returns & Refunds (Admin)
        Route::get('/admin/returns', [\App\Http\Controllers\Api\ReturnRequestController::class, 'adminIndex']);
        Route::post('/admin/returns/{returnRequest}/approve', [\App\Http\Controllers\Api\ReturnRequestController::class, 'adminApprove']);
        Route::post('/admin/returns/{returnRequest}/reject', [\App\Http\Controllers\Api\ReturnRequestController::class, 'adminReject']);
        Route::post('/admin/returns/{returnRequest}/refund', [\App\Http\Controllers\Api\ReturnRequestController::class, 'adminRefund']);
        Route::post('/admin/returns/{returnRequest}/replacement', [\App\Http\Controllers\Api\ReturnRequestController::class, 'adminReplacement']);
        
        // Categories
        Route::apiResource('/admin/categories', \App\Http\Controllers\Admin\CategoryController::class);
        
        // Collections
        Route::apiResource('/admin/collections', \App\Http\Controllers\Admin\CollectionController::class);
        
        // Products
        Route::apiResource('/admin/products', \App\Http\Controllers\Admin\ProductController::class);
        Route::patch('/admin/products/{product}/toggle-status', [\App\Http\Controllers\Admin\ProductController::class, 'toggleStatus']);
        Route::patch('/admin/products/{product}/toggle-featured', [\App\Http\Controllers\Admin\ProductController::class, 'toggleFeatured']);
        
        // Journal
        Route::apiResource('/admin/journals', \App\Http\Controllers\Admin\JournalController::class);
        
        // Enquiries
        Route::apiResource('/admin/enquiries', \App\Http\Controllers\Admin\ContactMessageController::class)->only(['index', 'show', 'update', 'destroy']);
        
        // Customers / Users
        Route::get('/admin/users', [\App\Http\Controllers\Admin\UserController::class, 'index']);
        Route::get('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show']);
        Route::put('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update']);
        Route::delete('/admin/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy']);

        // Coupons / Marketing
        Route::apiResource('/admin/coupons', \App\Http\Controllers\Api\CouponController::class);
        Route::post('/admin/coupons/{coupon}/send-email', [\App\Http\Controllers\Api\CouponController::class, 'sendEmail']);

        // Reviews Moderation (Admin)
        Route::get('/admin/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'adminIndex']);
        Route::patch('/admin/reviews/{id}/status', [\App\Http\Controllers\Api\ReviewController::class, 'updateStatus']);
        Route::delete('/admin/reviews/{id}', [\App\Http\Controllers\Api\ReviewController::class, 'destroy']);

        // Testimonials (Admin)
        Route::get('/admin/testimonials', [\App\Http\Controllers\Api\TestimonialController::class, 'adminIndex']);
        Route::post('/admin/testimonials', [\App\Http\Controllers\Api\TestimonialController::class, 'store']);
        Route::put('/admin/testimonials/{id}', [\App\Http\Controllers\Api\TestimonialController::class, 'update']);
        Route::patch('/admin/testimonials/{id}/toggle-active', [\App\Http\Controllers\Api\TestimonialController::class, 'toggleActive']);
        Route::delete('/admin/testimonials/{id}', [\App\Http\Controllers\Api\TestimonialController::class, 'destroy']);
        // SEO Management (Admin)
        Route::apiResource('/admin/seo', \App\Http\Controllers\Admin\SeoController::class)->except(['show']);
    });
});
