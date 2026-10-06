"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import NewsletterSection from "@/components/sections/NewsletterSection";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || null;
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await authApi.login({ email: form.email, password: form.password });
      const { access_token, user } = res.data;
      setAuth(user, access_token);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}! 🌿`);
      // Redirect based on role or intended destination
      if (user.role === "admin") {
        router.push("/admin");
      } else if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/account");
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      if (status === 403 && err?.response?.data?.requires_verification) {
        setNeedsVerification(true);
        setServerError("Your email is not verified. Please check your inbox for the OTP.");
      } else if (status === 422) {
        setServerError("Incorrect email or password.");
      } else {
        setServerError(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-colors text-[#1C2A3A]";
  const inputErrCls = "w-full px-4 py-3 rounded-lg border border-red-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400 transition-colors text-[#1C2A3A]";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-[#F5F1E8]">
        <div className="w-full max-w-[450px] bg-white rounded-xl shadow-soft p-8 md:p-10 border border-slate-100">
          <h1 
            className="text-center mb-8 font-bold"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 4vw, 36px)",
              color: "#1C2A3A",
            }}
          >
            Login
          </h1>

          {/* Server Error */}
          {serverError && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                {serverError}
                {needsVerification && (
                  <Link href="/register" className="block mt-1 text-[var(--gold)] font-medium underline">
                    Re-register to get a new OTP →
                  </Link>
                )}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-[#1C2A3A] mb-2 font-medium" htmlFor="login-email">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className={errors.email ? inputErrCls : inputCls}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-[#1C2A3A] mb-2 font-medium" htmlFor="login-password">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Enter your password"
                  className={`${errors.password ? inputErrCls : inputCls} pr-12`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--gold)] focus:outline-none transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            
            <div className="flex justify-start pt-1">
              <Link href="/forgot-password" className="text-sm text-[#1C2A3A] hover:text-[var(--gold)] transition-colors">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full py-3.5 rounded-lg font-medium bg-[var(--gold)] text-[#F5F1E8] hover:bg-[#8F7328] transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Login"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-[#6E7C4F]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#1C2A3A] hover:text-[var(--gold)] font-medium transition-colors">
              Register now
            </Link>
          </div>
        </div>
      </div>
      
      <NewsletterSection />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
