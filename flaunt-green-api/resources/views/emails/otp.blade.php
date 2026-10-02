<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify your email - Flaunt Green</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 40px 20px; color: #141b28; }
        .container { max-w-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; text-align: center; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 30px; }
        .logo span { color: #997b47; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 20px; }
        .otp-box { background: #f8fafc; border: 1px dashed #cbd5e1; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #41542f; border-radius: 8px; margin: 25px 0; }
        .footer { font-size: 12px; color: #64748b; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">Flaunt<span>Green</span></div>
        <div class="title">Verify your email address</div>
        <p>Hi {{ $name }},</p>
        <p>Thank you for registering at Flaunt Green! To complete your registration and log into your account, please use the following OTP (One-Time Password):</p>
        
        <div class="otp-box">
            {{ $otp }}
        </div>
        
        <p>This code will expire in 15 minutes. If you did not request this code, you can safely ignore this email.</p>
        
        <div class="footer">
            &copy; {{ date('Y') }} Flaunt Green. All rights reserved.
        </div>
    </div>
</body>
</html>
