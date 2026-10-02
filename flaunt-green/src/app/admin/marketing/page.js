"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Tag,
  Gift,
  Send,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Percent,
  X,
  RefreshCw,
  Search,
  User,
  Mail,
  FileText
} from "lucide-react";
import { couponsApi, adminApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";
import toast from "react-hot-toast";

export default function AdminMarketingPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "active" | "inactive" | "expired"
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 20;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [activeCouponForEmail, setActiveCouponForEmail] = useState(null);

  // Create Form State
  const [formData, setFormData] = useState({
    code: "",
    type: "percent",
    value: "",
    min_spend: "",
    max_discount: "",
    usage_limit: "",
    expires_at: "",
    description: "",
    is_active: true,
  });
  const [creating, setCreating] = useState(false);

  // Send Email State
  const [emailForm, setEmailForm] = useState({
    customer_name: "",
    customer_email: "",
    custom_message: "",
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch Coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponsApi.adminGetAll();
      setCoupons(res.data || []);
    } catch (err) {
      console.error("Failed to load coupons", err);
      toast.error("Failed to fetch coupons from server.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch registered users for quick autofill
  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      setRegisteredUsers(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchUsers();
  }, []);

  // Handle Create Coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.value) {
      toast.error("Please enter a valid coupon code and discount value.");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        min_spend: formData.min_spend ? parseFloat(formData.min_spend) : 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        expires_at: formData.expires_at ? formData.expires_at : null,
        description: formData.description.trim() || null,
        is_active: formData.is_active,
      };

      await couponsApi.adminCreate(payload);
      toast.success(`Coupon ${payload.code} created successfully!`);
      setIsCreateModalOpen(false);
      setFormData({
        code: "",
        type: "percent",
        value: "",
        min_spend: "",
        max_discount: "",
        usage_limit: "",
        expires_at: "",
        description: "",
        is_active: true,
      });
      fetchCoupons();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create coupon.";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  // Handle Delete Coupon
  const handleDeleteCoupon = async (id, code) => {
    if (!confirm(`Are you sure you want to delete promo code "${code}"?`)) return;

    try {
      await couponsApi.adminDelete(id);
      toast.success(`Promo code ${code} deleted.`);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error("Failed to delete coupon.");
    }
  };

  // Open Send Modal
  const openSendModal = (coupon) => {
    setActiveCouponForEmail(coupon);
    setEmailForm({
      customer_name: "",
      customer_email: "",
      custom_message: `Enjoy this exclusive discount code on your next purchase at Flaunt Green!`,
    });
    setIsSendModalOpen(true);
  };

  // Send Email Handler
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.customer_email || !emailForm.customer_name) {
      toast.error("Please provide both customer name and email address.");
      return;
    }

    setSendingEmail(true);
    try {
      const res = await couponsApi.adminSendEmail(activeCouponForEmail.id, emailForm);
      if (res.data?.success) {
        toast.success(res.data.message || `Code sent to ${emailForm.customer_email}!`);
        setIsSendModalOpen(false);
      } else {
        toast.error(res.data?.message || "Could not send email.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dispatch email.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Quick select registered customer
  const handleSelectCustomer = (e) => {
    const userId = e.target.value;
    if (!userId) return;
    const user = registeredUsers.find((u) => String(u.id) === String(userId));
    if (user) {
      setEmailForm((prev) => ({
        ...prev,
        customer_name: user.name || "",
        customer_email: user.email || "",
      }));
    }
  };

  const filtered = coupons.filter((c) => {
    const isExpired = c.expires_at && new Date(c.expires_at) < new Date();
    let statusMatch = true;
    if (filterStatus === "active") statusMatch = c.is_active && !isExpired;
    else if (filterStatus === "inactive") statusMatch = !c.is_active;
    else if (filterStatus === "expired") statusMatch = isExpired;

    const q = search.toLowerCase().trim();
    const searchMatch =
      !q ||
      c.code.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q));

    return statusMatch && searchMatch;
  });

  const paginatedCoupons = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-[#41542f]" />
            Marketing &amp; Promo Codes
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Create dynamic discount coupons, manage promotions, and directly email promo codes to your customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh coupons"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344325] transition-all shadow-soft-sm"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Coupons" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
            { id: "expired", label: "Expired" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterStatus(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                filterStatus === tab.id
                  ? "bg-[#41542f] text-white border-[#41542f] shadow-sm font-semibold"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#997b47]" /> All Promotional Coupons
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {filtered.length} coupon{filtered.length === 1 ? "" : "s"} found
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#41542f]" />
            <p className="text-sm">Loading promo codes from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Tag className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#41542f]" />
            <p className="text-base font-semibold text-slate-700">No promo codes found</p>
            <p className="text-xs text-slate-400 mt-1">No coupons match your filter or search criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedCoupons.map((c) => {
              const isExpired = c.expires_at && new Date(c.expires_at) < new Date();
              const discountDisplay =
                c.type === "percent" ? `${c.value}% OFF` : `₹${Number(c.value).toLocaleString("en-IN")} OFF`;

              return (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left: Code badge and description */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-mono font-bold text-sm tracking-wider px-3.5 py-1.5 rounded-xl bg-[#41542f]/10 text-[#41542f] border border-[#41542f]/20 shadow-xs">
                        {c.code}
                      </span>
                      {c.description && (
                        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">{c.description}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-slate-900">{discountDisplay}</p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            !c.is_active || isExpired
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {!c.is_active ? "Inactive" : isExpired ? "Expired" : "Active"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {c.min_spend > 0
                          ? `Min order: ₹${Number(c.min_spend).toLocaleString("en-IN")}`
                          : "No minimum spend"}
                        {c.expires_at && (
                          <span className="ml-2 text-slate-400">
                            • Expires {new Date(c.expires_at).toLocaleDateString("en-IN")}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right: Stats & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 justify-end">
                    <div className="text-right text-xs text-slate-500 mr-2 hidden sm:block">
                      <p className="font-semibold text-slate-700">{c.used_count || 0} used</p>
                      {c.usage_limit ? (
                        <p className="text-[11px] text-slate-400">Limit: {c.usage_limit}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">Unlimited</p>
                      )}
                    </div>

                    {/* Send Code via Email Button */}
                    <button
                      onClick={() => openSendModal(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-[#997b47] hover:bg-amber-100 border border-amber-200 text-xs font-semibold transition-all shadow-xs"
                      title="Send this code to customer via email"
                    >
                      <Send className="w-3.5 h-3.5" /> Send to Customer
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteCoupon(c.id, c.code)}
                      className="p-1.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODAL 1: Create Coupon */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#41542f]" />
                <h3 className="font-heading font-bold text-lg text-slate-900">Create New Coupon</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER25"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase tracking-wider focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f] bg-white"
                  >
                    <option value="percent">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Amount Discount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    {formData.type === "percent" ? "Percentage Value (%) *" : "Discount Amount (₹) *"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="1"
                    placeholder={formData.type === "percent" ? "e.g. 15" : "e.g. 500"}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Minimum Spend (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 1500 (0 for none)"
                    value={formData.min_spend}
                    onChange={(e) => setFormData({ ...formData, min_spend: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100 uses"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Description / Marketing Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special festive celebration discount"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#41542f] rounded border-slate-300 focus:ring-[#41542f]"
                />
                <label htmlFor="is_active" className="text-xs font-medium text-slate-700">
                  Activate this coupon code immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344325] transition-all shadow-soft-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {creating ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Send Coupon to Customer Email */}
      {isSendModalOpen && activeCouponForEmail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#997b47]" />
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Send Code <span className="font-mono text-[#41542f]">{activeCouponForEmail.code}</span>
                </h3>
              </div>
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              {/* Promo code summary banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-amber-900 text-sm">{activeCouponForEmail.code}</span>
                  <p className="text-xs text-amber-700">
                    {activeCouponForEmail.type === "percent"
                      ? `${activeCouponForEmail.value}% OFF`
                      : `₹${activeCouponForEmail.value} OFF`}
                    {activeCouponForEmail.min_spend > 0 && ` (Min ₹${activeCouponForEmail.min_spend})`}
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Ready to Dispatch
                </span>
              </div>

              {/* Quick autofill from registered customer list */}
              {registeredUsers.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Quick Select Registered Customer
                  </label>
                  <select
                    onChange={handleSelectCustomer}
                    defaultValue=""
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#41542f] bg-slate-50"
                  >
                    <option value="" disabled>-- Or pick from registered customers --</option>
                    {registeredUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Customer Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pratibha Sharma"
                    value={emailForm.customer_name}
                    onChange={(e) => setEmailForm({ ...emailForm, customer_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Customer Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@gmail.com"
                    value={emailForm.customer_email}
                    onChange={(e) => setEmailForm({ ...emailForm, customer_email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  We will send a beautifully branded promotional email with this coupon code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Custom Personal Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. As a valued customer, here is an exclusive treat for your next sustainable wardrobe piece!"
                  value={emailForm.custom_message}
                  onChange={(e) => setEmailForm({ ...emailForm, custom_message: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344325] transition-all shadow-soft-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Promo Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
