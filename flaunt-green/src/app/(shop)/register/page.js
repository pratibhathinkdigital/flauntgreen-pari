"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Leaf, Mail, RefreshCcw } from "lucide-react";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import NewsletterSection from "@/components/sections/NewsletterSection";

const inputCls = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] transition-colors text-[#1C2A3A] text-sm bg-white";
const inputErrCls = "w-full px-4 py-3 rounded-lg border border-red-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400 transition-colors text-[#1C2A3A] text-sm bg-white";

// ── OTP Verification Step ─────────────────────────────────────────────────────
function OtpStep({ email, onSuccess }) {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpString = otp.join("");

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);
    setError("");
    // Auto-focus next box
    if (value && index < 5) {
      const next = document.getElementById(`otp-box-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-box-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authApi.verifyOtp({ email, otp: otpString });
      const { access_token, user } = res.data;
      setAuth(user, access_token);
      toast.success("Email verified! Welcome to Flaunt Green 🌿");
      router.push("/account");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true);
    try {
      await authApi.resendOtp({ email });
      toast.success("A new OTP has been sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      setError("");
      // 60-second cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100 text-center">
      {/* Icon */}
      <div className="w-14 h-14 bg-[#f7ece6] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Mail className="w-7 h-7 text-[#997b47]" />
      </div>
      <h2
        className="font-bold text-[#1C2A3A] mb-2"
        style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "26px" }}
      >
        Verify Your Email
      </h2>
      <p className="text-sm text-slate-500 mb-2">
        We&apos;ve sent a 6-digit OTP to
      </p>
      <p className="text-sm font-semibold text-[#41542f] mb-6 bg-[#41542f]/5 px-3 py-1.5 rounded-lg inline-block">
        {email}
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleVerify}>
        {/* OTP Boxes */}
        <div className="flex justify-center gap-2.5 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-box-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-slate-200 focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] transition-all bg-white text-[#1C2A3A]"
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otpString.length !== 6}
          id="otp-verify-btn"
          className="w-full py-3.5 rounded-xl font-semibold bg-[#997b47] text-white hover:bg-[#836838] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            : <><CheckCircle2 className="w-4 h-4" /> Verify & Activate Account</>
          }
        </button>
      </form>

      {/* Resend */}
      <div className="mt-5 text-sm text-slate-500">
        Didn&apos;t receive the OTP?{" "}
        <button
          onClick={handleResend}
          disabled={resendLoading || resendCooldown > 0}
          className="font-semibold text-[#41542f] hover:underline disabled:opacity-50 inline-flex items-center gap-1"
        >
          {resendLoading
            ? <><Loader2 className="w-3 h-3 animate-spin" /> Sending...</>
            : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : <><RefreshCcw className="w-3 h-3" /> Resend OTP</>
          }
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        OTP is valid for 15 minutes.
      </p>
    </div>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState(null); // null = show form, string = show OTP step

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit mobile number";
    if (!form.password || form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await authApi.register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        password: form.password,
      });
      toast.success("Account created! Check your email for the OTP.");
      setRegisteredEmail(form.email.trim());
    } catch (err) {
      const msg = err?.response?.data?.message;
      const valErrors = err?.response?.data?.errors;
      if (valErrors?.email) {
        setErrors((prev) => ({ ...prev, email: valErrors.email[0] }));
      } else {
        setServerError(msg || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const pwdStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwdStrength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-[#41542f]", "bg-emerald-500"][pwdStrength];

  // ── Show OTP Step ───────────────────────────────────────────────────────────
  if (registeredEmail) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#F5F1E8]">
          <div className="w-full max-w-[420px]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 mb-4">
                <Leaf className="w-5 h-5 text-[#41542f]" />
                <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}>
                  Flaunt<span className="text-[#997b47]">Green</span>
                </span>
              </div>
            </div>
            <OtpStep email={registeredEmail} />
          </div>
        </div>
        <NewsletterSection />
      </div>
    );
  }

  // ── Show Register Form ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#F5F1E8]">
        <div className="w-full max-w-[560px]">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 mb-4">
              <Leaf className="w-5 h-5 text-[#41542f]" />
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}>
                Flaunt<span className="text-[#997b47]">Green</span>
              </span>
            </div>
            <h1
              className="font-bold text-[#1C2A3A]"
              style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 34px)" }}
            >
              Create New Account
            </h1>
            <p className="text-slate-500 text-sm mt-1">Join the conscious fashion movement.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100">
            {serverError && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1C2A3A] mb-1.5 font-medium text-sm" htmlFor="reg-firstName">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    placeholder="e.g. Pratibha"
                    className={errors.firstName ? inputErrCls : inputCls}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-[#1C2A3A] mb-1.5 font-medium text-sm" htmlFor="reg-lastName">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    placeholder="e.g. Sharma"
                    className={errors.lastName ? inputErrCls : inputCls}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#1C2A3A] mb-1.5 font-medium text-sm" htmlFor="reg-email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className={errors.email ? inputErrCls : inputCls}
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                <p className="text-xs text-slate-400 mt-1">An OTP will be sent here to verify your account.</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[#1C2A3A] mb-1.5 font-medium text-sm" htmlFor="reg-phone">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">+91</span>
                  <input
                    id="reg-phone"
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                    className={`${errors.phone ? inputErrCls : inputCls} pl-11`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1C2A3A] mb-1.5 font-medium text-sm" htmlFor="reg-password">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`${errors.password ? inputErrCls : inputCls} pr-11`}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#997b47] transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  {/* Strength bar */}
                  {form.password && (
                    <div className="mt-1.5">
                      <div className="flex gap-1 mb-0.5">
                        {[1,2,3,4].map((l) => (
                          <div key={l} className={`h-1 flex-1 rounded-full ${l <= pwdStrength ? strengthColor : "bg-slate-200"} transition-all`} />
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400">{strengthLabel}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[#1C2A3A] mb-1.5 font-medium text-sm" htmlFor="reg-confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                      placeholder="Repeat password"
                      className={`${errors.confirmPassword ? inputErrCls : inputCls} pr-11`}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#997b47] transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                id="register-submit-btn"
                className="w-full py-3.5 rounded-xl font-semibold bg-[#41542f] text-white hover:bg-[#344326] transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
                  : "Register Now"
                }
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#6E7C4F]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#1C2A3A] hover:text-[#997b47] font-semibold transition-colors">
                Login now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <NewsletterSection />
    </div>
  );
}
