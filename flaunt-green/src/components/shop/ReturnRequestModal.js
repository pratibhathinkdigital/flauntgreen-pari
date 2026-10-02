"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  HelpCircle,
  Truck,
  RotateCcw,
  IndianRupee
} from "lucide-react";
import { returnsApi } from "@/services/api";
import toast from "react-hot-toast";

export default function ReturnRequestModal({ order, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState("incorrect_size");
  const [selectedItems, setSelectedItems] = useState(
    order?.items?.map((item, idx) => ({ ...item, selected: idx === 0 })) || []
  );
  const [customerNotes, setCustomerNotes] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUnwornChecked, setIsUnwornChecked] = useState(false);
  const [isTagsChecked, setIsTagsChecked] = useState(false);
  const [isPackagedChecked, setIsPackagedChecked] = useState(false);

  // COD Bank / UPI Details
  const [upiId, setUpiId] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const isCod = order.rawPaymentMethod === "cod" || order.paymentMethod?.toLowerCase().includes("cash");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 4) {
      toast.error("You can upload a maximum of 4 proof images.");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleItemSelection = (index) => {
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsToReturn = selectedItems.filter((i) => i.selected);
    if (itemsToReturn.length === 0) {
      toast.error("Please select at least one item to return.");
      return;
    }

    if (!isUnwornChecked || !isTagsChecked || !isPackagedChecked) {
      toast.error("Please confirm all garment condition checklists before proceeding.");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least 1 clear photo proving the incorrect size or product issue.");
      return;
    }

    if (isCod && !upiId.trim() && (!accountNumber.trim() || !ifsc.trim())) {
      toast.error("For COD orders, please provide a UPI ID or Bank Account Details for refund processing.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("reason", reason);
      formData.append("customer_notes", customerNotes);

      // Append selected items
      itemsToReturn.forEach((item, index) => {
        formData.append(`items[${index}][name]`, item.name);
        formData.append(`items[${index}][size]`, item.size || "");
        formData.append(`items[${index}][color]`, item.color || "");
        formData.append(`items[${index}][quantity]`, item.qty || 1);
        formData.append(`items[${index}][price]`, item.price || 0);
      });

      // Append images
      images.forEach((file) => {
        formData.append("images[]", file);
      });

      // Append COD details if applicable
      if (isCod) {
        if (upiId.trim()) formData.append("refund_account_details[upi_id]", upiId.trim());
        if (accountHolder.trim()) formData.append("refund_account_details[account_holder]", accountHolder.trim());
        if (accountNumber.trim()) formData.append("refund_account_details[account_number]", accountNumber.trim());
        if (ifsc.trim()) formData.append("refund_account_details[ifsc]", ifsc.trim().toUpperCase());
      }

      await returnsApi.create(order.rawId || order.id, formData);
      toast.success("Return request submitted! Our QC team will review your photos within 24 hours.");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit return request. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-soft-2xl my-8 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#41542f]/10 text-[#41542f] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Request Return / Exchange
              </h2>
              <p className="text-xs text-slate-500">
                Order #{order.id} &bull; Delivered on {order.date}
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

        {/* Policy Notice Box */}
        <div className="p-6 pb-0">
          <div className="bg-[#FAF8F5] border border-[#d4cbbd]/60 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-[#41542f] mb-1.5 uppercase tracking-wide">
              <span>🌿 Flaunt Green Slow-Fashion Policy</span>
            </div>
            <p>
              We craft garments in thoughtful, small batches with rigorous in-house quality checks. Returns or exchanges are accepted <strong>strictly within 48 hours of delivery</strong> and solely for <strong>Incorrect Product</strong> or <strong>Incorrect Size</strong> received.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Reason for Return / Exchange <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "incorrect_size", title: "Incorrect Size Received", desc: "Garment size tag differs from order" },
                { id: "incorrect_product", title: "Incorrect Product Received", desc: "Wrong article/color delivered" },
              ].map((r) => (
                <div
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    reason === r.id
                      ? "border-[#41542f] bg-[#41542f]/5 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{r.title}</span>
                    <input
                      type="radio"
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                      className="accent-[#41542f]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Select Items */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Affected Item(s) <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
              {selectedItems.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItemSelection(idx)}
                      className="accent-[#41542f] rounded w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Size: {item.size} &bull; Color: {item.color} &bull; Qty: {item.qty}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">₹{item.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Proof Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Clear Proof Photos <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Max 4 photos (Tag / Product)</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={preview} alt="Proof" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-90 hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 4 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-[#41542f] flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all p-2 text-center">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-600">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* COD Bank Details (if Cash on Delivery) */}
          {isCod && (
            <div className="border border-amber-200 bg-amber-50/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                <IndianRupee className="w-4 h-4" />
                <span>COD Refund Details (If item is out of stock)</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                If the replacement item is unavailable, we will initiate a direct refund. Please share your UPI ID or Bank Account Details:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">UPI ID (e.g. user@okhdfcbank)</label>
                  <input
                    type="text"
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#41542f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Full Name as in Bank"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#41542f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    placeholder="Bank Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#41542f]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#41542f] uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Customer Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Issue Description / Comments (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Describe the discrepancy (e.g., Ordered size M but received size L)..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#41542f]"
            />
          </div>

          {/* Checklist */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Mandatory Condition Checklist
            </p>
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isUnwornChecked}
                onChange={(e) => setIsUnwornChecked(e.target.checked)}
                className="mt-0.5 accent-[#41542f] rounded"
              />
              <span>The garment is <strong>unworn, unwashed, and unscented</strong> in pristine condition.</span>
            </label>
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isTagsChecked}
                onChange={(e) => setIsTagsChecked(e.target.checked)}
                className="mt-0.5 accent-[#41542f] rounded"
              />
              <span>All original brand tags, invoice, and labels are intact.</span>
            </label>
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isPackagedChecked}
                onChange={(e) => setIsPackagedChecked(e.target.checked)}
                className="mt-0.5 accent-[#41542f] rounded"
              />
              <span>The product will be shipped in its original protective packaging.</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344326] transition-all shadow-soft-sm disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? "Submitting Request..." : "Submit Return Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
