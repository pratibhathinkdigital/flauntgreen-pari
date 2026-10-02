<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation #{{ $order->order_number }} - Flaunt Green</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 30px 15px; color: #141b28; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ede8e1; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: #41542f; padding: 32px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
        .header h1 span { color: #d4b572; }
        .header p { margin: 8px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85); letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 36px 30px; text-align: left; }
        .badge { display: inline-block; background: #ecfdf5; color: #047857; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .title { font-size: 20px; font-weight: 700; color: #141b28; margin-bottom: 8px; }
        .text { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 20px; }
        .order-meta { background: #FAF8F5; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; border: 1px solid #ede8e1; display: flex; justify-content: space-between; font-size: 13px; }
        .meta-col { flex: 1; }
        .meta-col strong { color: #41542f; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
        .items-table th { text-align: left; padding: 10px 0; border-bottom: 2px solid #ede8e1; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
        .items-table td { padding: 14px 0; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .item-name { font-weight: 600; color: #141b28; font-size: 14px; }
        .item-spec { font-size: 12px; color: #64748b; margin-top: 2px; }
        .summary-box { background: #FAF8F5; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; font-size: 13px; border: 1px solid #ede8e1; }
        .summary-row { display: flex; justify-content: space-between; padding: 4px 0; color: #475569; }
        .summary-total { display: flex; justify-content: space-between; padding: 10px 0 0 0; margin-top: 8px; border-top: 2px solid #d4cbbd; font-size: 16px; font-weight: 700; color: #41542f; }
        .address-box { background: #f8fafc; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; border: 1px solid #e2e8f0; font-size: 13px; line-height: 1.6; }
        .address-box h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #41542f; }
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
            <span class="badge">Order Confirmed</span>
            <div class="title">Thank You, {{ $order->shipping_name ?? 'Valued Customer' }}!</div>
            <p class="text">
                Your order <strong>#{{ $order->order_number }}</strong> has been confirmed and is now being handcrafted and prepared for dispatch.
            </p>

            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 55%;">Item</th>
                        <th style="width: 15%; text-align: center;">Qty</th>
                        <th style="width: 30%; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>
                            <div class="item-name">{{ $item->name }}</div>
                            <div class="item-spec">
                                @if($item->size) Size: {{ $item->size }} @endif
                                @if($item->color) | Color: {{ $item->color }} @endif
                            </div>
                        </td>
                        <td style="text-align: center;">{{ $item->quantity }}</td>
                        <td style="text-align: right; font-weight: 600;">₹{{ number_format($item->price * $item->quantity, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="summary-box">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{{ number_format($order->subtotal, 2) }}</span>
                </div>
                @if($order->shipping_cost > 0)
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>₹{{ number_format($order->shipping_cost, 2) }}</span>
                </div>
                @else
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span style="color: #047857; font-weight: 600;">Free Delivery</span>
                </div>
                @endif
                @if($order->tax > 0)
                <div class="summary-row">
                    <span>Estimated Tax:</span>
                    <span>₹{{ number_format($order->tax, 2) }}</span>
                </div>
                @endif
                <div class="summary-total">
                    <span>Grand Total:</span>
                    <span>₹{{ number_format($order->total, 2) }}</span>
                </div>
            </div>

            <div class="address-box">
                <h4>Delivery Address &amp; Payment</h4>
                <strong>Recipient:</strong> {{ $order->shipping_name }}<br>
                @if($order->shipping_phone) <strong>Phone:</strong> {{ $order->shipping_phone }}<br> @endif
                <strong>Address:</strong> {{ $order->shipping_address }}<br>
                <strong>Payment Method:</strong> {{ strtoupper($order->payment_method ?? 'ONLINE') }} (Status: {{ ucfirst($order->payment_status) }})
            </div>

            <p class="text" style="font-size: 13px; color: #64748b;">
                You can track your order status anytime by logging into your Flaunt Green account under <strong>My Orders</strong>.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Flaunt Green. Handcrafted sustainably.<br>
            If you have questions regarding your order, reply to this email or write to <strong>support@flauntgreen.in</strong>
        </div>
    </div>
</body>
</html>
