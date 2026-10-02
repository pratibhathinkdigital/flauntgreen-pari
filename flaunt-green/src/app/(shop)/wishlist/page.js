"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { getImageUrl } from "@/lib/axios";
import toast from "react-hot-toast";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const auth = useAuthStore.getState();
    if (!auth.token || !auth.user) {
      clearWishlist();
    }
  }, [clearWishlist]);

  if (!mounted) return null;

  const isAuth = Boolean(user && isAuthenticated());

  const handleMoveToCart = (item) => {
    const rawImage = item.primary_image?.image_url || item.images?.[0]?.image_url || item.image;
    const primaryImage = getImageUrl(rawImage, "/placeholder.jpg");

    addItem({
      product_id: item.id,
      name: item.name,
      price: item.price,
      image: primaryImage,
      size: "M",
    });
    removeItem(item.id);
    toast.success(`${item.name} moved to cart`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        {/* CASE 1: User is NOT logged in */}
        {!isAuth ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 max-w-xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-[#997b47] flex items-center justify-center mb-6 shadow-soft-sm">
              <Heart className="w-8 h-8" />
            </div>

            <h1
              className="font-bold mb-3 text-[#1C2A3A]"
              style={{
                fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 36px)",
              }}
            >
              Please Log In to View Your Wishlist
            </h1>

            <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed max-w-md">
              Save timeless sustainable styles to your account and review them whenever you return.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm mb-12">
              <Link
                href="/login?redirect=/wishlist"
                className="w-full sm:w-auto flex-1 px-7 py-3.5 rounded-xl font-semibold bg-[#41542f] text-white hover:bg-[#344325] transition-all shadow-soft-sm text-sm text-center flex items-center justify-center gap-2"
              >
                Sign In to Continue <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?redirect=/wishlist"
                className="w-full sm:w-auto flex-1 px-7 py-3.5 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-sm text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* CASE 2: Logged in, empty wishlist */
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100 max-w-lg mx-auto">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="font-heading text-xl font-bold text-slate-800">Your wishlist is empty</h2>
            <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
              Save items you love while exploring our collections to find them easily here.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-5 px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344325] transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          /* CASE 3: Logged in with items */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <h1
                  className="text-2xl font-bold text-[#141b28]"
                  style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
                >
                  My Wishlist
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {items.length} saved item{items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={clearWishlist}
                className="text-xs text-slate-400 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group shadow-soft-xs">
                  <div className="aspect-[3/4] relative bg-slate-100">
                    <Image
                      src={getImageUrl(item.primary_image?.image_url || item.images?.[0]?.image_url || item.image, "/placeholder.jpg")}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-400 hover:text-red-600 hover:bg-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3.5 space-y-2">
                    <p className="font-semibold text-xs text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs font-bold text-[#41542f]">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full py-2 rounded-xl bg-slate-900 text-white text-2xs font-semibold hover:bg-[#41542f] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" /> Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NewsletterSection />
    </div>
  );
}
