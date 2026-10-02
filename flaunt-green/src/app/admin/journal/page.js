"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Search, X } from "lucide-react";
import { journalApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";
import toast from "react-hot-toast";
import JournalForm from "./JournalForm";

const TYPE_LABELS = {
  blog: { label: "Blog", color: "bg-blue-100 text-blue-700" },
  "social-outreach": { label: "Social Outreach", color: "bg-green-100 text-green-700" },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

export default function AdminJournalPage() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "published" | "draft"
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 20;

  const fetchJournals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await journalApi.adminGetAll();
      setJournals(res.data || []);
    } catch (err) {
      toast.error("Failed to load journal posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJournals(); }, [fetchJournals]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this journal post? This cannot be undone.")) return;
    try {
      await journalApi.delete(id);
      toast.success("Post deleted.");
      fetchJournals();
    } catch (err) {
      toast.error("Failed to delete post.");
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditing(null);
    fetchJournals();
  };

  const filtered = journals.filter((j) => {
    const matchType = typeFilter === "all" || j.type === typeFilter;
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
        ? !!j.is_published
        : !j.is_published;

    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      j.title?.toLowerCase().includes(q) ||
      j.excerpt?.toLowerCase().includes(q) ||
      j.slug?.toLowerCase().includes(q);

    return matchType && matchStatus && matchSearch;
  });

  const paginatedJournals = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (showForm) {
    return (
      <JournalForm
        journal={editing}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-800">Journal</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage Blogs &amp; Social Outreach posts</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#41542f] text-white rounded-xl text-sm font-semibold hover:bg-[#344326] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Posts", value: journals.length },
          { label: "Blogs", value: journals.filter((j) => j.type === "blog").length },
          { label: "Social Outreach", value: journals.filter((j) => j.type === "social-outreach").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts by title or excerpt..."
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

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: "all", label: "All Types" },
              { id: "blog", label: "Blogs" },
              { id: "social-outreach", label: "Outreach" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTypeFilter(t.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === t.id
                    ? "bg-[#41542f] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: "all", label: "All Status" },
              { id: "published", label: "Live" },
              { id: "draft", label: "Draft" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setStatusFilter(s.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s.id
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading posts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-4">No journal posts found.</p>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="px-4 py-2 bg-[#41542f] text-white rounded-xl text-sm font-semibold hover:bg-[#344326]"
            >
              Add First Post
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Post</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Published</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedJournals.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {j.image_url ? (
                        <img
                          src={j.image_url}
                          alt={j.title}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate max-w-[200px] lg:max-w-xs">{j.title}</p>
                        {j.excerpt && (
                          <p className="text-xs text-slate-400 truncate max-w-[200px] lg:max-w-xs mt-0.5">{j.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_LABELS[j.type]?.color}`}>
                      {TYPE_LABELS[j.type]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">{formatDate(j.published_at)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${j.is_published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {j.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {j.is_published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditing(j); setShowForm(true); }}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
