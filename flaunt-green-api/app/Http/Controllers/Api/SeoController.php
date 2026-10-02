<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SeoController extends Controller
{
    /**
     * Public API: Get SEO data for a specific route.
     * Used by the Next.js frontend to inject <head> meta tags.
     */
    public function getSeoData(Request $request)
    {
        $route = $request->query('route', '/');

        $seoData = Cache::remember('seo_route_' . md5($route), 60 * 24, function () use ($route) {
            return Seo::where('route', $route)->first();
        });

        if (!$seoData) {
            return response()->json([
                'title'       => 'Flaunt Green | Sustainable & Slow Fashion',
                'description' => 'Discover handcrafted, sustainable fashion from Flaunt Green. Small-batch, eco-conscious clothing for her, him, and beyond.',
                'keywords'    => null,
                'og_image'    => null,
            ]);
        }

        return response()->json($seoData);
    }
}
