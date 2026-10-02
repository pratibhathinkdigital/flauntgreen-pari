"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { seoApi } from "@/services/api";

export default function AdminSeoPage() {
  const [seos, setSeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ route: "", title: "", description: "", keywords: "", og_image: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSeos();
  }, []);

  const fetchSeos = async () => {
    setLoading(true);
    try {
      const res = await seoApi.adminGetAll();
      setSeos(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  };

  const filteredSeos = seos.filter(s => 
    s.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (seo = null) => {
    if (seo) {
      setEditingId(seo.id);
      setFormData({
        route: seo.route,
        title: seo.title,
        description: seo.description || "",
        keywords: seo.keywords || "",
        og_image: seo.og_image || "",
      });
    } else {
      setEditingId(null);
      setFormData({ route: "", title: "", description: "", keywords: "", og_image: "" });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.route || !formData.title) return toast.error("Route and Title are required");
    
    setSubmitting(true);
    try {
      if (editingId) {
        await seoApi.adminUpdate(editingId, formData);
        toast.success("SEO updated");
      } else {
        await seoApi.adminCreate(formData);
        toast.success("SEO added");
      }
      setModalOpen(false);
      fetchSeos();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this SEO rule?")) return;
    try {
      await seoApi.adminDelete(id);
      toast.success("Deleted");
      fetchSeos();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage title and meta tags for specific routes (e.g., /shop, /about)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add SEO Rule
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes or titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B08D3F]/20 focus:border-[#B08D3F]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Route Path</th>
                <th className="px-6 py-4">Meta Title</th>
                <th className="px-6 py-4">Meta Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading SEO rules...
                  </td>
                </tr>
              ) : filteredSeos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No SEO rules found. Add one to get started.
                  </td>
                </tr>
              ) : (
                filteredSeos.map((seo) => (
                  <tr key={seo.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-900">{seo.route}</td>
                    <td className="px-6 py-4 font-medium">{seo.title}</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{seo.description || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(seo)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(seo.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? "Edit SEO Rule" : "New SEO Rule"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Path *</label>
                <select
                  required
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B08D3F]/20 focus:border-[#B08D3F] bg-white"
                >
                  <option value="" disabled>Select a page route</option>
                  <option value="/">Home (/)</option>
                  <option value="/shop">Shop All (/shop)</option>
                  <option value="/her">Women's (/her)</option>
                  <option value="/him">Men's (/him)</option>
                  <option value="/ekam">Ekam (/ekam)</option>
                  <option value="/dog_togs">Dog Togs (/dog_togs)</option>
                  <option value="/collections">Collections (/collections)</option>
                  <option value="/about">About Us (/about)</option>
                  <option value="/contact">Contact (/contact)</option>
                  <option value="/our-story">Our Story (/our-story)</option>
                  <option value="/our-materials">Our Materials (/our-materials)</option>
                  <option value="/slow-fashion-guide">Slow Fashion Guide (/slow-fashion-guide)</option>
                  <option value="/journal">Journal (/journal)</option>
                  <option value="/cart">Cart (/cart)</option>
                  <option value="/checkout">Checkout (/checkout)</option>
                  <option value="/login">Login (/login)</option>
                  <option value="/register">Register (/register)</option>
                  <option value="/privacy">Privacy Policy (/privacy)</option>
                  <option value="/terms">Terms & Conditions (/terms)</option>
                  <option value="/shipping">Shipping Policy (/shipping)</option>
                  <option value="/returns">Returns Policy (/returns)</option>
                  <option value="/disclaimer">Disclaimer (/disclaimer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B08D3F]/20 focus:border-[#B08D3F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B08D3F]/20 focus:border-[#B08D3F] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  placeholder="Comma separated"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B08D3F]/20 focus:border-[#B08D3F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://.../image.jpg"
                  value={formData.og_image}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B08D3F]/20 focus:border-[#B08D3F]"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Add Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
