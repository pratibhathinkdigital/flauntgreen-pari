"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Leaf, Mail, RefreshCcw } from "lucide-react";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import NewsletterSection from "@/components/sections/NewsletterSection";

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
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
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
    <div className="bg-white rounded-xl shadow-soft p-8 border border-slate-100 text-center">
      <div className="w-14 h-14 bg-[#f7ece6] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Mail className="w-7 h-7 text-[var(--gold)]" />
      </div>
      <h2
        className="font-bold text-[#1C2A3A] mb-2"
        style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "26px" }}
      >
        Verify Your Email
      </h2>
      <p className="text-sm text-slate-500 mb-2">We've sent a 6-digit OTP to</p>
      <p className="text-sm font-semibold text-[#41542f] mb-6 bg-[#41542f]/5 px-3 py-1.5 rounded-lg inline-block">{email}</p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleVerify}>
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
              className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all bg-white text-[#1C2A3A]"
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otpString.length !== 6}
          id="otp-verify-btn"
          className="w-full py-3.5 rounded-lg font-medium bg-[var(--gold)] text-white hover:bg-[#8F7328] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
            : <><CheckCircle2 className="w-4 h-4" /> Verify & Activate Account</>
          }
        </button>
      </form>

      <div className="mt-5 text-sm text-slate-500">
        Didn't receive the OTP?{" "}
        <button
          onClick={handleResend}
          disabled={resendLoading || resendCooldown > 0}
          className="font-medium text-[#1C2A3A] hover:text-[var(--gold)] hover:underline disabled:opacity-50 inline-flex items-center gap-1 transition-colors"
        >
          {resendLoading
            ? <><Loader2 className="w-3 h-3 animate-spin" /> Sending...</>
            : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : <><RefreshCcw className="w-3 h-3" /> Resend OTP</>
          }
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-4">OTP is valid for 15 minutes.</p>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", company: "", gst: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState(null);

  const inputCls = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors text-[#1C2A3A]";
  const inputErrCls = "w-full px-4 py-3 rounded-lg border border-red-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400 transition-colors text-[#1C2A3A]";

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
        // Backend ignores extra fields if not supported, but we pass them just in case
        company: form.company.trim(),
        gst: form.gst.trim()
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

  if (registeredEmail) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#F5F1E8]">
          <div className="w-full max-w-[420px]">
            <OtpStep email={registeredEmail} />
          </div>
        </div>
        <NewsletterSection />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#F5F1E8]">
        <div className="w-full max-w-[600px] bg-white rounded-xl shadow-soft p-8 md:p-10 border border-slate-100">
          <h1 
            className="text-center mb-8 font-bold"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 4vw, 36px)",
              color: "#1C2A3A",
            }}
          >
            Create New Account
          </h1>
          
          {serverError && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="company">
                Company
              </label>
              <input
                id="company"
                type="text"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="firstName">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className={errors.firstName ? inputErrCls : inputCls}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="lastName">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className={errors.lastName ? inputErrCls : inputCls}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="email">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={errors.email ? inputErrCls : inputCls}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="phone">
                Phone<span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                className={errors.phone ? inputErrCls : inputCls}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="password">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={`${errors.password ? inputErrCls : inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--gold)] focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="confirmPassword">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    className={`${errors.confirmPassword ? inputErrCls : inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--gold)] focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[#1C2A3A] mb-2 font-medium text-sm" htmlFor="gst">
                GST IN
              </label>
              <input
                id="gst"
                type="text"
                value={form.gst}
                onChange={(e) => set("gst", e.target.value)}
                className={inputCls}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-medium bg-[var(--gold)] text-[#F5F1E8] hover:bg-[#8F7328] transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : "Register Now"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-[#6E7C4F]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1C2A3A] hover:text-[var(--gold)] font-medium transition-colors">
              Login now
            </Link>
          </div>
        </div>
      </div>
      
      <NewsletterSection />
    </div>
  );
}
