"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { collectionsApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";
import toast from "react-hot-toast";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await collectionsApi.adminGetAll();
      setCollections(res.data);
    } catch (err) {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await collectionsApi.update(editingId, formData);
        toast.success("Collection updated");
      } else {
        await collectionsApi.create(formData);
        toast.success("Collection created");
      }
      setShowForm(false);
      fetchCollections();
    } catch (err) {
      toast.error("Error saving collection");
    }
  };

  const handleEdit = (col) => {
    setFormData({ name: col.name, description: col.description || "" });
    setEditingId(col.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;
    try {
      await collectionsApi.delete(id);
      toast.success("Collection deleted");
      fetchCollections();
    } catch (err) {
      toast.error("Error deleting collection");
    }
  };

  const filtered = collections.filter((col) => {
    const query = search.toLowerCase();
    return (
      !search ||
      col.name?.toLowerCase().includes(query) ||
      col.slug?.toLowerCase().includes(query) ||
      col.description?.toLowerCase().includes(query)
    );
  });

  const paginatedCollections = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Collections</h1>
          <p className="text-sm text-text-muted mt-1">{collections.length} collections configured</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: "", description: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#41542f] text-white text-sm font-semibold hover:bg-[#344326] transition-colors shadow-brand"
        >
          <Plus className="w-4 h-4" /> Add Collection
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft mb-6 space-y-4">
          <h2 className="font-bold">{editingId ? "Edit Collection" : "Add Collection"}</h2>
          <div>
            <label className="block text-sm mb-1 font-semibold text-slate-700">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#997b47]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold text-slate-700">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#997b47]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#41542f] text-white font-semibold rounded-xl hover:bg-[#344326]"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-soft-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search collections by name, slug..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]"
          />
        </div>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setCurrentPage(1); }}
            className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl"
          >
            Clear Search
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold">Slug</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Loading collections...</td></tr>
            ) : paginatedCollections.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No collections found matching search.</td></tr>
            ) : (
              paginatedCollections.map(col => (
                <tr key={col.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{col.name}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{col.description || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{col.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(col)} className="p-1.5 text-slate-400 hover:text-[#41542f] mr-1" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(col.id)} className="p-1.5 text-slate-400 hover:text-red-500" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 20 per page AdminPagination */}
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
