<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return Request Update - Flaunt Green</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 30px 15px; color: #141b28; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8e1; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: #41542f; padding: 32px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
        .header h1 span { color: #d4b572; }
        .header p { margin: 8px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 36px 30px; text-align: left; }
        .badge { display: inline-block; background: #fef2f2; color: #b91c1c; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .title { font-size: 20px; font-weight: 700; color: #141b28; margin-bottom: 12px; }
        .text { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 18px; }
        .reason-box { background: #f8fafc; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; padding: 16px; margin: 20px 0; font-size: 13px; color: #334155; line-height: 1.6; }
        .policy-card { background: #FAF8F5; border: 1px solid #ede8e1; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 12px; color: #6b7280; line-height: 1.6; }
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
            <span class="badge">Return Request Not Approved</span>
            <div class="title">Hello {{ $returnRequest->order->shipping_name ?? 'Valued Customer' }},</div>
            <p class="text">
                Thank you for reaching out to us regarding <strong>Order #{{ $returnRequest->order_number }}</strong>.
            </p>
            <p class="text">
                After carefully reviewing your request and the provided details against our slow-fashion policy guidelines, we regret to inform you that this request could not be approved.
            </p>

            @if(!empty($returnRequest->rejection_reason))
            <div class="reason-box">
                <strong>Reason for decision:</strong><br>
                {{ $returnRequest->rejection_reason }}
            </div>
            @endif

            <div class="policy-card">
                <strong style="color: #41542f;">Flaunt Green Small-Batch Policy Reminder:</strong><br>
                Because our garments are sustainably handcrafted in limited runs, we only entertain returns/exchanges if reported within <strong>48 hours of delivery</strong> strictly for incorrect size or incorrect product received. Items from sales or Dog Togs collections are non-returnable.
            </div>

            <p class="text">
                If you believe this was an error or have further information to provide, please reply directly or write to us at <a href="mailto:support@flauntgreen.in" style="color: #41542f; font-weight: 600;">support@flauntgreen.in</a> with your Order ID.
            </p>
        </div>
        <div class="footer">
            Flaunt Green &bull; Mumbai, Maharashtra<br>
            For assistance, contact <a href="mailto:support@flauntgreen.in" style="color: #41542f; text-decoration: none; font-weight: 600;">support@flauntgreen.in</a>
        </div>
    </div>
</body>
</html>
