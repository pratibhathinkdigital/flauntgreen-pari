<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>New Contact Enquiry – Flaunt Green</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #FAF8F5;
            padding: 40px 20px;
            color: #141b28;
        }
        .wrapper {
            max-width: 620px;
            margin: 0 auto;
        }
        .header {
            background: #41542f;
            padding: 28px 40px;
            border-radius: 12px 12px 0 0;
            text-align: center;
        }
        .logo {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 0.05em;
        }
        .logo span { color: #c8a96e; }
        .tag {
            display: inline-block;
            margin-top: 10px;
            font-size: 11px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.65);
        }
        .card {
            background: #ffffff;
            padding: 40px;
            border: 1px solid #e8e3da;
            border-top: none;
        }
        .title {
            font-size: 20px;
            font-weight: 700;
            color: #141b28;
            margin-bottom: 6px;
        }
        .subtitle {
            font-size: 13px;
            color: #7c8a93;
            margin-bottom: 28px;
        }
        .divider {
            height: 1px;
            background: #f0ebe3;
            margin: 24px 0;
        }
        .field-row {
            display: flex;
            gap: 0;
            margin-bottom: 16px;
        }
        .field-label {
            width: 120px;
            flex-shrink: 0;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #997b47;
            padding-top: 3px;
        }
        .field-value {
            flex: 1;
            font-size: 14px;
            color: #1a1a1a;
            line-height: 1.5;
        }
        .field-value a {
            color: #41542f;
            text-decoration: none;
        }
        .message-block {
            background: #f7f4ed;
            border-left: 3px solid #41542f;
            border-radius: 0 6px 6px 0;
            padding: 18px 20px;
            font-size: 14px;
            color: #1a1a1a;
            line-height: 1.7;
            white-space: pre-line;
            margin-top: 4px;
        }
        .cta-btn {
            display: inline-block;
            margin-top: 28px;
            background: #41542f;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.05em;
        }
        .footer {
            background: #f7f4ed;
            border: 1px solid #e8e3da;
            border-top: none;
            border-radius: 0 0 12px 12px;
            padding: 20px 40px;
            text-align: center;
            font-size: 11px;
            color: #7c8a93;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="wrapper">

        <!-- Header -->
        <div class="header">
            <div class="logo">Flaunt<span>Green</span></div>
            <span class="tag">Contact Form Notification</span>
        </div>

        <!-- Card -->
        <div class="card">
            <div class="title">New Enquiry Received</div>
            <div class="subtitle">A visitor has submitted the contact form on your website.</div>

            <div class="divider"></div>

            <!-- Sender details -->
            <div class="field-row">
                <div class="field-label">Name</div>
                <div class="field-value">{{ $senderName }}</div>
            </div>
            <div class="field-row">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a></div>
            </div>
            @if($senderPhone)
            <div class="field-row">
                <div class="field-label">Phone</div>
                <div class="field-value"><a href="tel:{{ $senderPhone }}">{{ $senderPhone }}</a></div>
            </div>
            @endif
            <div class="field-row">
                <div class="field-label">Subject</div>
                <div class="field-value">{{ $subject }}</div>
            </div>

            <div class="divider"></div>

            <div class="field-label" style="margin-bottom:10px;">Message</div>
            <div class="message-block">{{ $messageBody }}</div>

            <a href="mailto:{{ $senderEmail }}" class="cta-btn">Reply to {{ $senderName }}</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} Flaunt Green &bull; This is an automated notification from your website contact form.<br>
            <strong>Do not reply directly to this email</strong> — use the button above or click the sender's email address.
        </div>

    </div>
</body>
</html>
