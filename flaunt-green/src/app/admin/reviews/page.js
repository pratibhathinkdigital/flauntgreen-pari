"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Star, Pencil, Trash2, Eye, EyeOff, Plus, X, Check, Search,
  CheckCircle2, Clock, AlertCircle, Sparkles, MessageSquare,
  ShieldCheck, RefreshCw, Filter, ArrowUpDown, ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import { reviewService } from "@/services/reviewService";
import { reviewsApi } from "@/services/api";
import { ADMIN_PRODUCT_OPTIONS, PRODUCT_NAMES } from "@/data/productNames";
import AdminPagination from "@/components/admin/AdminPagination";
import { getImageUrl } from "@/lib/axios";

const STATUS_META = {
  approved: {
    label: "Approved & Live",
    badgeCls: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    dotCls: "bg-emerald-500",
  },
  pending: {
    label: "Pending Moderation",
    badgeCls: "bg-amber-50 text-amber-800 border border-amber-200/80",
    dotCls: "bg-amber-500",
  },
  hidden: {
    label: "Hidden",
    badgeCls: "bg-rose-50 text-rose-700 border border-rose-200/80",
    dotCls: "bg-rose-500",
  },
};

function Stars({ rating, size = "w-4 h-4", onChange, interactive = false }) {
  const [hover, setHover] = useState(0);
  const active = (interactive && hover) || rating || 0;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-transform ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`${size} ${
              s <= active
                ? "fill-[#997b47] text-[#997b47] drop-shadow-xs"
                : "text-slate-200 fill-slate-100"
            }`}
          />
        </button>
      ))}
    </span>
  );
}

