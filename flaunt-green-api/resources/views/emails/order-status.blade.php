<!DOCTYPE html>
<html>
<head>
    <title>Order Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2F4F4F;">Update on Your Order!</h2>
        
        <p>Dear {{ $order->shipping_name }},</p>
        
        <p>Your order <strong>{{ $order->order_number }}</strong> has a new status update.</p>
        
        <p>Current Status: <strong style="text-transform: capitalize; color: #15803d;">{{ $order->status }}</strong></p>
        
        @if($order->status === 'shipped')
            <p>Your order is on its way! It has been handed over to our delivery partner.</p>
        @elseif($order->status === 'delivered')
            <p>Your order has been delivered! We hope you love your new sustainable fashion piece.</p>
        @endif

        <p>Thank you for shopping with Flaunt Green.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">Flaunt Green - Sustainable Luxury Fashion</p>
    </div>
</body>
</html>
