<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Replacement Dispatched - Flaunt Green</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 30px 15px; color: #141b28; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8e1; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: #41542f; padding: 32px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
        .header h1 span { color: #d4b572; }
        .header p { margin: 8px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 36px 30px; text-align: left; }
        .badge { display: inline-block; background: #ecfdf5; color: #047857; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .title { font-size: 20px; font-weight: 700; color: #141b28; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 20px; }
        .shipping-card { background: #FAF8F5; border: 1.5px solid #d4cbbd; border-radius: 14px; padding: 22px; margin: 24px 0; }
        .shipping-card h4 { margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #41542f; }
        .row { display: flex; justify-content: space-between; font-size: 13px; color: #4b5563; padding: 6px 0; }
        .footer { background: #FAF8F5; padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f1f5f9; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Flaunt<span>Green</span></h1>
            <p>Conscious Sustainable Fashion</p>
        </div>
        <div class="body">
            <span class="badge">Replacement Dispatched</span>
            <div class="title">Hello {{ $returnRequest->order->shipping_name ?? 'Valued Customer' }},</div>
            <p class="text">
                Great news! We have inspected your returned item for <strong>Order #{{ $returnRequest->order_number }}</strong>, and your replacement piece has been prepared with care and dispatched at no additional charge.
            </p>

            <div class="shipping-card">
                <h4>Dispatch &amp; Tracking Information</h4>
                <div class="row">
                    <span>Courier Partner:</span>
                    <strong>{{ $returnRequest->replacement_courier_name ?? 'Express Surface Courier' }}</strong>
                </div>
                <div class="row">
                    <span>Tracking Number / AWB:</span>
                    <strong style="font-family: monospace; font-size: 14px; color: #41542f;">{{ $returnRequest->replacement_tracking_number ?? 'In Transit' }}</strong>
                </div>
                <div class="row">
                    <span>Estimated Delivery:</span>
                    <strong>3 to 5 Business Days</strong>
                </div>
            </div>

            <p class="text">
                Thank you for your patience and for helping us maintain sustainable small-batch crafting standards. Enjoy your Flaunt Green piece! 🌿
            </p>
        </div>
        <div class="footer">
            Flaunt Green &bull; Mumbai, Maharashtra<br>
            Track your order or reach out at <a href="mailto:support@flauntgreen.in" style="color: #41542f; text-decoration: none; font-weight: 600;">support@flauntgreen.in</a>
        </div>
    </div>
</body>
</html>
