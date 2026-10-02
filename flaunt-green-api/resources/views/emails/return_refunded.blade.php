<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Refund Initiated - Flaunt Green</title>
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
        .refund-card { background: #FAF8F5; border: 1.5px solid #d4cbbd; border-radius: 14px; padding: 22px; margin: 24px 0; text-align: center; }
        .amount { font-size: 32px; font-weight: 800; color: #41542f; margin: 10px 0; font-family: monospace; }
        .detail-row { display: flex; justify-content: space-between; font-size: 13px; color: #4b5563; padding: 8px 0; border-bottom: 1px dashed #e2d9cd; }
        .detail-row:last-child { border-bottom: none; }
        .timeline-notice { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #1e40af; margin: 20px 0; }
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
            <span class="badge">Refund Processed Successfully</span>
            <div class="title">Hello {{ $returnRequest->order->shipping_name ?? 'Valued Customer' }},</div>
            <p class="text">
                Your returned product for <strong>Order #{{ $returnRequest->order_number }}</strong> has completed Quality Control inspection at our Dadar facility.
            </p>
            <p class="text">
                As discussed, your refund has been successfully initiated:
            </p>

            <div class="refund-card">
                <div style="font-size: 12px; text-transform: uppercase; color: #997b47; font-weight: 700; letter-spacing: 1px;">Refund Amount</div>
                <div class="amount">₹{{ number_format($returnRequest->refund_amount ?? $returnRequest->order->total, 2) }}</div>

                <div style="margin-top: 16px; text-align: left;">
                    <div class="detail-row">
                        <span>Payment Method:</span>
                        <strong>{{ strtoupper($returnRequest->refund_payment_method ?? $returnRequest->order->payment_method) }}</strong>
                    </div>
                    @if(!empty($returnRequest->refund_transaction_id))
                    <div class="detail-row">
                        <span>Reference / UTR ID:</span>
                        <strong>{{ $returnRequest->refund_transaction_id }}</strong>
                    </div>
                    @endif
                    @if($returnRequest->refund_payment_method === 'cod' && !empty($returnRequest->refund_account_details))
                    <div class="detail-row">
                        <span>Destination Account:</span>
                        <strong>{{ $returnRequest->refund_account_details['upi_id'] ?? ($returnRequest->refund_account_details['account_number'] ?? 'Bank Account') }}</strong>
                    </div>
                    @endif
                </div>
            </div>

            <div class="timeline-notice">
                💳 <strong>Bank Settlement Notice:</strong> Depending on your banking partner or payment gateway, the refunded amount will reflect in your account within <strong>3 to 5 business days</strong>.
            </div>

            <p class="text">
                Thank you for choosing Flaunt Green. We look forward to serving you again with better handcrafted experiences! 💚
            </p>
        </div>
        <div class="footer">
            Flaunt Green &bull; Mumbai, Maharashtra<br>
            Questions regarding refund? Write to <a href="mailto:support@flauntgreen.in" style="color: #41542f; text-decoration: none; font-weight: 600;">support@flauntgreen.in</a>
        </div>
    </div>
</body>
</html>
