"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { categoriesApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", section: "her", description: "" });
  const [editingId, setEditingId] = useState(null);

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.adminGetAll();
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
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
        await categoriesApi.update(editingId, formData);
        toast.success("Category updated");
      } else {
        await categoriesApi.create(formData);
        toast.success("Category created");
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      toast.error("Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, section: cat.section, description: cat.description || "" });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await categoriesApi.delete(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Error deleting category");
    }
  };

  const filtered = categories.filter((c) => {
    const matchSection = sectionFilter === "all" || c.section?.toLowerCase() === sectionFilter.toLowerCase();
    const query = search.toLowerCase();
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(query) ||
      c.slug?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query);
    return matchSection && matchSearch;
  });

  const paginatedCategories = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Categories</h1>
          <p className="text-sm text-text-muted mt-1">{categories.length} categories configured</p>
        </div>
        <button onClick={() => { setFormData({ name: "", section: "her", description: "" }); setEditingId(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#41542f] text-white text-sm font-semibold hover:bg-[#344326] transition-colors shadow-brand">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft mb-6 space-y-4">
          <h2 className="font-bold">{editingId ? "Edit Category" : "Add Category"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="block text-sm mb-1">Section</label>
              <select name="section" value={formData.section} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200">
                <option value="her">Her</option>
                <option value="him">Him</option>
                <option value="unisex">Unisex</option>
                <option value="dog-togs">Dog Togs</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#41542f] text-white rounded-xl">Save</button>
          </div>
        </form>
      )}

      {/* Search & Section Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-soft-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search category name, slug, description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sectionFilter}
            onChange={(e) => { setSectionFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#997b47] bg-white"
          >
            <option value="all">All Sections</option>
            <option value="her">Her</option>
            <option value="him">Him</option>
            <option value="unisex">Unisex</option>
            <option value="dog-togs">Dog Togs</option>
          </select>

          {(search || sectionFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSectionFilter("all");
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Loading categories...</td></tr>
            ) : paginatedCategories.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No categories found matching filters.</td></tr>
            ) : (
              paginatedCategories.map((cat) => (
                <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{cat.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-slate-100 text-slate-700">
                      {cat.section}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{cat.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(cat)} className="p-1.5 text-slate-400 hover:text-[#41542f] mr-1" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-slate-400 hover:text-red-500" title="Delete">
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
