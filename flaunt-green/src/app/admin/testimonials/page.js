"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Star, Plus, X, Search, Edit2, Trash2, CheckCircle2, 
  MessageSquareQuote, Home, Dog, Globe, Sparkles, AlertCircle 
} from "lucide-react";
import toast from "react-hot-toast";
import { testimonialsApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";

const PAGE_OPTIONS = [
  { value: "home", label: "Home Page", icon: Home, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "dog_togs", label: "Dog Togs Page", icon: Dog, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "both", label: "Both Pages", icon: Globe, color: "bg-purple-50 text-purple-700 border-purple-200" },
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [counts, setCounts] = useState({ total: 0, home: 0, dog_togs: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [pageFilter, setPageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    rating: 5,
    quote: "",
    page: "home",
    is_active: true,
  });

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await testimonialsApi.adminGetAll();
      if (res.data) {
        setTestimonials(res.data.testimonials || []);
        if (res.data.counts) {
          setCounts(res.data.counts);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      city: "",
      rating: 5,
      quote: "",
      page: "home",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      city: item.city || "",
      rating: item.rating || 5,
      quote: item.quote || "",
      page: item.page || "home",
      is_active: Boolean(item.is_active),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error("Please fill in author name and quote");
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await testimonialsApi.update(editingItem.id, formData);
        toast.success("Testimonial updated successfully");
      } else {
        await testimonialsApi.create(formData);
        toast.success("Testimonial created successfully");
      }
      setIsModalOpen(false);
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await testimonialsApi.toggleActive(id);
      setTestimonials(prev =>
        prev.map(t => (t.id === id ? { ...t, is_active: !t.is_active } : t))
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await testimonialsApi.delete(id);
      toast.success("Testimonial deleted");
      await fetchTestimonials();
    } catch (err) {
      toast.error("Failed to delete testimonial");
    }
  };

  // Filtered testimonials
  const filtered = useMemo(() => {
    return testimonials.filter(t => {
      const matchSearch =
        !search.trim() ||
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.city?.toLowerCase().includes(search.toLowerCase()) ||
        t.quote?.toLowerCase().includes(search.toLowerCase());

      const matchPage =
        pageFilter === "all" ||
        (pageFilter === "both" ? t.page === "both" : t.page === pageFilter || t.page === "both");

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? t.is_active : !t.is_active);

      return matchSearch && matchPage && matchStatus;
    });
  }, [testimonials, search, pageFilter, statusFilter]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-heading">
            Customer Testimonials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage dynamic customer quotes displayed on the Home Page and Dog Togs page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold shadow-soft-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Testimonials</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{counts.total}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Home Page Reviews</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{counts.home}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Home className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block">Dog Togs Reviews</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{counts.dog_togs}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Dog className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search author, city, quote..."
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

        {/* Page Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { key: "all", label: "All Pages" },
            { key: "home", label: "🏠 Home Page" },
            { key: "dog_togs", label: "🐾 Dog Togs" },
            { key: "both", label: "🌐 Both" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setPageFilter(f.key);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                pageFilter === f.key
                  ? "border-[#41542f] bg-[#41542f] text-white shadow-sm font-semibold"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 bg-slate-50/50">
                <th className="px-4 py-3.5 font-semibold">Author</th>
                <th className="px-4 py-3.5 font-semibold">Rating</th>
                <th className="px-4 py-3.5 font-semibold">Quote</th>
                <th className="px-4 py-3.5 font-semibold">Display Page</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#41542f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading testimonials...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No testimonials found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const pageConfig = PAGE_OPTIONS.find(p => p.value === item.page) || PAGE_OPTIONS[0];
                  const PageIcon = pageConfig.icon;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Author */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        {item.city && (
                          <div className="text-xs text-slate-400">{item.city}</div>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-0.5">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#F5C518] text-[#F5C518]" />
                          ))}
                        </div>
                      </td>

                      {/* Quote */}
                      <td className="px-4 py-3.5 max-w-sm">
                        <p className="text-slate-600 line-clamp-2 text-xs italic">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </td>

                      {/* Target Page Badge */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${pageConfig.color}`}>
                          <PageIcon className="w-3 h-3" />
                          {pageConfig.label}
                        </span>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleActive(item.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.is_active ? "bg-[#41542f]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              item.is_active ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Edit Testimonial"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Testimonial"
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
        {filtered.length > PAGE_SIZE && (
          <div className="p-4 border-t border-slate-200">
            <AdminPagination
              currentPage={currentPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#FAF8F5] px-6 py-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#41542f]/10 text-[#41542f] flex items-center justify-center">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {editingItem ? "Edit Testimonial" : "Add Testimonial"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign placement to Home Page or Dog Togs Page
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Author Name & City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya M."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#41542f] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#41542f] outline-none"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Star Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: s })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          formData.rating >= s
                            ? "fill-[#F5C518] text-[#F5C518]"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 ml-2 font-medium">
                    {formData.rating} Stars
                  </span>
                </div>
              </div>

              {/* Target Page Selection (Crucial User Requirement) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Display On Page <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PAGE_OPTIONS.map((opt) => {
                    const isSelected = formData.page === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, page: opt.value })}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? "border-[#41542f] bg-[#41542f]/5 ring-2 ring-[#41542f]"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? "text-[#41542f]" : "text-slate-500"}`} />
                        <span className={`text-xs font-semibold ${isSelected ? "text-[#41542f]" : "text-slate-700"}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quote / Testimonial Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Testimonial Quote <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter the customer testimonial quote..."
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#41542f] outline-none resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_active_toggle"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-[#41542f] focus:ring-[#41542f]"
                />
                <label htmlFor="is_active_toggle" className="text-xs font-semibold text-slate-700">
                  Active (Visible on selected page)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#41542f] hover:bg-[#344326] text-white text-xs font-semibold shadow-soft-sm transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingItem ? "Update Testimonial" : "Create Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
