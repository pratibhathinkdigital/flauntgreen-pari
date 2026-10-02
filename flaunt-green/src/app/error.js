"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  AlertTriangle, RotateCw, Home, ShoppingBag, 
  Search, ArrowRight, ShieldAlert, LogIn, MessageCircle 
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ErrorBoundary({ error, reset }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  // Check if error is related to authentication / expired session
  const isAuthError = 
    error?.message?.toLowerCase().includes("unauthenticated") ||
    error?.message?.toLowerCase().includes("session") ||
    error?.message?.toLowerCase().includes("token") ||
    error?.message?.toLowerCase().includes("401");

  useEffect(() => {
    // Log error to console for monitoring
    console.error("Flaunt Green Application Error:", error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    try {
      if (typeof reset === "function") {
        reset();
      }
    } catch {
      // Fallback
    }
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C2A3A]">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#41542f]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-[#997b47]/5 blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full mx-auto text-center space-y-8 relative z-10">

          {/* ── State 1: Session Expired / Auth Error ── */}
          {isAuthError ? (
            <>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Session Expired</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141b28]">
                  Your Shopping Session Has Timed Out
                </h1>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light max-w-lg mx-auto">
                  For your privacy and security, active sessions expire after a period of inactivity. Your cart and wishlist items remain safely stored.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Resume Shopping</span>
                </Link>

                <button
                  onClick={handleRetry}
                  className="px-5 py-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center gap-2"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Refresh Page</span>
                </button>
              </div>
            </>
          ) : (
            /* ── State 2: General Server or Runtime Error (500) ── */
            <>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-800 text-xs font-semibold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Error 500 • Unexpected Hiccup</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141b28]">
                  Something Went Slightly Off Course
                </h1>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light max-w-lg mx-auto">
                  Our conscious digital atelier experienced a temporary glitch. We are already looking into it. Please try refreshing or search for your desired piece below.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="px-6 py-3 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                  <RotateCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                  <span>{isRetrying ? "Reloading Atelier..." : "Refresh & Try Again"}</span>
                </button>

                <Link
                  href="/"
                  className="px-5 py-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center gap-2"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Return to Home</span>
                </Link>

                <Link
                  href="/contact"
                  className="px-5 py-3 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contact Support</span>
                </Link>
              </div>
            </>
          )}

          {/* ── Search Bar so Customer Process Is Never Blocked ── */}
          <div className="pt-8 border-t border-stone-200/80 max-w-xl mx-auto w-full space-y-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
              Continue Searching Our Collections
            </p>
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center bg-white rounded-2xl border-2 border-stone-200/90 shadow-soft-md group-focus-within:border-[#41542f] group-focus-within:shadow-lg transition-all overflow-hidden p-1.5">
                <div className="pl-3.5 text-stone-400 group-focus-within:text-[#41542f] transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by product, category, or fabric..."
                  className="w-full px-3.5 py-3 text-sm text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Developer Details (Only in non-production) */}
          {process.env.NODE_ENV !== "production" && error?.message && (
            <details className="text-left mt-6 p-4 rounded-xl bg-stone-100/90 border border-stone-200 text-xs text-stone-600 font-mono overflow-auto max-h-48">
              <summary className="cursor-pointer font-bold text-stone-700 select-none">
                Technical Error Details (Dev Mode Only)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
              {error.digest && <p className="mt-1 text-[11px] text-stone-400">Digest: {error.digest}</p>}
            </details>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
