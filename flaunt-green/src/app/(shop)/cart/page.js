"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Heart, ShoppingBag, Lock, UserCheck, ArrowRight, ShieldCheck, Sparkles, RefreshCw, Tag, Check, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import NewsletterSection from "@/components/sections/NewsletterSection";
import toast from "react-hot-toast";
import { couponsApi, ordersApi } from "@/services/api";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, totalPrice, clearCart, appliedCoupons, appliedCoupon, applyCoupon, removeCoupon, syncStockWithBackend } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isFirstOrder, setIsFirstOrder] = useState(Boolean(user?.is_first_order));

  const couponsList = (appliedCoupons && appliedCoupons.length > 0)
    ? appliedCoupons
    : (appliedCoupon ? [appliedCoupon] : []);

  useEffect(() => {
    setMounted(true);
    // Real-time e-commerce flow: If user is not logged in, clear any lingering cart items
    const auth = useAuthStore.getState();
    if (!auth.token || !auth.user) {
      clearCart();
    } else {
      syncStockWithBackend?.();
      // Check first order eligibility from authoritative backend
      ordersApi.checkFirstOrderEligibility()
        .then((res) => {
          if (typeof res.data?.eligible === "boolean") {
            setIsFirstOrder(res.data.eligible);
          }
        })
        .catch((err) => {
          console.warn("Could not check first order eligibility:", err);
          if (auth.user?.is_first_order !== undefined) {
            setIsFirstOrder(Boolean(auth.user.is_first_order));
          }
        });
    }
  }, [clearCart, syncStockWithBackend]);

  const handleApplyCoupon = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const cleaned = couponCode.trim().toUpperCase();
    if (!cleaned) return;

    if (couponsList.some((c) => c.code.toUpperCase() === cleaned)) {
      setCouponError(`Promo code "${cleaned}" is already applied!`);
      return;
    }

    if (couponsList.length >= 3) {
      setCouponError("You can apply a maximum of 3 promo codes per order.");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await couponsApi.validate(cleaned, totalPrice());
      if (res.data?.valid) {
        const result = applyCoupon(res.data.coupon);
        if (result?.success === false) {
          setCouponError(result.message);
          toast.error(result.message);
        } else {
          setCouponCode("");
          toast.success(`🎉 Applied ${res.data.coupon.code}: ${res.data.coupon.label}`);
        }
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

  const handleRemoveCoupon = (codeToRemove) => {
    removeCoupon(codeToRemove);
    setCouponError("");
    toast.success(`Promo code ${codeToRemove || ""} removed.`);
  };

  const subtotal = totalPrice();
  
  const couponDiscounts = couponsList.map((coupon) => {
    let disc = 0;
    if (coupon.type === "percent") {
      disc = Math.round((subtotal * coupon.value) / 100);
      if (coupon.max_discount) disc = Math.min(disc, coupon.max_discount);
    } else {
      disc = Math.min(Number(coupon.value), subtotal);
    }
    return {
      code: coupon.code,
      label: coupon.label || (coupon.type === "percent" ? `${coupon.value}% off` : `₹${coupon.value} off`),
      discount: disc,
    };
  });

  const couponDiscountAmount = Math.min(
    couponDiscounts.reduce((sum, c) => sum + c.discount, 0),
    subtotal
  );

  // ── First Order 5% Discount Calculation ──────────────────────────
  const firstOrderDiscount = isFirstOrder ? Math.round(subtotal * 0.05) : 0;
  const totalDiscount = Math.min(couponDiscountAmount + firstOrderDiscount, subtotal);
  const discountAmount = totalDiscount;
  const finalTotal = Math.max(0, subtotal - totalDiscount);

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

            <p className="text-slate-500 mb-6 text-sm sm:text-base leading-relaxed max-w-md">
              Your cart items, custom selections, and saved preferences are linked securely to your account.
              Please sign in to access your shopping bag and proceed to checkout.
            </p>

            {/* First Order Promotional Teaser Banner */}
            <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 border border-emerald-200/80 max-w-md w-full flex items-center gap-3 text-left shadow-2xs">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-base shadow-xs">
                🎁
              </span>
              <div>
                <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  First Order Welcome Perk!
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded-full uppercase">5% OFF</span>
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                  Register or log in now to automatically receive <strong>5% discount</strong> on your entire first purchase.
                </p>
              </div>
            </div>

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

            {/* First Order Discount Active Callout Banner */}
            {isFirstOrder && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200 shadow-soft-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-emerald-950 font-heading">
                        First Order Perk: 5% Discount Automatically Applied!
                      </h4>
                      <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      As a welcome gift on your first order, a <strong>5% discount</strong> applies across all items in your cart. You save <strong className="font-bold">₹{firstOrderDiscount.toLocaleString("en-IN")}</strong>!
                    </p>
                  </div>
                </div>
              </div>
            )}

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

                      {/* 5% First Order Discount Row */}
                      {isFirstOrder && firstOrderDiscount > 0 && (
                        <div className="flex justify-between items-center text-emerald-700 text-sm bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200">
                          <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
                            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                            First Order Discount (5%)
                            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold uppercase">
                              Welcome
                            </span>
                          </span>
                          <span className="font-bold text-emerald-800">
                            -₹{firstOrderDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} /-
                          </span>
                        </div>
                      )}

                      {/* Individual Coupon Discounts */}
                      {couponDiscounts.map((cd, idx) => (
                        <div key={cd.code} className="flex justify-between text-emerald-700 text-sm">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Tag className="w-3.5 h-3.5" /> Coupon #{idx + 1} ({cd.code})
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              Stacked
                            </span>
                          </span>
                          <span className="font-bold">-₹{cd.discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} /-</span>
                        </div>
                      ))}
                      {couponsList.length > 1 && (
                        <div className="flex justify-between text-emerald-800 font-bold border-t border-dashed border-emerald-200 pt-1.5 bg-emerald-50/60 p-2 rounded-xl text-sm">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Total Stacked Promo Savings ({couponsList.length} codes)
                          </span>
                          <span>-₹{couponDiscountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} /-</span>
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
                    {/* Header with Badges */}
                    <h3 className="font-bold text-[#1C2A3A] mb-3 text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#41542f]" /> Promo Codes
                      </span>
                      {couponsList.length > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                          {couponsList.length}/3 Stacked
                        </span>
                      )}
                    </h3>

                    {/* Stackable Promo Banner */}
                    <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-emerald-50/60 to-amber-50/40 border border-amber-200/80 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#41542f] text-white text-[11px] shadow-xs">
                            🎟️
                          </span>
                          <span className="text-xs font-bold text-slate-800 tracking-tight">
                            Stack Multiple Coupons
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200/60">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          Up to 3 Allowed
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-snug">
                        {couponsList.length === 0 && (
                          <>Combine welcome offers &amp; promotional discounts together! Enter your first code below, then stack more.</>
                        )}
                        {couponsList.length === 1 && (
                          <span className="text-emerald-700 font-semibold">
                            🎉 1 coupon applied! Enter another code below to stack extra savings (2 slots remaining).
                          </span>
                        )}
                        {couponsList.length === 2 && (
                          <span className="text-emerald-700 font-semibold">
                            🔥 2 coupons stacked! You can add 1 more code to maximize your discount.
                          </span>
                        )}
                        {couponsList.length >= 3 && (
                          <span className="text-emerald-800 font-semibold">
                            ⭐ Max 3 coupons stacked! Best possible promo savings unlocked for this order.
                          </span>
                        )}
                      </p>

                      {/* 3 Interactive Slot Badges */}
                      <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-amber-200/50">
                        {[0, 1, 2].map((slotIdx) => {
                          const isFilled = couponsList[slotIdx];
                          return (
                            <div
                              key={slotIdx}
                              className={`flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[10px] font-semibold transition-all ${
                                isFilled
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : couponsList.length === slotIdx
                                  ? "bg-white text-[#41542f] border border-[#41542f]/40 font-bold shadow-2xs"
                                  : "bg-white/60 text-slate-400 border border-slate-200/50"
                              }`}
                            >
                              {isFilled ? (
                                <>
                                  <Check className="w-3 h-3 shrink-0" />
                                  <span className="truncate max-w-[50px] font-mono">{isFilled.code}</span>
                                </>
                              ) : couponsList.length === slotIdx ? (
                                <span>Slot {slotIdx + 1} (Enter)</span>
                              ) : (
                                <span>Slot {slotIdx + 1}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Applied coupons list */}
                    {couponsList.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {couponDiscounts.map((cd, idx) => (
                          <div
                            key={cd.code}
                            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between transition-all animate-fade-in"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-mono font-bold text-emerald-800 text-sm tracking-wider">{cd.code}</span>
                                <p className="text-xs text-emerald-700 font-medium">
                                  {cd.label} • Saved ₹{cd.discount.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCoupon(cd.code)}
                              className="text-xs font-semibold text-red-500 hover:text-red-700 bg-white border border-red-200 px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                              title={`Remove ${cd.code}`}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {couponsList.length < 3 ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={
                              couponsList.length === 0
                                ? "Enter 1st promo code (e.g. WELCOME10)"
                                : couponsList.length === 1
                                ? "Enter 2nd code to stack savings..."
                                : "Enter 3rd & final code..."
                            }
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              if (couponError) setCouponError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                handleApplyCoupon(e);
                              }
                            }}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f] text-sm uppercase font-mono tracking-wider placeholder:normal-case placeholder:font-sans"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponCode.trim()}
                            className="px-5 py-2.5 rounded-xl bg-[#41542f] text-white font-medium hover:bg-[#344325] transition-colors text-sm disabled:opacity-50 flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                          >
                            {couponLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : couponsList.length === 0 ? (
                              "Apply"
                            ) : (
                              `+ Stack #${couponsList.length + 1}`
                            )}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{couponError}</p>
                        )}
                        <p className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1">
                          <span>💡 Tip: Apply up to 3 coupons one by one to combine all discounts together!</span>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
                        <p className="text-xs text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Maximum 3 promo codes stacked for maximum savings!
                        </p>
                      </div>
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
