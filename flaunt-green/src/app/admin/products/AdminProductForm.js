"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  Image as ImageIcon,
  Upload,
  Copy,
  Sparkles,
  Tag,
  Layers,
  Info,
  Package,
  Leaf,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { productsApi, categoriesApi, collectionsApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";
import toast from "react-hot-toast";

export default function AdminProductForm({ product = null, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const galleryInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    category_id: product?.category_id || "",
    collection_id: product?.collection_id || "",
    price: product?.price || "",
    compare_price: product?.compare_price || "",
    description: product?.description || "",
    sku: product?.sku || "",
    fabric: product?.fabric || "",
    fit: product?.fit || "",
    colour: product?.colour || "",
    model_size: product?.model_size || "",
    model_measurements: product?.model_measurements || "",
    materials: product?.materials || "",
    wash_care: Array.isArray(product?.wash_care)
      ? product.wash_care.join("\n")
      : product?.wash_care || "",
    is_featured: product?.is_featured || false,
    is_active: product?.is_active ?? true,
    is_dog_product: product?.is_dog_product || false,
    inspiration_title: "",
    inspiration_description_1: "",
    inspiration_description_2: "",
  });

  const [variants, setVariants] = useState(product?.variants || []);
  const [images, setImages] = useState([]); // New image files to upload
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVariants, setDeletedVariants] = useState([]);
  const [inspirationImage, setInspirationImage] = useState(null);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [catsRes, collsRes] = await Promise.all([
        categoriesApi.adminGetAll(),
        collectionsApi.adminGetAll(),
      ]);
      setCategories(catsRes.data || []);
      setCollections(collsRes.data || []);
    } catch (err) {
      toast.error("Failed to load categories/collections");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Auto-generate SKU based on product name
  const handleAutoGenerateSku = () => {
    const cleanName =
      (formData.name || "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 4)
        .toUpperCase() || "PRD";
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newSku = `FG-${cleanName}-${randomSuffix}`;
    setFormData((prev) => ({ ...prev, sku: newSku }));
    toast.success(`Generated SKU: ${newSku}`);
  };

  // Add new variant
  const handleAddVariant = () => {
    if (variants.length > 0) {
      const last = variants[variants.length - 1];
      const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
      const currentUpper = (last.size || "").trim().toUpperCase();
      const idx = SIZE_ORDER.indexOf(currentUpper);
      const nextSize =
        idx !== -1 && idx < SIZE_ORDER.length - 1 ? SIZE_ORDER[idx + 1] : last.size || "S";

      setVariants([
        ...variants,
        {
          size: nextSize,
          stock: last.stock !== undefined && last.stock !== "" ? last.stock : 10,
          color_name: last.color_name || "",
          image: last.image || null,
          imageFile: last.imageFile || null,
          remove_image: false,
          sku: "",
        },
      ]);
    } else {
      setVariants([
        ...variants,
        { size: "S", stock: 10, color_name: "", image: null, imageFile: null, remove_image: false, sku: "" },
      ]);
    }
  };

  // Duplicate variant
  const handleDuplicateVariant = (index) => {
    const source = variants[index];
    const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
    const currentUpper = (source.size || "").trim().toUpperCase();
    const idx = SIZE_ORDER.indexOf(currentUpper);
    const nextSize =
      idx !== -1 && idx < SIZE_ORDER.length - 1 ? SIZE_ORDER[idx + 1] : source.size || "S";

    const newVariant = {
      size: nextSize,
      stock: source.stock !== undefined && source.stock !== "" ? source.stock : 0,
      color_name: source.color_name || "",
      image: source.image || null,
      imageFile: source.imageFile || null,
      remove_image: false,
      sku: "",
    };
    const updated = [...variants];
    updated.splice(index + 1, 0, newVariant);
    setVariants(updated);
    toast.success(`Duplicated variant as Size ${nextSize}`);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index, variantId) => {
    if (variantId) {
      setDeletedVariants([...deletedVariants, variantId]);
    }
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleQuickAddSizeRun = () => {
    const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    setVariants(
      defaultSizes.map((size) => ({
        size,
        stock: 10,
        color_name: formData.colour || "",
        image: null,
        imageFile: null,
        remove_image: false,
        sku: "",
      }))
    );
    toast.success("Added standard size run (XS to XXL)");
  };

  const handleImageChange = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const MAX_GALLERY_IMAGES = 5;
    const availableSlots = MAX_GALLERY_IMAGES - (existingImages.length + images.length);

    if (availableSlots <= 0) {
      toast.error("Maximum 5 product gallery images allowed. Please delete an image first.");
      e.target.value = "";
      return;
    }

    if (selectedFiles.length > availableSlots) {
      toast.error(`Only ${availableSlots} more image(s) can be added (Maximum 5 limit).`);
      setImages([...images, ...selectedFiles.slice(0, availableSlots)]);
    } else {
      setImages([...images, ...selectedFiles]);
    }
    e.target.value = "";
  };

  const handleRemoveExistingImage = (imageId) => {
    setDeletedImages([...deletedImages, imageId]);
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
  };

  const handleRemoveNewImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!formData.name?.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (existingImages.length + images.length > 5) {
      toast.error("A product can have a maximum of 5 images.");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "boolean") {
        submitData.append(key, formData[key] ? "1" : "0");
      } else if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    // Append variants
    variants.forEach((variant, i) => {
      if (variant.id) submitData.append(`variants[${i}][id]`, variant.id);
      submitData.append(`variants[${i}][size]`, variant.size);
      submitData.append(`variants[${i}][stock]`, variant.stock ?? 0);
      if (variant.color_name) submitData.append(`variants[${i}][color_name]`, variant.color_name);
      if (variant.color_hex) submitData.append(`variants[${i}][color_hex]`, variant.color_hex);
      if (variant.sku) submitData.append(`variants[${i}][sku]`, variant.sku);

      if (variant.imageFile) {
        submitData.append(`variant_image_${i}`, variant.imageFile);
      } else if (variant.remove_image) {
        submitData.append(`variant_remove_image_${i}`, "1");
      } else if (variant.image && typeof variant.image === "string") {
        submitData.append(`variants[${i}][image]`, variant.image);
      }
    });

    // Append inspiration banner
    if (inspirationImage) submitData.append("inspiration_image", inspirationImage);

    // Append new gallery images
    images.forEach((image) => {
      submitData.append("images[]", image);
    });

    // Append deleted relations
    if (product) {
      deletedImages.forEach((id) => submitData.append("deleted_images[]", id));
      deletedVariants.forEach((id) => submitData.append("deleted_variants[]", id));
    }

    try {
      if (product) {
        await productsApi.update(product.id, submitData);
        toast.success("Product updated successfully");
      } else {
        await productsApi.create(submitData);
        toast.success("Product created successfully");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      const errors = err?.response?.data?.errors;
      if (errors) {
        const errorList = Object.values(errors).flat();
        toast.error(errorList[0] || "Validation failed");
      } else {
        toast.error(err?.response?.data?.message || "Failed to save product");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalStockCount = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const totalPhotosCount = existingImages.length + images.length;
  const discountPercent =
    formData.compare_price && Number(formData.compare_price) > Number(formData.price)
      ? Math.round(
          ((Number(formData.compare_price) - Number(formData.price)) /
            Number(formData.compare_price)) *
            100
        )
      : null;

  return (
    <div className="w-full space-y-6 animate-fade-in pb-20 max-w-[1400px] mx-auto">
      {/* ── Top Header & Actions ── */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md py-3.5 -mt-2 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          <div className="flex items-center gap-2 pl-2 text-sm text-stone-400">
            <span>/</span>
            <span className="font-serif font-bold text-stone-900 text-base">
              {product ? "Edit Product" : "Create New Product"}
            </span>
            {formData.name && (
              <span className="hidden md:inline-block max-w-[260px] truncate text-stone-500 font-medium text-xs">
                — {formData.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick status pill */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              formData.is_active
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-stone-100 text-stone-600 border border-stone-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                formData.is_active ? "bg-emerald-600 animate-pulse" : "bg-stone-400"
              }`}
            />
            {formData.is_active ? "Live / Active" : "Draft / Inactive"}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#41542f] text-white text-xs font-bold hover:bg-[#344326] transition-all shadow-sm disabled:opacity-50 tracking-wide cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{product ? "Save Changes" : "Publish Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ══════════════════════════════════════════════════════════════
            LEFT COLUMN (8 COLS): Main Details & Inventory Specs
           ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. General Information Card */}
          <section className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#41542f] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Product Identity</h3>
                  <p className="text-[11px] text-stone-500">Core title and brand description</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sage Green Organic Linen Kurti"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium focus:border-[#41542f] focus:ring-2 focus:ring-[#41542f]/10 outline-none transition-all placeholder:text-stone-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Description &amp; Story
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell the story behind this handcrafted piece, its conscious silhouette, and how it feels on the body..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm leading-relaxed focus:border-[#41542f] focus:ring-2 focus:ring-[#41542f]/10 outline-none transition-all resize-none placeholder:text-stone-300"
                />
              </div>
            </div>
          </section>

          {/* 2. Pricing & Identification Card */}
          <section className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#997b47] flex items-center justify-center font-bold text-xs">
                  ₹
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Pricing &amp; Identification</h3>
                  <p className="text-[11px] text-stone-500">Retail price and private Admin SKU</p>
                </div>
              </div>

              {discountPercent && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {discountPercent}% OFF Displayed
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Selling Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="2499"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-900 focus:border-[#41542f] focus:ring-2 focus:ring-[#41542f]/10 outline-none"
                  />
                </div>
              </div>

              {/* Compare Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Compare Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="compare_price"
                    min="0"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={handleInputChange}
                    placeholder="3499"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-500 line-through focus:border-[#41542f] focus:ring-2 focus:ring-[#41542f]/10 outline-none"
                  />
                </div>
              </div>

              {/* Admin SKU ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                    <span>Admin SKU ID</span>
                    <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-bold uppercase">
                      Admin Only
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSku}
                    className="text-[11px] font-bold text-[#997b47] hover:underline cursor-pointer"
                    title="Generate unique SKU automatically"
                  >
                    ⚡ Auto
                  </button>
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#997b47]" />
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sku: e.target.value.toUpperCase() }))
                    }
                    placeholder="e.g. FG-KURT-101"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold uppercase text-stone-800 bg-stone-50/70 focus:bg-white focus:border-[#41542f] focus:ring-2 focus:ring-[#41542f]/10 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Conscious Fashion & Sizing Specs Card */}
          <section className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">
                    Material, Fit &amp; Specifications
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Handcrafted textile details shown in the Specs tab
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Fabric Type
                </label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleInputChange}
                  placeholder="e.g. 100% Organic Khadi"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-[#41542f] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Fit &amp; Silhouette
                </label>
                <input
                  type="text"
                  name="fit"
                  value={formData.fit}
                  onChange={handleInputChange}
                  placeholder="e.g. Relaxed A-Line Fit"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-[#41542f] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Primary Colour
                </label>
                <input
                  type="text"
                  name="colour"
                  value={formData.colour}
                  onChange={handleInputChange}
                  placeholder="e.g. Olive Green"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-[#41542f] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Model Wears Size
                </label>
                <input
                  type="text"
                  name="model_size"
                  value={formData.model_size}
                  onChange={handleInputChange}
                  placeholder="e.g. S (Model height 5'7&quot;)"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-[#41542f] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Model Measurements
                </label>
                <input
                  type="text"
                  name="model_measurements"
                  value={formData.model_measurements}
                  onChange={handleInputChange}
                  placeholder="e.g. Bust 32&quot;, Waist 26&quot;, Hips 36&quot;"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-[#41542f] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Sustainable Materials Info
                </label>
                <textarea
                  name="materials"
                  rows={3}
                  value={formData.materials}
                  onChange={handleInputChange}
                  placeholder="e.g. 100% Certified EcoVero, ethically harvested from European beech forests."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs leading-relaxed focus:border-[#41542f] outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Wash &amp; Care Instructions</span>
                  <span className="text-[10px] text-stone-400 font-normal">One per line</span>
                </label>
                <textarea
                  name="wash_care"
                  rows={3}
                  value={formData.wash_care}
                  onChange={handleInputChange}
                  placeholder="Hand Wash in Cold Water&#10;Do Not Bleach&#10;Dry in Shade&#10;Warm Iron"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs leading-relaxed focus:border-[#41542f] outline-none resize-none font-mono"
                />
              </div>
            </div>
          </section>

          {/* 4. Variants & Stock Management Card */}
          <section className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Variants &amp; Stock</h3>
                  <p className="text-[11px] text-stone-500">
                    Sizes, inventory count, and fabric texture uploads
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                  {variants.length} Sizes • {totalStockCount} Units Total
                </span>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="text-xs font-bold bg-[#f7ece6] text-[#997b47] hover:bg-[#ebd9cd] px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Size
                </button>
              </div>
            </div>

            {variants.length === 0 ? (
              <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-2xl text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
                <div>
                  <p className="text-sm text-amber-900 font-bold">No Size Variants Found</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    This product will be shown as <strong>Out of Stock</strong> to customers without variants.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleQuickAddSizeRun}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#997b47] text-white text-xs font-bold rounded-xl hover:bg-[#836838] transition-colors shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Quick Add Standard Run (XS to XXL)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVariants([
                        {
                          size: "Standard",
                          stock: 10,
                          color_name: "",
                          image: null,
                          imageFile: null,
                          remove_image: false,
                          sku: "",
                        },
                      ])
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-200 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Single Standard Size (10 Units)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((v, index) => {
                  const stockNum = Number(v.stock) || 0;
                  const isOutOfStock = stockNum <= 0;

                  return (
                    <div
                      key={index}
                      className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-2xl space-y-2 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="grid grid-cols-12 gap-3 items-end">
                        {/* Size */}
                        <div className="col-span-4 sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                            Size
                          </label>
                          <input
                            type="text"
                            value={v.size || ""}
                            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                            required
                            placeholder="e.g. M"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-center outline-none bg-white focus:border-[#41542f]"
                          />
                        </div>

                        {/* Stock Quantity */}
                        <div className="col-span-4 sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
                            <span>Stock</span>
                            <span
                              className={`text-[9px] font-bold ${
                                isOutOfStock ? "text-red-600" : "text-emerald-700"
                              }`}
                            >
                              {isOutOfStock ? "Zero" : "In Stock"}
                            </span>
                          </label>
                          <input
                            type="number"
                            value={v.stock ?? ""}
                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                            required
                            min="0"
                            placeholder="0"
                            className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold text-center outline-none bg-white ${
                              isOutOfStock
                                ? "border-red-300 text-red-600"
                                : "border-stone-200 text-emerald-800"
                            }`}
                          />
                        </div>

                        {/* Color / Fabric Variation Name */}
                        <div className="col-span-4 sm:col-span-3 space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                            Colour / Variant
                          </label>
                          <input
                            type="text"
                            value={v.color_name || ""}
                            onChange={(e) =>
                              handleVariantChange(index, "color_name", e.target.value)
                            }
                            placeholder="e.g. Olive Khadi"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs outline-none bg-white focus:border-[#41542f]"
                          />
                        </div>

                        {/* Fabric Texture Image */}
                        <div className="col-span-9 sm:col-span-4 space-y-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
                            <span>Fabric Texture</span>
                            <span className="text-[10px] text-stone-400 font-normal">Swatch</span>
                          </label>

                          <div className="flex items-center gap-2">
                            {v.imageFile || (v.image && !v.remove_image) ? (
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-stone-100 group shadow-xs">
                                <img
                                  src={
                                    v.imageFile
                                      ? URL.createObjectURL(v.imageFile)
                                      : getImageUrl(v.image)
                                  }
                                  alt="Texture"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleVariantChange(index, "imageFile", null);
                                    handleVariantChange(index, "remove_image", true);
                                  }}
                                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  title="Remove texture photo"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : null}

                            <label className="flex-1 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 text-[11px] font-medium text-stone-600 hover:bg-white hover:border-[#997b47] cursor-pointer transition-all bg-white shadow-2xs truncate">
                              <Upload className="w-3 h-3 text-[#997b47] shrink-0" />
                              <span className="truncate">
                                {v.imageFile
                                  ? v.imageFile.name
                                  : v.image && !v.remove_image
                                  ? "Replace Swatch"
                                  : "Upload Swatch"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleVariantChange(index, "imageFile", e.target.files[0]);
                                    handleVariantChange(index, "remove_image", false);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Actions (Duplicate & Delete) */}
                        <div className="col-span-3 sm:col-span-1 flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateVariant(index)}
                            className="p-1.5 text-stone-400 hover:text-[#997b47] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate this size"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index, v.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete size"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 5. Editorial Inspiration Banner Card */}
          <section className="bg-gradient-to-br from-[#FAF8F5] to-[#F5EFE6] border border-[#E5DACB] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DACB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#41542f] text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#41542f] font-serif">
                    The Inspiration Designer Banner
                  </h3>
                  <p className="text-[11px] text-stone-600">
                    Full-width panoramic feature banner for the story section
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#41542f]/10 text-[#41542f] border border-[#41542f]/20">
                1920 × 750 px (2.5:1 Panoramic)
              </span>
            </div>

            {/* Existing or New Banner Preview */}
            {inspirationImage || product?.inspiration_image ? (
              <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm group">
                <img
                  src={
                    inspirationImage
                      ? URL.createObjectURL(inspirationImage)
                      : getImageUrl(product.inspiration_image)
                  }
                  alt="Inspiration Banner"
                  className="w-full h-auto max-h-[220px] object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[11px] font-bold shadow-sm">
                  <span>{inspirationImage ? "✨ New Banner Selected" : "Current Active Banner"}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-[#D6C4B0] rounded-2xl text-center space-y-2 bg-white/60">
                <ImageIcon className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs font-bold text-stone-700">No Inspiration Banner Uploaded</p>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  A widescreen panoramic designer banner elevates this product page to luxury boutique status.
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setInspirationImage(e.target.files[0] || null)}
              />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#41542f] text-white text-xs font-bold hover:bg-[#344326] transition-all shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {inspirationImage || product?.inspiration_image
                    ? "Replace Inspiration Banner"
                    : "Upload Inspiration Banner"}
                </span>
              </button>

              {inspirationImage && (
                <button
                  type="button"
                  onClick={() => setInspirationImage(null)}
                  className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT COLUMN (4 COLS): Media Gallery & Organization
           ══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Status & Visibility Card */}
          <section className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 pb-2 border-b border-stone-100">
              <Sliders className="w-3.5 h-3.5 text-stone-400" />
              <span>Status &amp; Visibility</span>
            </h3>

            {/* Active Toggle */}
            <label className="flex items-start justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer hover:bg-stone-100/70 transition-colors">
              <div>
                <p className="text-xs font-bold text-stone-800">Publish Status</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {formData.is_active ? "Visible to public customers" : "Saved as draft / Hidden"}
                </p>
              </div>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-[#41542f] focus:ring-[#41542f] mt-0.5 cursor-pointer"
              />
            </label>

            {/* Featured Product Toggle */}
            <label className="flex items-start justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer hover:bg-stone-100/70 transition-colors">
              <div>
                <p className="text-xs font-bold text-stone-800">Featured On Homepage</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Highlight in curated boutique picks</p>
              </div>
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-[#997b47] focus:ring-[#997b47] mt-0.5 cursor-pointer"
              />
            </label>

            {/* Dog Product Toggle */}
            <label className="flex items-start justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 cursor-pointer hover:bg-stone-100/70 transition-colors">
              <div>
                <p className="text-xs font-bold text-stone-800">Dog Togs Apparel</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Pet &amp; companion conscious apparel</p>
              </div>
              <input
                type="checkbox"
                name="is_dog_product"
                checked={formData.is_dog_product}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-600 mt-0.5 cursor-pointer"
              />
            </label>
          </section>

          {/* 2. Categorization Card */}
          <section className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 pb-2 border-b border-stone-100">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              <span>Categorization</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Category</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:border-[#41542f] outline-none bg-white cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.section ? `(${c.section.toUpperCase()})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Collection</label>
              <select
                name="collection_id"
                value={formData.collection_id}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 focus:border-[#41542f] outline-none bg-white cursor-pointer"
              >
                <option value="">Select Collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* 3. Product Gallery Card (Strictly 5 Photos for Equal Height) */}
          <section className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                  <span>Product Gallery</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  1 Cover + 4 Detail angles (Front, Back, Side, Model, Fabric)
                </p>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  totalPhotosCount >= 5
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-[#41542f]/10 text-[#41542f] border border-[#41542f]/20"
                }`}
              >
                {totalPhotosCount} / 5
              </span>
            </div>

            {/* Prominent Mandatory Image Specs Guideline Box */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 text-xs text-stone-700">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#997b47]" />
                  Recommended Image Specifications:
                </span>
                <span className="bg-[#997b47] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  3:4 Portrait
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-stone-600">
                <div>• <strong>Dimensions:</strong> 1200 × 1600 px</div>
                <div>• <strong>Max Allowed:</strong> Exactly 5 Photos</div>
                <div>• <strong>Aspect Ratio:</strong> 3:4 Vertical Fashion</div>
                <div>• <strong>Max File Size:</strong> 5 MB (JPG/PNG/WebP)</div>
              </div>
              <p className="text-[10px] text-amber-800 pt-1.5 border-t border-amber-200/60 leading-normal">
                💡 <strong>Frontend Alignment:</strong> Exactly 5 photos fit alongside the main product visual on the website with <strong>100% equal top-to-bottom height</strong> without any gaps or overflow.
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={galleryInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {/* Clean Dropzone Upload Button */}
            {totalPhotosCount < 5 ? (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-full py-5 border-2 border-dashed border-stone-300 hover:border-[#41542f] rounded-2xl flex flex-col items-center justify-center gap-1.5 text-stone-500 hover:text-[#41542f] hover:bg-emerald-50/30 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-emerald-100/70 text-stone-500 group-hover:text-[#41542f] flex items-center justify-center transition-colors shadow-2xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-stone-800 group-hover:text-[#41542f]">
                    Upload Product Images
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Click to browse • {5 - totalPhotosCount} slots remaining (Max 5)
                  </p>
                </div>
              </button>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 font-medium text-center">
                Maximum 5 photos reached. Remove an image to upload a new one.
              </div>
            )}

            {/* Photos Grid */}
            {totalPhotosCount > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Uploaded Photos ({totalPhotosCount})
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Existing Saved Images */}
                  {existingImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className="relative rounded-xl overflow-hidden border border-stone-200 aspect-[3/4] group shadow-2xs bg-stone-50"
                    >
                      <img
                        src={getImageUrl(img.image_url)}
                        alt="Product Image"
                        className="w-full h-full object-cover"
                      />

                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#41542f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          ★ Cover
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img.id)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                      </button>
                    </div>
                  ))}

                  {/* Newly Staged Images */}
                  {images.map((imgFile, idx) => {
                    const overallIndex = existingImages.length + idx;
                    return (
                      <div
                        key={`new-${idx}`}
                        className="relative rounded-xl overflow-hidden border-2 border-dashed border-emerald-400 aspect-[3/4] group shadow-2xs bg-stone-50"
                      >
                        <img
                          src={URL.createObjectURL(imgFile)}
                          alt="New Upload"
                          className="w-full h-full object-cover"
                        />

                        {overallIndex === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-[#41542f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            ★ Cover
                          </span>
                        )}

                        <span className="absolute bottom-1.5 left-1.5 bg-emerald-700/90 text-white text-[8px] font-bold px-1 rounded">
                          New
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                          title="Remove staged photo"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </form>
    </div>
  );
}
