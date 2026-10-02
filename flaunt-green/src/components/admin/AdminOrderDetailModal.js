"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
  Truck,
  Copy,
  Check,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
  Eye,
  FileText
} from "lucide-react";
import { returnsApi, ordersApi } from "@/services/api";
import toast from "react-hot-toast";

export default function AdminOrderDetailModal({ order, isOpen, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState(order?.returnRequest ? "return" : "items");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Sub-modals for Admin Actions
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(order?.total || 0);
  const [refundTxnId, setRefundTxnId] = useState("");
  const [refundMethod, setRefundMethod] = useState(order?.payment === "COD" ? "cod" : "online");

  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [replacementTracking, setReplacementTracking] = useState("");
  const [replacementCourier, setReplacementCourier] = useState("Express Surface Courier");

  const [previewImage, setPreviewImage] = useState(null);

  if (!isOpen || !order) return null;

  const req = order.returnRequest;

  // 48-Hour delivery calculation check
  const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : (order.rawOrder?.delivered_at ? new Date(order.rawOrder.delivered_at) : null);
  const requestDate = req?.created_at ? new Date(req.created_at) : null;
  let hoursBetween = null;
  let isWithin48h = true;

  if (deliveryDate && requestDate) {
    hoursBetween = Math.round((requestDate - deliveryDate) / (1000 * 60 * 60));
    isWithin48h = hoursBetween <= 48;
  }

  // Admin Actions
  const handleApproveReturn = async () => {
    if (!confirm(`Approve return request for Order #${order.id}? This will email official Dadar warehouse return instructions to the customer.`)) return;

    try {
      setActionLoading(true);
      await returnsApi.adminApprove(req.id, {});
      toast.success("Return approved and instructions sent to customer!");
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve return.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectReturn = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason for rejecting the return.");
      return;
    }

    try {
      setActionLoading(true);
      await returnsApi.adminReject(req.id, { rejection_reason: rejectionReason.trim() });
      toast.success("Return request rejected and notification sent.");
      setIsRejectModalOpen(false);
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject return.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessRefund = async (e) => {
    e.preventDefault();
    if (!refundAmount || !refundTxnId.trim()) {
      toast.error("Please specify refund amount and Transaction / UTR ID.");
      return;
    }

    try {
      setActionLoading(true);
      await returnsApi.adminRefund(req.id, {
        refund_amount: parseFloat(refundAmount),
        refund_transaction_id: refundTxnId.trim(),
        refund_payment_method: refundMethod,
      });
      toast.success(`Refund of ₹${refundAmount} recorded and confirmation sent to customer!`);
      setIsRefundModalOpen(false);
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process refund.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispatchReplacement = async (e) => {
    e.preventDefault();
    if (!replacementTracking.trim()) {
      toast.error("Please provide the tracking number / AWB.");
      return;
    }

    try {
      setActionLoading(true);
      await returnsApi.adminReplacement(req.id, {
        replacement_tracking_number: replacementTracking.trim(),
        replacement_courier_name: replacementCourier.trim(),
      });
      toast.success("Replacement recorded and dispatch email sent to customer!");
      setIsReplacementModalOpen(false);
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record replacement.");
    } finally {
      setActionLoading(false);
    }
  };

  const copyUpi = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-soft-2xl my-8 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#997b47]">#{order.id}</span>
              <span className={`text-2xs uppercase tracking-wide font-bold px-2 py-0.5 rounded-full ${
                order.status === "delivered" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
              }`}>
                {order.status}
              </span>
              {req && (
                <span className={`text-2xs uppercase tracking-wide font-bold px-2 py-0.5 rounded-full ${
                  req.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                  req.status === "rejected" ? "bg-red-100 text-red-800" :
                  req.status === "refunded" ? "bg-purple-100 text-purple-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  Return: {req.status}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customer: <strong>{order.customer}</strong> ({order.email} &bull; {order.phone || "No phone"})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-white gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("items")}
            className={`py-3 border-b-2 transition-all ${
              activeTab === "items"
                ? "border-[#0c2c6d] text-[#0c2c6d]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Order Details &amp; Items ({order.rawOrder?.items?.length || order.items || 1})
          </button>

          {req && (
            <button
              onClick={() => setActiveTab("return")}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "return"
                  ? "border-[#997b47] text-[#997b47]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Return &amp; Refund Request
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>
          )}
        </div>

        {/* Tab 1: Order Details */}
        {activeTab === "items" && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Delivery & Payment Info */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4 text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Shipping Address</p>
                <p className="text-slate-800 font-medium mt-1 leading-relaxed">{order.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Payment Method</p>
                <p className="text-slate-800 font-semibold mt-1">
                  {order.payment} &bull; Total: ₹{Number(order.total).toLocaleString("en-IN")}
                </p>
                {deliveryDate && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    Delivered on: {deliveryDate.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Ordered Products</p>
              {(order.rawOrder?.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="w-10 h-12 relative rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Size: {item.size || "ONE"} &bull; Color: {item.color || "N/A"} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Return Request & Admin Workflow */}
        {activeTab === "return" && req && (
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* 48-Hour Policy Validation Badge */}
            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              isWithin48h
                ? "bg-emerald-50/60 border-emerald-200 text-emerald-800"
                : "bg-red-50/60 border-red-200 text-red-800"
            }`}>
              <div className="flex items-center gap-2">
                {isWithin48h ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                <div>
                  <p className="font-bold">
                    {isWithin48h
                      ? "Within 48-Hour Slow-Fashion Policy Window ✅"
                      : "48-Hour Return Window Exceeded ⚠️"}
                  </p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {hoursBetween !== null ? `Submitted ${hoursBetween} hours after delivery.` : "Delivery verified."}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-white/80 border">
                {req.reason === "incorrect_size" ? "Incorrect Size" : "Incorrect Product"}
              </span>
            </div>

            {/* Customer Reason & Notes */}
            <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">Customer Explanation</span>
              <p className="text-slate-800 italic leading-relaxed">
                &quot;{req.customer_notes || "No additional comments provided."}&quot;
              </p>
            </div>

            {/* Proof Photos */}
            {req.images && req.images.length > 0 && (
              <div>
                <span className="block font-bold uppercase tracking-wider text-[11px] text-slate-600 mb-2">
                  Customer Uploaded Proof Images ({req.images.length})
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {req.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setPreviewImage(img)}
                      className="aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:opacity-90 relative group shadow-2xs"
                    >
                      <img src={img} alt="Proof" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COD Bank / UPI Payout Details */}
            {req.refund_account_details && (
              <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Customer Refund Destination (COD)
                  </span>
                  {req.refund_account_details.upi_id && (
                    <button
                      onClick={() => copyUpi(req.refund_account_details.upi_id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-[10px] font-semibold text-amber-800"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      Copy UPI
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-mono bg-white p-2.5 rounded-xl border border-amber-100">
                  {req.refund_account_details.upi_id && (
                    <div>UPI ID: <strong>{req.refund_account_details.upi_id}</strong></div>
                  )}
                  {req.refund_account_details.account_holder && (
                    <div>Name: <strong>{req.refund_account_details.account_holder}</strong></div>
                  )}
                  {req.refund_account_details.account_number && (
                    <div>Account: <strong>{req.refund_account_details.account_number}</strong></div>
                  )}
                  {req.refund_account_details.ifsc && (
                    <div>IFSC: <strong>{req.refund_account_details.ifsc}</strong></div>
                  )}
                </div>
              </div>
            )}

            {/* Current Resolution State */}
            {req.status === "refunded" && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex justify-between">
                <span>Refunded Amount: <strong>₹{req.refund_amount}</strong></span>
                <span>Ref / UTR: <strong>{req.refund_transaction_id}</strong></span>
              </div>
            )}

            {req.status === "replacement_dispatched" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex justify-between">
                <span>Courier: <strong>{req.replacement_courier_name}</strong></span>
                <span>Tracking AWB: <strong>{req.replacement_tracking_number}</strong></span>
              </div>
            )}

            {req.status === "rejected" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                <strong>Rejection Reason Sent:</strong> {req.rejection_reason}
              </div>
            )}

            {/* Admin Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 justify-end">
              {req.status === "pending" && (
                <>
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={handleApproveReturn}
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-xl bg-[#0c2c6d] text-white hover:bg-[#071d4a] text-xs font-semibold transition-all shadow-soft-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Return &amp; Send Dadar Address
                  </button>
                </>
              )}

              {req.status === "approved" && (
                <>
                  <button
                    onClick={() => setIsReplacementModalOpen(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Dispatch Replacement
                  </button>
                  <button
                    onClick={() => setIsRefundModalOpen(true)}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    Process Refund (COD / Online)
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Sub-Modal: Reject Return */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-slate-900">Reject Return Request</h3>
            <p className="text-xs text-slate-500">
              Provide the policy reason (e.g. 48 hours delivery window exceeded, item belongs to non-returnable sale or Dog Togs). An official notification email will be dispatched to the customer.
            </p>
            <textarea
              rows={3}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectReturn}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Process Refund */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-slate-900">Issue Refund</h3>
            <p className="text-xs text-slate-500">
              Record refund for returned item. An official confirmation email with bank timeline (3-5 days) will be sent.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Refund Amount (₹)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Payment Method</label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="cod">Cash on Delivery (UPI / Bank Transfer)</option>
                  <option value="online">Online Payment (Razorpay / Gateway)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Transaction / UTR Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. UTR2948210948 or rfnd_09123"
                  value={refundTxnId}
                  onChange={(e) => setRefundTxnId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessRefund}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Dispatch Replacement */}
      {isReplacementModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-slate-900">Dispatch Replacement</h3>
            <p className="text-xs text-slate-500">
              Enter courier partner and tracking AWB. Customer will be notified with shipment tracking details.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Courier Partner</label>
                <input
                  type="text"
                  placeholder="e.g. BlueDart / Delhivery / Surface Courier"
                  value={replacementCourier}
                  onChange={(e) => setReplacementCourier(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  placeholder="e.g. 78492019482"
                  value={replacementTracking}
                  onChange={(e) => setReplacementTracking(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReplacementModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchReplacement}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Send Replacement Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Image Fullscreen Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <img src={previewImage} alt="Enlarged proof" className="max-w-xl max-h-[85vh] rounded-2xl object-contain" />
        </div>
      )}
    </div>
  );
}
