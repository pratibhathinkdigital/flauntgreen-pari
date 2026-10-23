<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// Direct storage image handler — checks both public/storage and storage/app/public
Route::get('/storage/{path}', function ($path) {
    $filePath = public_path('storage/' . $path);
    if (!file_exists($filePath)) {
        $filePath = storage_path('app/public/' . $path);
    }
    if (!file_exists($filePath)) {
        abort(404, 'File not found: ' . $path);
    }
    $mime = mime_content_type($filePath) ?: 'image/jpeg';
    return response()->file($filePath, [
        'Access-Control-Allow-Origin' => '*',
        'Content-Type' => $mime,
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');

// Helper route to create storage:link directly from browser
Route::get('/storage-link', function () {
    try {
        Artisan::call('storage:link');
        return 'Storage link created successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Helper route to clear cache on Hostinger
Route::get('/clear-cache', function () {
    try {
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('route:clear');
        return 'Config, cache and routes cleared successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

// Helper route to test email sending directly from browser
Route::get('/test-email', function () {
    try {
        $to = request('to', config('mail.mailers.smtp.username', 'pratibhathinkdigital@gmail.com'));
        \Illuminate\Support\Facades\Mail::raw('Test Flaunt Green Mail on Hostinger Server', function ($m) use ($to) {
            $m->to($to)
              ->subject('Test SMTP from Hostinger');
        });
        return 'Email sent successfully to ' . $to . ' via ' . config('mail.mailers.smtp.host') . ':' . config('mail.mailers.smtp.port') . '!';
    } catch (\Exception $e) {
        return 'SMTP Error: ' . $e->getMessage();
    }
});

// Helper route to test Razorpay configuration on Hostinger
Route::get('/test-razorpay', function () {
    $key = config('services.razorpay.key') ?: env('RAZORPAY_KEY') ?: 'rzp_test_TZnxa9wE9HqL4W';
    $secret = config('services.razorpay.secret') ?: env('RAZORPAY_SECRET') ?: 'xYEOMkMZmXNanLnE7UBEoIQo';

    if (!$key || !$secret) {
        return response()->json(['configured' => false, 'error' => 'Razorpay keys missing from config/services.php and .env']);
    }

    try {
        $api = new \Razorpay\Api\Api($key, $secret);
        $order = $api->order->create([
            'receipt'  => 'test_' . uniqid(),
            'amount'   => 100, // ₹1
            'currency' => 'INR',
        ]);
        return response()->json([
            'configured'       => true,
            'test_order_id'    => $order['id'],
            'key_used'         => substr($key, 0, 8) . '...',
            'message'          => 'Razorpay connection working successfully!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'configured' => true,
            'key_used'   => substr($key, 0, 8) . '...',
            'error'      => $e->getMessage(),
        ], 500);
    }
});
