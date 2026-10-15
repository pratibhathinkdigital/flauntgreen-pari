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
