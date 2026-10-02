"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, RotateCw, ArrowLeft, Home, ShoppingBag, 
  Sparkles, Compass, Heart, ArrowRight 
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const popularSearches = [
    { label: "Organic Linen", query: "linen" },
    { label: "Her Collection", href: "/her" },
    { label: "Him Shirts", query: "shirt" },
    { label: "Dog Togs", href: "/dog_togs" },
    { label: "New Arrivals", href: "/shop" },
  ];

  const suggestedCategories = [
    {
      title: "Her Collection",
      desc: "Graceful silhouettes tailored from pure handloom & organic weaves.",
      href: "/her",
      tag: "Womenswear",
    },
    {
      title: "Him Collection",
      desc: "Effortless, breathable slow-fashion staples for mindful living.",
      href: "/him",
      tag: "Menswear",
    },
    {
      title: "Dog Togs",
      desc: "Matching festive wear & gentle accessories for your loyal companions.",
      href: "/dog_togs",
      tag: "Pet Couture",
    },
    {
      title: "Conscious Journal",
      desc: "Stories of ethical artisanship, natural dyes, and slow craft.",
      href: "/journal",
      tag: "Our Stories",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C2A3A]">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#41542f]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#997b47]/5 blur-3xl pointer-events-none" />

        <div className="max-w-3xl w-full mx-auto text-center space-y-8 relative z-10">
          
          {/* Badge & Number */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#41542f]/10 text-[#41542f] text-xs font-semibold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Error 404 • Page Not Found</span>
            </div>
            
            <h1 className="text-7xl sm:text-9xl font-serif font-light text-[#141b28] tracking-tight">
              4<span className="text-[#997b47] font-serif italic">0</span>4
            </h1>
          </div>

          {/* Heading & Context */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141b28]">
              Lost in the Fabric of Time
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
              The page or handcrafted piece you are searching for might have been moved, renamed, or woven into a different collection. Let’s help you find what you need.
            </p>
          </div>

          {/* ── Interactive Live Search Bar ── */}
          <div className="max-w-xl mx-auto w-full">
            <form onSubmit={handleSearch} className="relative group">
              <div className="flex items-center bg-white rounded-2xl border-2 border-stone-200/90 shadow-soft-md group-focus-within:border-[#41542f] group-focus-within:shadow-lg transition-all overflow-hidden p-1.5">
                <div className="pl-3.5 text-stone-400 group-focus-within:text-[#41542f] transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search organic linen, dresses, shirts, dog togs..."
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

            {/* Popular quick searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-1">
              <span className="text-xs text-stone-400 font-medium">Trending:</span>
              {popularSearches.map((item, idx) => (
                item.href ? (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-100/90 hover:bg-[#41542f] hover:text-white text-stone-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={idx}
                    onClick={() => router.push(`/shop?search=${encodeURIComponent(item.query)}`)}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-100/90 hover:bg-[#41542f] hover:text-white text-stone-600 transition-colors"
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>

          {/* ── Main Action Buttons ── */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center gap-2"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#41542f]" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Reload Page"}</span>
            </button>

            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/shop"
              className="px-6 py-2.5 rounded-xl bg-[#997b47] hover:bg-[#856b3e] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-soft-sm flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Explore Shop</span>
            </Link>
          </div>

          {/* ── Curated Suggestions Grid ── */}
          <div className="pt-10 border-t border-stone-200/80">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-6">
              Or Explore Our Signature Collections
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {suggestedCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  className="group bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-[#41542f]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#997b47] uppercase tracking-wider">
                      {cat.tag}
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#141b28] group-hover:text-[#41542f] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-light">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center text-xs font-semibold text-[#41542f] group-hover:translate-x-1 transition-transform">
                    <span>Discover</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
