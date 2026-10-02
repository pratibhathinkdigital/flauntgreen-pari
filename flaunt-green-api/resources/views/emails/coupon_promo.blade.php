<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exclusive Promo Code - Flaunt Green</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 30px 15px; color: #141b28; }
        .wrapper { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8e1; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: #41542f; padding: 32px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
        .header h1 span { color: #d4b572; }
        .header p { margin: 8px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 36px 28px; text-align: center; }
        .greeting { font-size: 18px; font-weight: 600; color: #141b28; margin-bottom: 12px; }
        .intro { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
        .coupon-card { background: #FAF8F5; border: 2px dashed #997b47; border-radius: 14px; padding: 24px; margin: 20px 0; text-align: center; }
        .coupon-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #997b47; margin-bottom: 8px; }
        .coupon-code { display: inline-block; background: #ffffff; border: 1px solid #e2d9cd; padding: 10px 24px; font-size: 26px; font-family: monospace; font-weight: 800; letter-spacing: 4px; color: #41542f; border-radius: 8px; }
        .discount-highlight { font-size: 20px; font-weight: 700; color: #41542f; margin-top: 14px; }
        .terms { font-size: 12px; color: #6b7280; margin-top: 12px; line-height: 1.5; }
        .cta-btn { display: inline-block; background: #41542f; color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; margin-top: 24px; box-shadow: 0 4px 12px rgba(65, 84, 47, 0.25); }
        .custom-note { background: #f8fafc; border-left: 3px solid #41542f; padding: 12px 16px; text-align: left; font-size: 13px; color: #475569; margin: 20px 0; border-radius: 0 8px 8px 0; }
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
                We have crafted an exclusive gift just for you! Use the promo code below on your next purchase to enjoy special savings on our eco-friendly collections.
            </p>

            @if(!empty($customMessage))
            <div class="custom-note">
                <strong>A note for you:</strong><br>
                {{ $customMessage }}
            </div>
            @endif

            <div class="coupon-card">
                <div class="coupon-label">Your Exclusive Coupon Code</div>
                <div class="coupon-code">{{ $coupon->code }}</div>
                <div class="discount-highlight">
                    @if($coupon->type === 'percent')
                        Get {{ (int)$coupon->value }}% OFF
                    @else
                        Get ₹{{ number_format($coupon->value, 0) }} OFF
                    @endif
                </div>

                <div class="terms">
                    @if($coupon->min_spend > 0)
                        <span>• Valid on orders above ₹{{ number_format($coupon->min_spend, 0) }}</span><br>
                    @endif
                    @if($coupon->expires_at)
                        <span>• Valid till {{ \Carbon\Carbon::parse($coupon->expires_at)->format('d M, Y') }}</span>
                    @else
                        <span>• Limited time offer</span>
                    @endif
                </div>
            </div>

            <a href="http://localhost:3000/collections" class="cta-btn">
                Shop Now &amp; Apply Code
            </a>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Flaunt Green. Handcrafted sustainably.<br>
            If you have any questions, write to us at support@flauntgreen.in
        </div>
    </div>
</body>
</html>
