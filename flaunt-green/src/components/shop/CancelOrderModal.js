"use client";

import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { ordersApi } from "@/services/api";

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Changed my mind",
  "Incorrect size or color selected",
  "Need to change shipping address",
  "Found alternative product",
  "Delivery timeline is too long",
  "Other reason",
];

export default function CancelOrderModal({ order, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [customNote, setCustomNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullReason = reason === "Other reason" && customNote.trim()
      ? `Other: ${customNote.trim()}`
      : customNote.trim()
      ? `${reason} - ${customNote.trim()}`
      : reason;

    try {
      await ordersApi.cancel(order.rawId || order.id, { reason: fullReason });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to cancel order. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  const isOnlinePayment = order.rawPaymentMethod === "razorpay" || order.paymentMethod?.toLowerCase().includes("online");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FAF8F5] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF8F5] px-6 py-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-soft-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#141b28]">Cancel Order</h2>
              <p className="text-xs text-stone-500 font-mono">Order #{order.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#141b28]">Order Cancelled Successfully</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Your order has been cancelled and stock has been restored to inventory.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {/* Policy & Refund Note */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
                <p className="font-semibold flex items-center gap-1.5">
                  <span>ℹ️</span> Cancellation Policy:
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Orders can only be cancelled while in <strong>Placed</strong> or <strong>Processing</strong> stage before dispatch.
                </p>
                {isOnlinePayment ? (
                  <p className="text-stone-600 text-[11px] pt-1 border-t border-amber-200/50">
                    💳 <strong>Online Payment:</strong> Your refund of ₹{order.total?.toLocaleString("en-IN")} will be automatically reversed to your original payment account within 3–5 working days.
                  </p>
                ) : (
                  <p className="text-stone-600 text-[11px] pt-1 border-t border-amber-200/50">
                    💵 <strong>Cash on Delivery:</strong> No payment has been collected for this order.
                  </p>
                )}
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                >
                  {CANCEL_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Provide any additional details..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-stone-800 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-soft-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
