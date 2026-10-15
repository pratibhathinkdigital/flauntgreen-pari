<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exclusive Promo Codes - Flaunt Green</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 30px 15px; color: #141b28; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8e1; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: #41542f; padding: 32px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
        .header h1 span { color: #d4b572; }
        .header p { margin: 8px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 36px 28px; text-align: center; }
        .greeting { font-size: 18px; font-weight: 600; color: #141b28; margin-bottom: 12px; }
        .intro { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
        .custom-note { background: #f8fafc; border-left: 3px solid #41542f; padding: 12px 16px; text-align: left; font-size: 13px; color: #475569; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .coupon-list { margin: 24px 0; text-align: left; }
        .coupon-card { background: #FAF8F5; border: 2px dashed #997b47; border-radius: 14px; padding: 20px; margin-bottom: 16px; position: relative; }
        .coupon-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
        .coupon-code { display: inline-block; background: #ffffff; border: 1px solid #e2d9cd; padding: 8px 18px; font-size: 20px; font-family: monospace; font-weight: 800; letter-spacing: 2px; color: #41542f; border-radius: 8px; }
        .discount-badge { display: inline-block; background: #41542f; color: #ffffff; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 50px; }
        .coupon-desc { font-size: 13px; color: #4b5563; margin: 10px 0 6px; font-weight: 500; }
        .coupon-terms { font-size: 11px; color: #6b7280; line-height: 1.4; }
        .stack-notice { background: #eef5e9; border: 1px solid #c7dec1; border-radius: 10px; padding: 12px 16px; font-size: 12px; color: #344d28; margin: 20px 0; text-align: center; font-weight: 500; }
        .cta-btn { display: inline-block; background: #41542f; color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; margin-top: 16px; box-shadow: 0 4px 12px rgba(65, 84, 47, 0.25); }
        .footer { background: #FAF8F5; padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Flaunt<span>Green</span></h1>
            <p>Conscious Sustainable Fashion</p>
        </div>
        <div class="body">
            <div class="greeting">Hello {{ $customerName }},</div>
            <p class="intro">
                We have curated exclusive discount offers especially for you! You can apply these promo codes during checkout on our store.
            </p>

            @if(!empty($customMessage))
            <div class="custom-note">
                <strong>A note from Flaunt Green:</strong><br>
                {{ $customMessage }}
            </div>
            @endif

            <div class="coupon-list">
                @foreach($coupons as $coupon)
                <div class="coupon-card">
                    <div class="coupon-header">
                        <span class="coupon-code">{{ $coupon->code }}</span>
                        <span class="discount-badge">
                            @if($coupon->type === 'percent')
                                {{ (int)$coupon->value }}% OFF
                            @else
                                ₹{{ number_format($coupon->value, 0) }} OFF
                            @endif
                        </span>
                    </div>

                    @if(!empty($coupon->description))
                    <div class="coupon-desc">{{ $coupon->description }}</div>
                    @endif

                    <div class="coupon-terms">
                        @if($coupon->min_spend > 0)
                            <span>• Min order ₹{{ number_format($coupon->min_spend, 0) }}</span>
                        @endif
                        @if($coupon->max_discount > 0)
                            <span> • Max discount ₹{{ number_format($coupon->max_discount, 0) }}</span>
                        @endif
                        @if($coupon->expires_at)
                            <span> • Valid till {{ \Carbon\Carbon::parse($coupon->expires_at)->format('d M, Y') }}</span>
                        @else
                            <span> • Limited time offer</span>
                        @endif
                    </div>
                </div>
                @endforeach
            </div>

            <div class="stack-notice">
                🎉 <strong>Stackable Coupons:</strong> You can apply multiple valid promo codes at checkout for maximum savings!
            </div>

            @php
                $storeUrl = config('app.frontend_url', env('FRONTEND_URL', 'https://paleturquoise-narwhal-513309.hostingersite.com')) . '/shop';
            @endphp

            <a href="{{ $storeUrl }}" class="cta-btn">
                Shop Now &amp; Apply Codes
            </a>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Flaunt Green. Handcrafted sustainably.<br>
            Have questions? Contact us at support@flauntgreen.in
        </div>
    </div>
</body>
</html>
