<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return Request Approved - Flaunt Green</title>
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
        .address-card { background: #FAF8F5; border: 1.5px solid #d4cbbd; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .address-card h4 { margin: 0 0 10px; font-size: 14px; color: #41542f; text-transform: uppercase; letter-spacing: 1px; }
        .address-text { font-size: 13px; line-height: 1.6; color: #1f2937; }
        .checklist { background: #f8fafc; border-radius: 12px; padding: 18px 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
        .checklist h4 { margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #334155; }
        .checklist ul { margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #475569; }
        .timeline-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #92400e; margin: 20px 0; }
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
            <span class="badge">Return Request Approved</span>
            <div class="title">Hello {{ $returnRequest->order->shipping_name ?? 'Valued Customer' }},</div>
            <p class="text">
                Your return request for <strong>Order #{{ $returnRequest->order_number }}</strong> has been reviewed and <strong>approved</strong> by our team.
            </p>
            <p class="text">
                As per our sustainable slow-fashion process, please securely pack and dispatch the item(s) to our official return address below:
            </p>

            <div class="address-card">
                <h4>Return Shipping Address</h4>
                <div class="address-text">
                    <strong>Flaunt Green</strong><br>
                    <em>(Green Initiatives &amp; Sustainable Solutions, An Initiative of Eco Ventures Private Limited)</em><br>
                    9/10 Adi House, Vijay Manjrekar Marg,<br>
                    Gokhale Road (N), Dadar West,<br>
                    Mumbai – 400028, Maharashtra<br>
                    <strong>Landmark:</strong> Opp. Portuguese Church<br>
                    <strong>Contact / Support:</strong> support@flauntgreen.in
                </div>
            </div>

            <div class="checklist">
                <h4>Mandatory Return Checklist</h4>
                <ul>
                    <li>The garment must be <strong>unworn, unwashed, and unscented</strong>.</li>
                    <li>In its original condition with all tags and invoice intact.</li>
                    <li>Safely packed in original packaging to prevent transit damage.</li>
                    <li>Please mention Order #{{ $returnRequest->order_number }} on the parcel.</li>
                </ul>
            </div>

            <div class="timeline-box">
                ⏱ <strong>Expected Timeline:</strong> Once the product reaches our Dadar facility, our Quality Control team will inspect it within <strong>24-48 hours</strong>. If approved, we will ship the replacement or initiate your refund immediately. Total return processing takes approximately <strong>5-7 business days</strong>.
            </div>

            <p class="text" style="margin-top: 24px;">
                Thank you for being thoughtful and supporting sustainable fashion 🌿
            </p>
        </div>
        <div class="footer">
            Flaunt Green &bull; Mumbai, Maharashtra<br>
            For any queries, write to us at <a href="mailto:support@flauntgreen.in" style="color: #41542f; text-decoration: none; font-weight: 600;">support@flauntgreen.in</a>
        </div>
    </div>
</body>
</html>
