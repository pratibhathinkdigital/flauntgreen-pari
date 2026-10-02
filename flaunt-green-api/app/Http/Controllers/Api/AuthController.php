<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtpMail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user and send OTP.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:15',
        ]);

        $existingUser = User::where('email', $request->email)->first();

        if ($existingUser && $existingUser->email_verified_at) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered. Please log in.'],
            ]);
        }

        $otp = (string) random_int(100000, 999999);

        if ($existingUser) {
            // Update existing unverified user with new credentials and fresh OTP
            $existingUser->update([
                'name' => $request->name,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'otp_code' => Hash::make($otp),
                'otp_expires_at' => now()->addMinutes(15),
            ]);
            $user = $existingUser;
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => 'customer',
                'otp_code' => Hash::make($otp),
                'otp_expires_at' => now()->addMinutes(15),
            ]);
        }

        // Send OTP Email directly to user inbox
        try {
            Mail::to($user->email)->send(new SendOtpMail($otp, $user->name));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send OTP email to {$user->email}: " . $e->getMessage());
            return response()->json([
                'message' => 'Unable to send OTP to your email. Please verify your email address or try again.',
            ], 500);
        }

        return response()->json([
            'message' => 'Registration successful. An OTP has been sent directly to your email address.',
            'email' => $user->email,
        ], 201);
    }

    /**
     * Verify the OTP and activate the account.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        // Brute-force protection: max 5 OTP attempts per email per 10 minutes
        $rateLimitKey = 'otp-attempts:' . $request->email;
        if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = \Illuminate\Support\Facades\RateLimiter::availableIn($rateLimitKey);
            return response()->json([
                'message' => "Too many OTP attempts. Please try again in {$seconds} seconds.",
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            \Illuminate\Support\Facades\RateLimiter::hit($rateLimitKey, 600);
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        if (!$user->otp_code || !$user->otp_expires_at || now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP expired or invalid. Please request a new one.'], 400);
        }

        if (!Hash::check($request->otp, $user->otp_code)) {
            \Illuminate\Support\Facades\RateLimiter::hit($rateLimitKey, 600);
            return response()->json(['message' => 'Invalid OTP.'], 400);
        }

        // Successful verification — clear rate limit
        \Illuminate\Support\Facades\RateLimiter::clear($rateLimitKey);

        // Mark as verified
        $user->email_verified_at = now();
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Resend OTP for verification.
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $otp = (string) random_int(100000, 999999);
        $user->otp_code = Hash::make($otp);
        $user->otp_expires_at = now()->addMinutes(15);
        $user->save();

        try {
            Mail::to($user->email)->send(new SendOtpMail($otp, $user->name));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Failed to resend OTP email to {$user->email}: " . $e->getMessage());
            return response()->json([
                'message' => 'Unable to send OTP email at the moment. Please try again.',
            ], 500);
        }

        return response()->json([
            'message' => 'A new OTP has been sent directly to your email address.',
        ]);
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Please verify your email address before logging in.',
                'requires_verification' => true
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Logout user (Revoke the token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Send password reset OTP to user email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Even if user does not exist, return a generic message to prevent email enumeration
        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'If an account exists with this email, a password reset code has been sent.',
            ]);
        }

        $otp = (string) random_int(100000, 999999);
        $user->otp_code = Hash::make($otp);
        $user->otp_expires_at = now()->addMinutes(15);
        $user->save();

        try {
            Mail::to($user->email)->send(new SendOtpMail($otp, $user->name));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Forgot password OTP mail error for {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'If an account exists with this email, a password reset code has been sent.',
        ]);
    }

    /**
     * Reset password using email, OTP and new password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'otp'      => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid email or reset code.',
            ], 422);
        }

        if (!$user->otp_code || !$user->otp_expires_at || now()->isAfter($user->otp_expires_at)) {
            return response()->json([
                'message' => 'The reset code has expired. Please request a new one.',
            ], 422);
        }

        if (!Hash::check($request->otp, $user->otp_code)) {
            return response()->json([
                'message' => 'Invalid verification code. Please check and try again.',
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->otp_code = null;
        $user->otp_expires_at = null;
        if (!$user->email_verified_at) {
            $user->email_verified_at = now();
        }
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Your password has been reset successfully. You can now log in with your new password.',
        ]);
    }

    /**
     * Google Auth placeholder handler.
     */
    public function googleRedirect()
    {
        return response()->json([
            'message' => 'Google Authentication is currently being prepared for production.',
        ], 501);
    }
}
