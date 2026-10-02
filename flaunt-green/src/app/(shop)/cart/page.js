"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Heart, ShoppingBag, Lock, UserCheck, ArrowRight, ShieldCheck, Sparkles, RefreshCw, Tag, Check, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import NewsletterSection from "@/components/sections/NewsletterSection";
import toast from "react-hot-toast";
import { couponsApi } from "@/services/api";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, totalPrice, clearCart, appliedCoupon, applyCoupon, removeCoupon, syncStockWithBackend } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    setMounted(true);
    // Real-time e-commerce flow: If user is not logged in, clear any lingering cart items
    const auth = useAuthStore.getState();
    if (!auth.token || !auth.user) {
      clearCart();
    } else {
      syncStockWithBackend?.();
    }
  }, [clearCart, syncStockWithBackend]);

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await couponsApi.validate(couponCode.trim(), totalPrice());
      if (res.data?.valid) {
        applyCoupon(res.data.coupon);
        setCouponCode("");
        toast.success(`Promo code applied: ${res.data.coupon.label}`);
      } else {
        setCouponError(res.data?.message || "Invalid promo code");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid promo code or minimum order condition not met.";
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError("");
    toast.success("Promo code removed.");
  };

  const subtotal = totalPrice();
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.max_discount) discountAmount = Math.min(discountAmount, appliedCoupon.max_discount);
    } else {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (!mounted) return null; // Avoid hydration mismatch

  const isAuth = Boolean(user && isAuthenticated());

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        {/* CASE 1: User is NOT logged in -> Require Login */}
        {!isAuth ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 max-w-xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-[#41542f]/10 text-[#41542f] flex items-center justify-center mb-6 shadow-soft-sm">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <h1
              className="font-bold mb-3 text-[#1C2A3A]"
              style={{
                fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 36px)",
              }}
            >
              Please Log In to View Your Cart
            </h1>

            <p className="text-slate-500 mb-8 text-sm sm:text-base leading-relaxed max-w-md">
              Your cart items, custom selections, and saved preferences are linked securely to your account.
              Please sign in to access your shopping bag and proceed to checkout.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm mb-12">
              <Link
                href="/login?redirect=/cart"
                className="w-full sm:w-auto flex-1 px-7 py-3.5 rounded-xl font-semibold bg-[#41542f] text-white hover:bg-[#344325] transition-all shadow-soft-sm text-sm text-center flex items-center justify-center gap-2"
              >
                Sign In to Continue <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?redirect=/cart"
                className="w-full sm:w-auto flex-1 px-7 py-3.5 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-sm text-center"
              >
                Create Account
              </Link>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8 border-t border-slate-100 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <ShieldCheck className="w-5 h-5 text-[#41542f] mb-2" />
                <h4 className="text-xs font-bold text-slate-800">Secure Checkout</h4>
                <p className="text-2xs text-slate-500 mt-0.5">Encrypted payment & safe data protection</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <Sparkles className="w-5 h-5 text-[#997b47] mb-2" />
                <h4 className="text-xs font-bold text-slate-800">Saved Across Devices</h4>
                <p className="text-2xs text-slate-500 mt-0.5">Access your bag from phone, tablet, or desktop</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <UserCheck className="w-5 h-5 text-[#7694cc] mb-2" />
                <h4 className="text-xs font-bold text-slate-800">Member Privileges</h4>
                <p className="text-2xs text-slate-500 mt-0.5">Exclusive early access & promotional codes</p>
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* CASE 2: User is logged in, but cart is empty */
          <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h1
              className="font-bold mb-3 text-[#1C2A3A]"
              style={{
                fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 36px)",
              }}
            >
              Your Shopping Cart is Empty
            </h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Welcome back, <span className="font-semibold text-slate-700">{user?.name}</span>! Looks like you haven't added anything to your cart yet. Explore our sustainable collection and find timeless pieces.
            </p>
            <Link
              href="/collections"
              className="px-8 py-3.5 rounded-xl bg-[#41542f] text-white font-medium hover:bg-[#344325] transition-all shadow-soft-sm text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* CASE 3: User is logged in and has items */
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-slate-100 gap-2">
              <div>
                <h1
                  className="font-bold text-[#1C2A3A]"
                  style={{
                    fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                    fontSize: "clamp(28px, 4vw, 36px)",
                  }}
                >
                  Your Shopping Cart
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Shopping as <span className="font-semibold text-slate-700">{user?.name}</span> ({items.length} item{items.length !== 1 ? "s" : ""})
                </p>
              </div>
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-600 transition-colors self-start sm:self-auto"
              >
                Clear all items
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                <div className="border border-slate-100 rounded-2xl p-6 bg-white shadow-soft-sm">
                  {items.map((item, idx) => {
                    const itemKey = item._cartKey || item.product_id || item.id || item._id || `cart-${idx}`;
                    return (
                      <div key={itemKey} className="flex gap-6 py-6 border-b border-slate-100 last:border-0 first:pt-0 last:pb-0">
                        {/* Product Image */}
                        <div className="w-[100px] h-[130px] relative bg-slate-100 rounded-xl overflow-hidden shrink-0 shadow-soft-xs">
                          <Image
                            src={item.image || item.images?.[0] || "/assets/placeholder.jpg"}
                            alt={item.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-[#1C2A3A] uppercase text-sm mb-1">{item.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {item.size && (
                                <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-medium">
                                  Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-medium">
                                  Color: {item.color}
                                </span>
                              )}
                              {item.stock !== undefined && (
                                <span className={`text-[11px] px-2 py-0.5 rounded-lg font-medium ${
                                  Number(item.stock) <= 3
                                    ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                }`}>
                                  {Number(item.stock) <= 5 ? `Only ${item.stock} in stock` : `In Stock: ${item.stock}`}
                                </span>
                              )}
                            </div>
                            <div className="font-semibold text-[#1C2A3A]">
                              ₹{Number(item.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })} /-
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {(() => {
                              const isMaxStock = item.stock !== undefined && item.quantity >= Number(item.stock);
                              return (
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                    className="px-3 py-1 hover:bg-slate-50 transition-colors text-lg text-slate-600 active:scale-95"
                                    title="Decrease quantity"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 min-w-[2.5rem] text-center text-sm font-bold text-[#1C2A3A]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => {
                                      if (isMaxStock) {
                                        toast.error(`Only ${item.stock} item(s) available in stock.`);
                                        return;
                                      }
                                      updateQuantity(itemKey, item.quantity + 1);
                                    }}
                                    disabled={isMaxStock}
                                    className={`px-3 py-1 transition-colors text-lg text-slate-600 ${
                                      isMaxStock
                                        ? "opacity-30 cursor-not-allowed bg-slate-100"
                                        : "hover:bg-slate-50 active:scale-95 cursor-pointer"
                                    }`}
                                    title={isMaxStock ? `Maximum stock (${item.stock}) reached` : "Increase quantity"}
                                  >
                                    +
                                  </button>
                                </div>
                              );
                            })()}

                            <button
                              onClick={() => removeItem(itemKey)}
                              className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors font-medium p-1 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="space-y-6 sticky top-[120px]">
                  <div className="border border-slate-100 rounded-2xl p-6 bg-white shadow-soft-sm">
                    <h2 className="text-base font-bold text-[#1C2A3A] mb-5">Order Summary</h2>

                    <div className="space-y-3.5 text-sm text-[#1C2A3A] mb-6">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })} /-</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-700">
                          <span className="flex items-center gap-1 font-medium">
                            <Tag className="w-3.5 h-3.5" /> Discount ({appliedCoupon.code})
                          </span>
                          <span className="font-bold">-₹{discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} /-</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>Shipping</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          🎉 Free shipping
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#1C2A3A]">Total</span>
                        <span className="font-bold text-lg text-[#1C2A3A]">
                          ₹{finalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })} /-
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link
                        href="/checkout"
                        className="block text-center w-full py-3.5 rounded-xl font-semibold bg-[#997b47] text-white hover:bg-[#836838] transition-all shadow-soft-sm text-sm"
                      >
                        Proceed to Checkout
                      </Link>
                      <Link
                        href="/collections"
                        className="block text-center w-full py-3.5 rounded-xl border border-slate-200 text-[#1C2A3A] font-medium hover:bg-slate-50 transition-colors text-sm"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>

                  {/* Promo Code Box */}
                  <div className="border border-slate-100 rounded-2xl p-6 bg-white shadow-soft-sm">
                    <h3 className="font-bold text-[#1C2A3A] mb-3 text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#41542f]" /> Promo Code
                      </span>
                    </h3>

                    {appliedCoupon ? (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-mono font-bold text-emerald-800 text-sm tracking-wider">{appliedCoupon.code}</span>
                            <p className="text-xs text-emerald-600 font-medium">{appliedCoupon.label || "Promo Applied"}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 bg-white border border-red-200 px-2.5 py-1 rounded-lg transition-colors shadow-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="ENTER CODE (E.G. WELCOME10)"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              if (couponError) setCouponError("");
                            }}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f] text-sm uppercase font-mono tracking-wider"
                          />
                          <button
                            type="submit"
                            disabled={couponLoading || !couponCode.trim()}
                            className="px-5 py-2.5 rounded-xl bg-[#41542f] text-white font-medium hover:bg-[#344325] transition-colors text-sm disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                          >
                            {couponLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{couponError}</p>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <NewsletterSection />
    </div>
  );
}
