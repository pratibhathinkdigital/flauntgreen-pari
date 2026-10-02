"use client";

import { useState } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Building,
  Copy,
  Check,
  AlertCircle,
  Truck,
  IndianRupee,
  RotateCcw
} from "lucide-react";
import toast from "react-hot-toast";

const DADAR_ADDRESS = `Flaunt Green (Green Initiatives & Sustainable Solutions, An Initiative of Eco Ventures Private Limited)
9/10 Adi House, Vijay Manjrekar Marg, Gokhale Road (N), Dadar West, Mumbai – 400028, Maharashtra
Landmark: Opp. Portuguese Church`;

export default function ReturnStatusModal({ order, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order || !order.returnRequest) return null;

  const req = order.returnRequest;

  const copyAddress = () => {
    navigator.clipboard.writeText(DADAR_ADDRESS);
    setCopied(true);
    toast.success("Return address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (req.status) {
      case "approved":
        return {
          label: "Approved & Ready to Ship",
          cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
        };
      case "rejected":
        return {
          label: "Request Declined",
          cls: "bg-red-100 text-red-800 border-red-200",
          icon: AlertCircle,
        };
      case "refunded":
        return {
          label: "Refund Completed",
          cls: "bg-purple-100 text-purple-800 border-purple-200",
          icon: IndianRupee,
        };
      case "replacement_dispatched":
        return {
          label: "Replacement In Transit",
          cls: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Truck,
        };
      default:
        return {
          label: "Pending Team Review",
          cls: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock,
        };
    }
  };

  const badge = getStatusBadge();
  const Icon = badge.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-soft-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#41542f]/10 text-[#41542f] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Return Details #{order.id}
              </h3>
              <p className="text-xs text-slate-500">
                Submitted on {new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status Chip */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Status</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.cls}`}>
              <Icon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
          </div>

          {/* Reason */}
          <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-1">
            <p className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">Reason Reported</p>
            <p className="text-slate-900 font-semibold">
              {req.reason === "incorrect_size" ? "Incorrect Size Received" : "Incorrect Product Received"}
            </p>
            {req.customer_notes && (
              <p className="text-slate-500 italic mt-1">&quot;{req.customer_notes}&quot;</p>
            )}
          </div>

          {/* If Approved: Display Dadar Address */}
          {req.status === "approved" && (
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-700" />
                  Official Return Shipping Address
                </span>
                <button
                  onClick={copyAddress}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-slate-800 leading-relaxed font-mono">
                <strong>Flaunt Green</strong><br />
                (Green Initiatives &amp; Sustainable Solutions, An Initiative of Eco Ventures Private Limited)<br />
                9/10 Adi House, Vijay Manjrekar Marg,<br />
                Gokhale Road (N), Dadar West, Mumbai – 400028<br />
                Landmark: Opp. Portuguese Church<br />
                Order Ref: #{order.id}
              </div>

              <p className="text-[11px] text-emerald-800">
                ⚠️ <strong>Reminder:</strong> Please ensure the item is unworn, unwashed, and unscented with tags intact and securely packed.
              </p>
            </div>
          )}

          {/* If Rejected: Display Reason */}
          {req.status === "rejected" && (
            <div className="border border-red-200 bg-red-50/50 rounded-2xl p-4 text-xs space-y-1.5">
              <p className="font-bold text-red-900 uppercase tracking-wide text-[11px]">Rejection Reason</p>
              <p className="text-red-800 leading-relaxed">
                {req.rejection_reason || "Does not satisfy slow-fashion small-batch return eligibility criteria."}
              </p>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-red-100">
                For further clarification, please write to us at <a href="mailto:support@flauntgreen.in" className="text-[#41542f] font-semibold underline">support@flauntgreen.in</a>.
              </p>
            </div>
          )}

          {/* If Refunded */}
          {req.status === "refunded" && (
            <div className="border border-purple-200 bg-purple-50/50 rounded-2xl p-4 text-xs space-y-2">
              <p className="font-bold text-purple-900 uppercase tracking-wide text-[11px]">Refund Details</p>
              <div className="flex justify-between items-center text-sm font-bold text-purple-950">
                <span>Refunded Amount:</span>
                <span>₹{Number(req.refund_amount || order.total).toLocaleString("en-IN")}</span>
              </div>
              {req.refund_transaction_id && (
                <div className="flex justify-between items-center text-xs text-purple-800">
                  <span>Transaction / UTR Ref:</span>
                  <span className="font-mono">{req.refund_transaction_id}</span>
                </div>
              )}
              <p className="text-[11px] text-purple-700">
                Amount will reflect in your account within 3-5 business days.
              </p>
            </div>
          )}

          {/* If Replacement Dispatched */}
          {req.status === "replacement_dispatched" && (
            <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-4 text-xs space-y-2">
              <p className="font-bold text-blue-900 uppercase tracking-wide text-[11px]">Replacement Tracking</p>
              <div className="flex justify-between items-center text-xs text-blue-900">
                <span>Courier:</span>
                <strong>{req.replacement_courier_name || "Surface Courier"}</strong>
              </div>
              <div className="flex justify-between items-center text-xs text-blue-900">
                <span>Tracking Number:</span>
                <strong className="font-mono text-[#41542f]">{req.replacement_tracking_number}</strong>
              </div>
              <p className="text-[11px] text-blue-700">
                Estimated delivery in 3-5 business days.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
