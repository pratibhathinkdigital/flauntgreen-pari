"use client";

import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error("Please login to proceed to checkout");
      onClose();
      router.push("/login?redirect=/checkout");
      return;
    }
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-70 shadow-2xl flex flex-col transition-transform duration-400
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-600" />
            Cart ({totalItems()})
          </h2>
          <button
            onClick={onClose}
            className="btn-icon btn-ghost"
            id="cart-drawer-close"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {!isAuthenticated() ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4 py-8">
              <div className="w-14 h-14 rounded-2xl bg-[#41542f]/10 text-[#41542f] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <p className="font-heading font-bold text-slate-800 text-lg">Please Sign In</p>
                <p className="text-xs text-slate-500 mt-1">
                  Log in to access your saved cart items and complete your order.
                </p>
              </div>
              <Link
                href="/login?redirect=/cart"
                onClick={onClose}
                className="btn-primary btn-sm w-full mt-2"
              >
                Log In to Continue
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-200" />
              <p className="font-medium text-text-secondary">Your cart is empty</p>
              <Link href="/shop" onClick={onClose} className="btn-primary btn-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._cartKey} className="flex gap-3 p-3 rounded-2xl hover:bg-surface-secondary transition-colors">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-surface-tertiary shrink-0">
                  <Image
                    src={item.image || "/placeholder-product.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 leading-snug">{item.name}</p>
                  {/* Size/Color badge */}
                  {(item.size || item.color) && (
                    <div className="flex gap-1 mt-0.5">
                      {item.size && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          {item.color}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-brand-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty Controls +/- */}
                    {(() => {
                      const isMaxStock = item.stock !== undefined && item.quantity >= Number(item.stock);
                      return (
                        <div className="flex items-center gap-1 border border-slate-200 rounded-xl px-1.5 py-1">
                          <button
                            onClick={() => updateQuantity(item._cartKey, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center select-none">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (isMaxStock) {
                                toast.error(`Only ${item.stock} item(s) available in stock.`);
                                return;
                              }
                              updateQuantity(item._cartKey, item.quantity + 1);
                            }}
                            disabled={isMaxStock}
                            className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
                              isMaxStock
                                ? "opacity-30 cursor-not-allowed text-slate-300"
                                : "text-slate-500 hover:text-black hover:bg-slate-100 cursor-pointer"
                            }`}
                            aria-label="Increase quantity"
                            title={isMaxStock ? `Maximum stock (${item.stock}) reached` : "Increase quantity"}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })()}
                    <button
                      onClick={() => removeItem(item._cartKey)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && isAuthenticated() && (
          <div className="border-t border-slate-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-bold text-text-primary font-heading text-base">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <p className="text-xs text-text-muted">Shipping calculated at checkout</p>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full"
              id="cart-checkout-btn"
            >
              Proceed to Checkout
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="btn-secondary w-full block text-center"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
