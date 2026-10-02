"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Package, Tag, Image as ImageIcon, Pencil, Trash2, Eye, EyeOff, Filter } from "lucide-react";
import { productsApi, categoriesApi, collectionsApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";
import AdminProductForm from "./AdminProductForm";
import AdminPagination from "@/components/admin/AdminPagination";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [collection, setCollection] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [dbCategories, setDbCategories] = useState([]);
  const [dbCollections, setDbCollections] = useState([]);

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, colRes] = await Promise.all([
        productsApi.adminGetAll(),
        categoriesApi.getAll(),
        collectionsApi.getAll()
      ]);
      setProducts(prodRes.data);
      setDbCategories(catRes.data);
      setDbCollections(colRes.data);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = ["All", ...new Set(dbCategories.map(c => c.name))];
  const COLLECTIONS = ["All", ...new Set(dbCollections.map(c => c.name))];

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category?.name === category;
    const matchCol = collection === "All" || p.collection?.name === collection;
    const matchStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? p.is_active
        : !p.is_active;
    const matchFeatured =
      featuredFilter === "All"
        ? true
        : featuredFilter === "Featured"
        ? p.is_featured
        : !p.is_featured;

    const query = search.toLowerCase();
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(query) ||
      p.slug?.toLowerCase().includes(query) ||
      p.sku?.toLowerCase().includes(query) ||
      p.fabric?.toLowerCase().includes(query);

    return matchCat && matchCol && matchStatus && matchFeatured && matchSearch;
  });

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleStatus = async (id) => {
    try {
      await productsApi.toggleStatus(id);
      setProducts((prev) => prev.map((p) =>
        p.id === id ? { ...p, is_active: !p.is_active } : p
      ));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await productsApi.toggleFeatured(id);
      setProducts((prev) => prev.map((p) =>
        p.id === id ? { ...p, is_featured: !p.is_featured } : p
      ));
      toast.success("Featured status updated");
    } catch (err) {
      toast.error("Failed to update featured status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productsApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchData();
  };

  if (showForm) {
    return (
      <AdminProductForm
        product={editingProduct}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Products</h1>
          <p className="text-sm text-text-muted mt-1">{products.length} products in catalog</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#41542f] text-white text-sm font-semibold hover:bg-[#344326] transition-colors shadow-brand">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: products.length },
          { label: "Active",         value: products.filter((p) => p.is_active).length },
          { label: "Featured",       value: products.filter((p) => p.is_featured).length },
          { label: "Out of Stock",   value: products.filter((p) => p.variants?.every(v => v.stock === 0)).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm px-5 py-4">
            <p className="text-2xl font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-soft-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, slug, SKU, fabric..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#997b47] bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
              ))}
            </select>

            {/* Collection */}
            <select
              value={collection}
              onChange={(e) => { setCollection(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#997b47] bg-white"
            >
              {COLLECTIONS.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Collections" : c}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#997b47] bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>

            {/* Featured */}
            <select
              value={featuredFilter}
              onChange={(e) => { setFeaturedFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#997b47] bg-white"
            >
              <option value="All">All Featured</option>
              <option value="Featured">Featured Only</option>
              <option value="Standard">Standard Only</option>
            </select>

            {(search || category !== "All" || collection !== "All" || statusFilter !== "All" || featuredFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setCollection("All");
                  setStatusFilter("All");
                  setFeaturedFilter("All");
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Stock</th>
                <th className="px-4 py-3 text-left font-semibold">Featured</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Loading products...</td></tr>
              ) : paginatedProducts.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">No products found matching filters.</td></tr>
              ) : (
                paginatedProducts.map((p) => {
                  const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                  const primaryImage = getImageUrl(
                    p.primary_image?.image_url || p.images?.[0]?.image_url,
                    null
                  );
                  
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors align-middle">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden relative">
                            {primaryImage ? (
                              <img src={primaryImage} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary text-xs">{p.name}</p>
                            <p className="text-[11px] text-text-muted font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#f7ece6] text-[#997b47] font-medium">{p.category?.name || 'Uncategorized'}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-text-primary">₹{Number(p.price).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${totalStock === 0 ? "text-red-500" : totalStock <= 5 ? "text-amber-600" : "text-emerald-600"}`}>
                          {totalStock === 0 ? "Out of Stock" : `${totalStock} units`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFeatured(p.id)}
                          className={`w-8 h-5 rounded-full transition-all relative ${p.is_featured ? "bg-[#997b47]" : "bg-slate-200"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${p.is_featured ? "left-3.5" : "left-0.5"}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {p.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#41542f]" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleStatus(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#997b47]"
                            title={p.is_active ? "Hide" : "Show"}
                          >
                            {p.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
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