function ReviewFormModal({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState({
    productSlug: "triangle-dress",
    author: "",
    email: "",
    rating: 5,
    title: "",
    body: "",
    status: "approved",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        productSlug: initial.productSlug || "triangle-dress",
        author: initial.author || "",
        email: initial.email || "",
        rating: initial.rating || 5,
        title: initial.title || "",
        body: initial.body || "",
        status: initial.status || "approved",
      });
    } else {
      setForm({
        productSlug: "triangle-dress",
        author: "",
        email: "",
        rating: 5,
        title: "",
        body: "",
        status: "approved",
      });
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author.trim() || !form.body.trim()) {
      toast.error("Author name and review content are required.");
      return;
    }
    const productName = PRODUCT_NAMES[form.productSlug] || form.productSlug;
    setSaving(true);
    try {
      await onSave({
        ...form,
        productName,
        author: form.author.trim(),
        title: form.title.trim(),
        body: form.body.trim(),
      });
      toast.success(initial ? "Review updated successfully." : "Review added successfully.");
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 rounded-xl bg-white focus:outline-none focus:border-[#0a2560] focus:ring-2 focus:ring-[#0a2560]/10 transition-all";
  const labelCls = "block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100" style={{ maxHeight: "92vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0a2560]/10 text-[#0a2560] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                {initial ? "Edit Customer Review" : "Create Verified Review"}
              </h2>
              <p className="text-xs text-slate-500">Flaunt Green product feedback management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(92vh - 140px)" }}>
          <div>
            <label className={labelCls}>Product</label>
            <select
              className={inputCls}
              value={form.productSlug}
              onChange={(e) => setForm({ ...form, productSlug: e.target.value })}
            >
              {ADMIN_PRODUCT_OPTIONS.map((opt) => (
                <option key={opt.slug} value={opt.slug}>
                  {opt.label} ({opt.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Customer Name *</label>
              <input
                type="text"
                className={inputCls}
                placeholder="e.g. Ananya Mehra"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Customer Email</label>
              <input
                type="email"
                className={inputCls}
                placeholder="ananya@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Star Rating</label>
            <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
              <Stars rating={form.rating} size="w-6 h-6" onChange={(r) => setForm({ ...form, rating: r })} interactive />
              <span className="text-xs font-bold text-[#997b47]">{form.rating} out of 5 Stars</span>
            </div>
          </div>

          <div>
            <label className={labelCls}>Review Headline / Title</label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. Exquisite organic texture and flawless drape!"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className={labelCls}>Review Body *</label>
            <textarea
              rows={4}
              className={inputCls}
              placeholder="Write the customer's detailed experience with the garment..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Publish Status</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="approved">Approved &amp; Live — Published on product page</option>
              <option value="pending">Pending — Awaiting moderation review</option>
              <option value="hidden">Hidden — Hidden from store</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0a2560] hover:bg-[#071d4a] rounded-xl shadow-soft-sm hover:shadow-soft transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : initial ? (
                "Save Changes"
              ) : (
                "Publish Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [counts, setCounts] = useState({ total: 0, approved: 0, pending: 0, hidden: 0 });
  const [filter, setFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 12;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.adminGetAll();
      if (res.data && res.data.reviews) {
        const mapped = res.data.reviews.map((r) => ({
          id: r.id,
          productSlug: r.product_slug,
          productName: r.product_name,
          author: r.name,
          email: r.email,
          rating: Number(r.rating) || 5,
          title: r.title,
          body: r.body,
          images: r.images || [],
          status: r.status,
          verified: Boolean(r.is_verified),
          date: (r.created_at || "").slice(0, 10),
          createdAt: r.created_at,
        }));
        setReviews(mapped);
        if (res.data.counts) {
          setCounts(res.data.counts);
        }
        return;
      }
    } catch (err) {
      console.warn("Backend reviews fetch error, using local fallback:", err);
    } finally {
      setLoading(false);
    }
    const local = reviewService.getAll();
    setReviews(local);
    setCounts(reviewService.getStatusCounts());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Compute average rating from approved reviews
  const approvedList = reviews.filter((r) => r.status === "approved");
  const avgRating =
    approvedList.length > 0
      ? (approvedList.reduce((acc, curr) => acc + curr.rating, 0) / approvedList.length).toFixed(1)
      : "5.0";

  const filtered = reviews.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchRating = ratingFilter === "all" || Number(r.rating) === Number(ratingFilter);
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      r.author?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.productName?.toLowerCase().includes(q) ||
      r.productSlug?.toLowerCase().includes(q) ||
      r.title?.toLowerCase().includes(q) ||
      r.body?.toLowerCase().includes(q);

    return matchStatus && matchRating && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  const paginatedReviews = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleApprove = async (id) => {
    try {
      await reviewsApi.updateStatus(id, "approved");
    } catch (err) {
      console.warn("Failed to approve in backend:", err);
    }
    reviewService.setStatus(id, "approved");
    toast.success("Review approved and live on product page.");
    await refresh();
  };

  const handleHide = async (id) => {
    try {
      await reviewsApi.updateStatus(id, "hidden");
    } catch (err) {
      console.warn("Failed to hide in backend:", err);
    }
    reviewService.setStatus(id, "hidden");
    toast.success("Review marked as hidden.");
    await refresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this customer review?")) return;
    try {
      await reviewsApi.delete(id);
    } catch (err) {
      console.warn("Failed to delete in backend:", err);
    }
    reviewService.remove(id);
    toast.success("Review deleted.");
    await refresh();
  };

  const handleSave = async (payload) => {
    if (editing) {
      reviewService.update(editing.id, payload);
    } else {
      await reviewService.create(payload);
    }
    setEditing(null);
    await refresh();
  };

  const statCards = [
    {
      label: "Total Reviews",
      value: counts.total,
      sub: "All customer submissions",
      icon: MessageSquare,
      color: "from-[#0a2560] to-[#5b7342]",
      badge: "Total",
    },
    {
      label: "Approved & Live",
      value: counts.approved,
      sub: "Visible on store pages",
      icon: CheckCircle2,
      color: "from-emerald-700 to-emerald-600",
      badge: "Active",
    },
    {
      label: "Pending Moderation",
      value: counts.pending,
      sub: counts.pending > 0 ? "Needs your attention" : "All caught up",
      icon: Clock,
      color: "from-amber-600 to-amber-500",
      badge: counts.pending > 0 ? `${counts.pending} New` : "Clear",
    },
    {
      label: "Average Rating",
      value: `${avgRating} ★`,
      sub: `From ${approvedList.length} live reviews`,
      icon: Star,
      color: "from-[#997b47] to-[#bfa063]",
      badge: "Score",
    },
  ];

  const filterTabs = [
    { key: "all", label: "All Reviews", count: counts.total },
    { key: "approved", label: "Approved", count: counts.approved },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "hidden", label: "Hidden", count: counts.hidden },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a2560] to-[#5a7442] flex items-center justify-center text-white shadow-soft">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-slate-900">Customer Reviews</h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-[#997b47] border border-amber-200/60">
                Moderation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review customer testimonials, verify authenticity, and publish reviews to product pages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-soft-xs disabled:opacity-50"
            title="Refresh reviews"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#0a2560] hover:bg-[#071d4a] rounded-xl shadow-soft-sm hover:shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Verified Review
          </button>
        </div>
      </div>

      {/* Luxury Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-3xl border border-slate-100 p-5 shadow-soft-sm relative overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-soft-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                  {card.badge}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">{card.value}</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{card.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-soft-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, product, review keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-[#0a2560] focus:ring-2 focus:ring-[#0a2560]/10 bg-slate-50/50"
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

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Star Rating Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Rating:</span>
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white font-medium focus:outline-none focus:border-[#0a2560]"
              >
                <option value="all">All Stars</option>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★</option>
                <option value="3">3 Stars ★★★</option>
                <option value="2">2 Stars ★★</option>
                <option value="1">1 Star ★</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white font-medium focus:outline-none focus:border-[#0a2560]"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {filterTabs.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-xs rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                filter === f.key
                  ? "bg-[#0a2560] text-white shadow-soft-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === f.key ? "bg-white/20 text-white" : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[880px]">
            <thead>
              <tr className="border-b border-slate-100 bg-[#FAF8F5]/80 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Moderate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-xs text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0a2560]" />
                    Loading reviews...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="text-sm font-semibold text-slate-600">No reviews found</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing your search keywords or filter options.</p>
                  </td>
                </tr>
              ) : (
                paginatedReviews.map((r) => {
                  const meta = STATUS_META[r.status] || STATUS_META.pending;
                  const initialLetter = (r.author || "A")[0].toUpperCase();
                  return (
                    <tr key={r.id} className="align-top hover:bg-slate-50/60 transition-colors">
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-[#997b47] font-bold text-sm flex items-center justify-center border border-amber-200/60 shrink-0">
                            {initialLetter}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{r.author}</p>
                            {r.email && (
                              <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{r.email}</p>
                            )}
                            {r.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                                <ShieldCheck className="w-3 h-3" /> Verified Buyer
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {r.productName || PRODUCT_NAMES[r.productSlug] || r.productSlug}
                        </p>
                        <span className="font-mono text-[10px] text-slate-400">slug: {r.productSlug}</span>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <Stars rating={r.rating} size="w-3.5 h-3.5" />
                          <span className="block text-[11px] font-bold text-[#997b47]">{r.rating}.0 / 5.0</span>
                        </div>
                      </td>

                      {/* Review Content */}
                      <td className="px-6 py-4 max-w-sm">
                        {r.title && (
                          <p className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{r.title}</p>
                        )}
                        <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">{r.body}</p>

                        {/* Attached customer images */}
                        {r.images && r.images.length > 0 && (
                          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                            {r.images.map((img, idx) => {
                              const src = getImageUrl(img);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSelectedImage(src)}
                                  className="relative group rounded-xl overflow-hidden border border-slate-200 hover:border-[#0a2560] transition-all shadow-soft-xs"
                                  title="Click to zoom image"
                                >
                                  <img
                                    src={src}
                                    alt="Review thumbnail"
                                    className="w-10 h-10 object-cover group-hover:scale-110 transition-transform"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.badgeCls}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dotCls}`} />
                          {meta.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(`${r.date}T00:00:00`).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status !== "approved" && (
                            <button
                              onClick={() => handleApprove(r.id)}
                              title="Approve & Publish"
                              className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors shadow-soft-xs"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {r.status !== "hidden" && (
                            <button
                              onClick={() => handleHide(r.id)}
                              title="Hide from store"
                              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}
                          {r.status === "hidden" && (
                            <button
                              onClick={() => handleApprove(r.id)}
                              title="Unhide & Publish"
                              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditing(r);
                              setModalOpen(true);
                            }}
                            title="Edit Review"
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            title="Delete permanently"
                            className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 bg-[#FAF8F5]/50">
          <AdminPagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Review Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-soft hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Full size review attachment"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Add / Edit Review Modal */}
      <ReviewFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  );
}