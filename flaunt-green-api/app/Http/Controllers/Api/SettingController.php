<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    // Get all settings as key-value pairs (public)
    public function index()
    {
        $settings = Cache::rememberForever('store_settings', function () {
            return Setting::pluck('value', 'key')->toArray();
        });

        return response()->json($settings);
    }

    // Update settings (admin only)
    public function update(Request $request)
    {
        $data = $request->all();
        
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        Cache::forget('store_settings');

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
