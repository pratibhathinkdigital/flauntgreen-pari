"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  Quote,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Calendar,
  UploadCloud,
  Trash2,
  Check,
} from "lucide-react";
import { journalApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";
import toast from "react-hot-toast";
import SummernoteEditor from "@/components/admin/SummernoteEditor";

export default function JournalForm({ journal = null, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    journal?.image_url ? getImageUrl(journal.image_url) : null
  );

  const [formData, setFormData] = useState({
    title: journal?.title || "",
    type: journal?.type || "blog",
    excerpt: journal?.excerpt || "",
    content: journal?.content || "",
    quote: journal?.quote || "",
    quote_author: journal?.quote_author || "",
    is_published: journal?.is_published ?? true,
    published_at: journal?.published_at
      ? new Date(journal.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the post.");
      return;
    }
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (typeof val === "boolean") {
        data.append(key, val ? "1" : "0");
      } else if (val !== null && val !== "") {
        data.append(key, val);
      }
    });
    if (imageFile) data.append("image", imageFile);

    try {
      if (journal) {
        await journalApi.update(journal.id, data);
        toast.success("Journal post updated successfully!");
      } else {
        await journalApi.create(data);
        toast.success("Journal post created successfully!");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      const errors = err?.response?.data?.errors;
      if (errors) {
        const errorList = Object.values(errors).flat();
        toast.error(errorList[0] || "Validation failed");
      } else {
        toast.error(err?.response?.data?.message || "Failed to save journal post.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-16">
      {/* ── Top Sticky Studio Action Bar ── */}
      <div className="sticky top-0 z-30 bg-surface-secondary/90 backdrop-blur-md py-3 -mt-2 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 text-sm text-slate-400">
            <span>/</span>
            <span className="font-semibold text-slate-700">
              {journal ? "Edit Article" : "Create New Article"}
            </span>
            {journal?.title && (
              <span className="max-w-[200px] truncate text-slate-500 font-medium">
                — {journal.title}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                formData.is_published ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span className={formData.is_published ? "text-emerald-700" : "text-slate-500"}>
              {formData.is_published ? "Live / Published" : "Draft Mode"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-sm font-semibold hover:bg-[#344326] transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Post...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{journal ? "Save Changes" : "Publish Post"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Studio Grid ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Title, Summernote Content, and Pull Quote (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title Input Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. How One Beagle Inspired Our Pet Wear Collection"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xl font-heading font-semibold text-slate-900 placeholder:text-slate-300 focus:border-[#997b47] focus:ring-2 focus:ring-[#997b47]/20 outline-none transition-all bg-slate-50/30 focus:bg-white"
            />
            <p className="text-xs text-slate-400">
              The main headline of your article. Keep it engaging, clear, and inspiring.
            </p>
          </div>

          {/* Summernote Editor Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Article Body & Content
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Format headings, insert high-res images, create tables, and style text with the tools below.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f2ea] text-[#997b47] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summernote Pro Editor</span>
              </div>
            </div>

            <SummernoteEditor
              value={formData.content}
              onChange={(contents) => setFormData((prev) => ({ ...prev, content: contents }))}
              placeholder="Write your article here with rich text formatting, headings, images, lists, tables, and links..."
              height={460}
            />
          </div>

          {/* Highlight Pull Quote Card */}
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-[#997b47] flex items-center justify-center shrink-0">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Featured Editorial Pull Quote <span className="text-xs font-normal text-slate-400">(Optional)</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  This text appears as a prominent, beautifully styled quote banner in the article. If left blank, no quote section will be rendered.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Quote Text</label>
              <textarea
                name="quote"
                rows={3}
                value={formData.quote}
                onChange={handleChange}
                placeholder="e.g. Fashion is an intimate dialogue between human expression and the rhythms of nature."
                className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-base italic text-slate-800 placeholder:text-slate-300 focus:border-[#997b47] focus:ring-2 focus:ring-[#997b47]/20 outline-none transition-all resize-none"
                style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', Georgia, serif" }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Quote Author / Attribution</label>
              <input
                type="text"
                name="quote_author"
                value={formData.quote_author}
                onChange={handleChange}
                placeholder="e.g. — The Flaunt Green Journal (leave blank for default)"
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-sm text-slate-700 placeholder:text-slate-300 focus:border-[#997b47] focus:ring-2 focus:ring-[#997b47]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Publishing Controls, Image & Excerpt (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3">
              Publishing Options
            </h3>

            {/* Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Article Category
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "blog" }))}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    formData.type === "blog"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Blog</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "social-outreach" }))}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    formData.type === "social-outreach"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Social Outreach</span>
                </button>
              </div>
            </div>

            {/* Status Switch */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">Visibility Status</p>
                <p className="text-[11px] text-slate-400">
                  {formData.is_published ? "Visible on live website" : "Hidden as draft"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, is_published: !prev.is_published }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.is_published ? "bg-[#41542f]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formData.is_published ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Publication Date */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Publication Date & Time</span>
              </label>
              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-[#997b47] bg-slate-50/50"
              />
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Cover Photo
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">16:9 Recommended</span>
            </div>

            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <label className="block w-full text-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                  <span>Change Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#997b47] hover:bg-amber-50/20 cursor-pointer transition-all group">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 group-hover:bg-[#f6f2ea] group-hover:text-[#997b47] flex items-center justify-center mb-3 transition-colors">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">Click to upload cover image</p>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, or WebP up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Excerpt Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Short Excerpt
              </h3>
              <span className="text-[11px] text-slate-400">
                {formData.excerpt?.length || 0} chars
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Brief summary displayed on the blog card grid and search previews.
            </p>

            <textarea
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="e.g. A behind-the-scenes look into our latest sustainable fabrics and the inspiration behind each stitch..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 placeholder:text-slate-300 focus:border-[#997b47] focus:ring-2 focus:ring-[#997b47]/20 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
