"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Clock, LogIn, ShoppingBag, Search, ArrowRight, 
  RotateCw, ShieldCheck, Heart, Sparkles 
} from "lucide-react";

function SessionExpiredContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/shop";
  const [query, setQuery] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const handleRefresh = () => {
    setIsChecking(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden bg-[#FAF8F5]">
      {/* Soft Ambient Lights */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#41542f]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#997b47]/5 blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full mx-auto text-center space-y-8 relative z-10">

        {/* Animated Icon Badge */}
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-white border border-stone-200/80 shadow-soft-lg flex items-center justify-center mx-auto text-[#41542f] relative group">
            <div className="absolute inset-0 rounded-3xl bg-[#41542f]/10 animate-ping opacity-30" />
            <Clock className="w-10 h-10 relative z-10 text-[#41542f]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#41542f]/10 text-[#41542f] text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Timeout Notice</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141b28]">
            Your Session Has Expired
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
            For your security and privacy, sessions automatically close after a period of inactivity. Your cart items and saved favorites remain securely stored in your browser.
          </p>
        </div>

        {/* ── Main Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <button
            onClick={handleRefresh}
            disabled={isChecking}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center justify-center gap-2"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-[#41542f]" : ""}`} />
            <span>{isChecking ? "Checking Session..." : "Refresh Page"}</span>
          </button>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse as Guest</span>
          </Link>
        </div>

        {/* ── Seamless Product Search Form ── */}
        <div className="pt-8 border-t border-stone-200/80 space-y-3">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
            Looking for Something Specific? Start Searching
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
                placeholder="Search linen shirts, dresses, dog togs, or fabrics..."
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

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-stone-500">
            <span>Quick Shortcuts:</span>
            <Link href="/her" className="underline hover:text-[#41542f]">Her Collection</Link>
            <span>•</span>
            <Link href="/him" className="underline hover:text-[#41542f]">Him Collection</Link>
            <span>•</span>
            <Link href="/dog_togs" className="underline hover:text-[#41542f]">Dog Togs</Link>
            <span>•</span>
            <Link href="/contact" className="underline hover:text-[#41542f]">Help &amp; Support</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SessionExpiredPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SessionExpiredContent />
    </Suspense>
  );
}
