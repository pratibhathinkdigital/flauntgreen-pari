"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, ArrowLeft, Check, Image as ImageIcon, Upload, Copy } from "lucide-react";
import { productsApi, categoriesApi, collectionsApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";
import toast from "react-hot-toast";

export default function AdminProductForm({ product = null, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
    wash_care: Array.isArray(product?.wash_care) ? product.wash_care.join("\n") : (product?.wash_care || ""),
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

  // Inspiration specific state (single full-width designer banner)
  const [inspirationImage, setInspirationImage] = useState(null);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [catsRes, collsRes] = await Promise.all([
        categoriesApi.adminGetAll(),
        collectionsApi.adminGetAll()
      ]);
      setCategories(catsRes.data);
      setCollections(collsRes.data);
    } catch (err) {
      toast.error("Failed to load categories/collections");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddVariant = () => {
    if (variants.length > 0) {
      const last = variants[variants.length - 1];
      const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
      const currentUpper = (last.size || "").trim().toUpperCase();
      const idx = SIZE_ORDER.indexOf(currentUpper);
      const nextSize = idx !== -1 && idx < SIZE_ORDER.length - 1 ? SIZE_ORDER[idx + 1] : (last.size || "S");

      setVariants([
        ...variants,
        {
          size: nextSize,
          stock: last.stock !== undefined && last.stock !== "" ? last.stock : 0,
          color_name: last.color_name || "",
          image: last.image || null,
          imageFile: last.imageFile || null,
          remove_image: false,
          sku: "",
        }
      ]);
    } else {
      setVariants([
        ...variants,
        { size: "S", stock: 0, color_name: "", image: null, imageFile: null, remove_image: false, sku: "" }
      ]);
    }
  };

  const handleDuplicateVariant = (index) => {
    const source = variants[index];
    const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
    const currentUpper = (source.size || "").trim().toUpperCase();
    const idx = SIZE_ORDER.indexOf(currentUpper);
    const nextSize = idx !== -1 && idx < SIZE_ORDER.length - 1 ? SIZE_ORDER[idx + 1] : (source.size || "S");

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
  };

  const handleAddInspirationColor = () => {
    setInspirationColors([...inspirationColors, "#000000"]);
  };

  const handleInspirationColorChange = (index, val) => {
    const newColors = [...inspirationColors];
    newColors[index] = val;
    setInspirationColors(newColors);
  };

  const handleRemoveInspirationColor = (index) => {
    const newColors = [...inspirationColors];
    newColors.splice(index, 1);
    setInspirationColors(newColors);
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

  const handleImageChange = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const availableSlots = 12 - (existingImages.length + images.length);

    if (availableSlots <= 0) {
      toast.error("Maximum 12 product images allowed. Please delete an image first.");
      e.target.value = "";
      return;
    }

    if (selectedFiles.length > availableSlots) {
      toast.error(`Only ${availableSlots} more image(s) can be added (Maximum 12 images allowed).`);
      setImages([...images, ...selectedFiles.slice(0, availableSlots)]);
    } else {
      setImages([...images, ...selectedFiles]);
    }
    e.target.value = "";
  };

  const handleRemoveExistingImage = (imageId) => {
    setDeletedImages([...deletedImages, imageId]);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  const handleRemoveNewImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length + images.length > 12) {
      toast.error("A product can have a maximum of 12 images. Please remove extra images.");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === "boolean") {
        submitData.append(key, formData[key] ? "1" : "0");
      } else if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    // Append variants with fabric texture images
    variants.forEach((variant, i) => {
      if (variant.id) submitData.append(`variants[${i}][id]`, variant.id);
      submitData.append(`variants[${i}][size]`, variant.size);
      submitData.append(`variants[${i}][stock]`, variant.stock);
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

    // Append inspiration banner image (single full-width image)
    if (inspirationImage) submitData.append("inspiration_image", inspirationImage);

    // Append new images
    images.forEach(image => {
      submitData.append("images[]", image);
    });

    // Append deleted relations for updates
    if (product) {
      deletedImages.forEach(id => submitData.append("deleted_images[]", id));
      deletedVariants.forEach(id => submitData.append("deleted_variants[]", id));
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
            <span>Back to Products</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 text-sm text-slate-400">
            <span>/</span>
            <span className="font-semibold text-slate-700">
              {product ? "Edit Product" : "Create New Product"}
            </span>
            {product?.name && (
              <span className="max-w-[200px] truncate text-slate-500 font-medium">
                — {product.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
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
                <span>Saving Product...</span>
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Basic Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-semibold text-text-primary">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] outline-none"
                  placeholder="e.g. Sage Green Organic Kurti"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                    <span>Admin SKU ID</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold uppercase">
                      Admin Only
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const clean = (formData.name || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "PRD";
                      const randomSuffix = Math.floor(100 + Math.random() * 900);
                      setFormData(prev => ({ ...prev, sku: `FG-${clean}-${randomSuffix}` }));
                      toast.success("Generated unique SKU");
                    }}
                    className="text-[11px] text-[#997b47] hover:underline font-semibold"
                  >
                    Auto Generate
                  </button>
                </div>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] outline-none uppercase bg-slate-50/50"
                  placeholder="e.g. FG-KURT-101"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Price (₹)</label>
                <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Compare Price (₹)</label>
                <input type="number" name="compare_price" min="0" value={formData.compare_price} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] outline-none bg-white">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section.toUpperCase()})` : ''}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Collection</label>
                <select name="collection_id" value={formData.collection_id} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] outline-none bg-white">
                  <option value="">Select Collection</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Fabric</label>
                <input type="text" name="fabric" value={formData.fabric} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none" placeholder="e.g. Organic Khadi" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Fit</label>
                <input type="text" name="fit" value={formData.fit} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none" placeholder="e.g. A-Line / Relaxed" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Primary Colour</label>
                <input type="text" name="colour" value={formData.colour} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none" placeholder="e.g. Olive Green" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Model Size</label>
                <input type="text" name="model_size" value={formData.model_size} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none" placeholder="e.g. S (or Model is wearing Size S)" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Model Measurements</label>
                <input type="text" name="model_measurements" value={formData.model_measurements} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none" placeholder={"e.g. Bust 31\", Waist 23\", Hips 34\", Height 5'6\""} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Materials Info</label>
                <textarea name="materials" rows="3" value={formData.materials} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none resize-none" placeholder="e.g. 100% Certified EcoVero, ethically harvested from sustainable European beech forests." />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-text-primary">Wash & Care Instructions (one per line)</label>
                <textarea name="wash_care" rows="3" value={formData.wash_care} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] outline-none resize-none" placeholder="Hand Wash in Cold Water&#10;Do Not Bleach&#10;Dry in Shade&#10;Warm Iron" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-text-primary">Description</label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] outline-none resize-none" />
            </div>
            
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} className="rounded text-[#997b47] focus:ring-[#997b47]" />
                Featured Product
              </label>
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input type="checkbox" name="is_dog_product" checked={formData.is_dog_product} onChange={handleInputChange} className="rounded text-[#997b47] focus:ring-[#997b47]" />
                Dog Product
              </label>
            </div>
          </section>

            {/* Variants (Sizes/Colors/Stock) */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Variants & Stock</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage sizes, colors, and inventory units for this product.</p>
                </div>
                <button type="button" onClick={handleAddVariant} className="text-xs font-semibold bg-[#f7ece6] text-[#997b47] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#ebd9cd] transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Variant
                </button>
              </div>
              
              {variants.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                  <p className="text-sm text-amber-800 font-medium">⚠️ No stock variants found. Product will show as <span className="font-bold text-red-600">Out of Stock</span>.</p>
                  <button
                    type="button"
                    onClick={() => setVariants([{ size: "Standard", stock: 10, color_name: "", image: null, imageFile: null, remove_image: false, sku: "" }])}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#997b47] text-white text-xs font-bold rounded-lg hover:bg-[#836838] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Quick Add Stock (10 Units)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {variants.map((v, index) => (
                    <div key={index} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl relative space-y-2.5">
                      <div className="grid grid-cols-12 gap-2.5 items-end">
                        <div className="col-span-3 sm:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Size</label>
                          <input type="text" value={v.size || ""} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} required className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-[#997b47]" placeholder="e.g. S" />
                        </div>
                        <div className="col-span-3 sm:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Stock</label>
                          <input type="number" value={v.stock ?? ""} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} required min="0" className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none font-bold text-[#41542f] bg-white focus:border-[#997b47]" placeholder="0" />
                        </div>
                        <div className="col-span-6 sm:col-span-3 space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Color / Fabric (Opt)</label>
                          <input type="text" value={v.color_name || ""} onChange={(e) => handleVariantChange(index, 'color_name', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none bg-white focus:border-[#997b47]" placeholder="e.g. Indigo Khadi" />
                        </div>
                        
                        {/* Fabric Texture Image Upload (Replaces flat color palette) */}
                        <div className="col-span-10 sm:col-span-4 space-y-1">
                          <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                            <span>Fabric Texture Image</span>
                            <span className="text-[10px] text-slate-400 font-normal">Fabric swatch / photo</span>
                          </label>
                          <div className="flex items-center gap-2">
                            {/* Preview Thumbnail */}
                            {v.imageFile || (v.image && !v.remove_image) ? (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-100 group shadow-xs">
                                <img
                                  src={v.imageFile ? URL.createObjectURL(v.imageFile) : getImageUrl(v.image)}
                                  alt="Fabric Texture"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleVariantChange(index, 'imageFile', null);
                                    handleVariantChange(index, 'remove_image', true);
                                  }}
                                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove texture photo"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <label className="w-10 h-10 rounded-lg border border-dashed border-slate-300 hover:border-[#997b47] hover:bg-amber-50/50 flex items-center justify-center cursor-pointer transition-colors shrink-0 text-slate-400 hover:text-[#997b47]" title="Upload fabric texture image">
                                <ImageIcon className="w-4 h-4" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleVariantChange(index, 'imageFile', e.target.files[0]);
                                      handleVariantChange(index, 'remove_image', false);
                                    }
                                  }}
                                />
                              </label>
                            )}

                            {/* Upload / Replace Button */}
                            <div className="flex-1 min-w-0">
                              <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white hover:border-[#997b47] cursor-pointer transition-all w-full truncate bg-white shadow-2xs">
                                <Upload className="w-3 h-3 shrink-0 text-[#997b47]" />
                                <span className="truncate">
                                  {v.imageFile ? v.imageFile.name : (v.image && !v.remove_image) ? "Replace Texture" : "Upload Fabric Image"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleVariantChange(index, 'imageFile', e.target.files[0]);
                                      handleVariantChange(index, 'remove_image', false);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateVariant(index)}
                            className="p-1.5 text-slate-400 hover:text-[#997b47] hover:bg-amber-50 rounded-lg transition-colors"
                            title="Duplicate this variant"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index, v.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          {/* Inspiration Section — Single Full-Width Banner Image */}
          <section className="space-y-4 p-5 bg-gradient-to-br from-[#faf8f4] to-[#f4eee4] border border-[#e8ded1] rounded-2xl">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#41542f] uppercase tracking-wider flex items-center gap-2">
                  <span>The Inspiration Banner</span>
                  <span className="text-[11px] font-normal normal-case px-2.5 py-0.5 rounded-full bg-[#41542f]/10 text-[#41542f]">
                    Full Width Section
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload a single complete designer graphic banner here. It will span <strong>full-width</strong> across the product page.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                  📐 Recommended Image Dimensions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 pl-4 list-disc">
                  <div>• <strong>Resolution:</strong> 1920 × 750 px (Wide Panoramic)</div>
                  <div>• <strong>Aspect Ratio:</strong> ~2.5:1 (or 16:9 widescreen)</div>
                  <div>• <strong>Format:</strong> High-res JPG, PNG, or WebP</div>
                  <div>• <strong>Max File Size:</strong> Up to 5 MB</div>
                </div>
              </div>

              {/* Existing or New Image Preview */}
              {(inspirationImage || product?.inspiration_image) && (
                <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <img
                    src={inspirationImage ? URL.createObjectURL(inspirationImage) : getImageUrl(product.inspiration_image)}
                    alt="Inspiration Banner Preview"
                    className="w-full h-auto max-h-[220px] object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white text-xs">
                    <span>{inspirationImage ? "New banner selected" : "Current live banner"}</span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">
                  {product?.inspiration_image ? "Replace Inspiration Banner" : "Upload Inspiration Banner"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setInspirationImage(e.target.files[0] || null)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#41542f] file:text-white hover:file:bg-[#324224] file:cursor-pointer transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Images */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  Product Gallery
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    existingImages.length + images.length >= 12
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-[#41542f]/10 text-[#41542f] border border-[#41542f]/20"
                  }`}>
                    {existingImages.length + images.length} / 12
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload up to 12 images: Front, back, side styling angles, and fabric texture close-ups.
                </p>
              </div>
            </div>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {existingImages.map(img => (
                  <div key={img.id} className="relative w-20 h-24 rounded-xl overflow-hidden border border-slate-200 group shadow-xs">
                    <img src={getImageUrl(img.image_url)} alt="Product" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveExistingImage(img.id)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white" title="Remove image">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Images */}
            <div className="space-y-2">
              {existingImages.length + images.length >= 12 ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 font-medium">
                  Maximum 12 images limit reached. Remove an image above if you want to upload a different one.
                </div>
              ) : (
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#41542f] file:text-white hover:file:bg-[#344325] file:cursor-pointer transition-all"
                />
              )}

              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-24 rounded-xl overflow-hidden border border-slate-200 group shadow-xs">
                      <img src={URL.createObjectURL(img)} alt="New Product" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveNewImage(idx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white" title="Remove image">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </form>
    </div>
  );
}
