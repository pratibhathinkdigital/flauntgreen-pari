"use client";

import { useState, useEffect } from "react";
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
  const [reason, setReason] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [confirmCheck, setConfirmCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setCustomNote("");
      setConfirmCheck(false);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!reason || reason.trim() === "") {
      setError("Please select a valid cancellation reason from the list.");
      return;
    }

    if (reason === "Other reason" && !customNote.trim()) {
      setError("Please enter a brief note explaining your cancellation reason.");
      return;
    }

    if (!confirmCheck) {
      setError("Please check the confirmation box to authorize order cancellation.");
      return;
    }

    setLoading(true);

    const fullReason = reason === "Other reason"
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
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
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
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white text-stone-800 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f] transition-all ${
                    !reason ? "border-amber-300 text-stone-500 font-medium" : "border-stone-200"
                  }`}
                >
                  <option value="" disabled>-- Please select a mandatory cancellation reason --</option>
                  {CANCEL_REASONS.map((r) => (
                    <option key={r} value={r} className="text-stone-800 font-normal">{r}</option>
                  ))}
                </select>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                  <span>
                    {reason === "Other reason" ? "Cancellation Explanation" : "Additional Notes (Optional)"}
                    {reason === "Other reason" && <span className="text-red-500 ml-1 font-bold">*</span>}
                  </span>
                  {reason === "Other reason" && (
                    <span className="text-[10px] text-red-500 font-medium">Mandatory for &apos;Other reason&apos;</span>
                  )}
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => {
                    setCustomNote(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={
                    reason === "Other reason"
                      ? "Please explain in detail why you are cancelling this order..."
                      : "Provide any additional feedback or details..."
                  }
                  rows={2}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white text-stone-800 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f] transition-all ${
                    reason === "Other reason" && !customNote.trim() ? "border-amber-300" : "border-stone-200"
                  }`}
                />
              </div>

              {/* Confirmation Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/60 border border-red-200 cursor-pointer transition-all hover:bg-red-50">
                  <input
                    type="checkbox"
                    checked={confirmCheck}
                    onChange={(e) => {
                      setConfirmCheck(e.target.checked);
                      if (error) setError(null);
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-red-300 cursor-pointer accent-red-600"
                  />
                  <span className="text-xs text-red-950 leading-snug select-none font-medium">
                    I confirm that I want to cancel Order <strong>#{order.id}</strong>. I understand that this cancellation is <strong>permanent</strong> and inventory will be released. <span className="text-red-600 font-bold">*</span>
                  </span>
                </label>
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
                  disabled={loading || !reason || !confirmCheck || (reason === "Other reason" && !customNote.trim())}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-soft-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
