"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";
import FeaturedArticles from "@/components/sections/FeaturedArticles";
import SizeGuideModal from "./SizeGuideModal";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import ProductReviewsSection from "@/components/shop/ProductReviewsSection";
import { getInventoryForSlug } from "@/data/inventory";
import { Leaf, Truck, RotateCcw, Star, Plus, Minus, Ruler, Check, Hand, Heart } from "lucide-react";
import { productsApi, reviewsApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";

/* ─── Product Data ─────────────────────────────────────────────────────────── */

/* ─── Thumbnail Gallery (Strict 5 images max) ──────────────────────────────── */
function ImageGallery({ images = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Strictly enforce max 5 images to keep the UI perfectly aligned
  const displayImages = (images || []).slice(0, 5);
  const safeIdx = activeIdx < displayImages.length ? activeIdx : 0;

  return (
    <div className="flex gap-3 items-start">
      {displayImages.length > 1 && (
        <div className="flex flex-col gap-2 shrink-0 max-h-[540px] overflow-y-auto pr-0.5">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`relative overflow-hidden shrink-0 transition-all duration-200 rounded-sm ${
                safeIdx === i
                  ? "ring-2 ring-[#B08D3F] ring-offset-1"
                  : "ring-1 ring-gray-200 hover:ring-gray-400 opacity-80 hover:opacity-100"
              }`}
              style={{ width: "80px", height: "100px" }}
            >
              <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 overflow-hidden bg-gray-100 rounded-sm" style={{ aspectRatio: "4/5" }}>
        {displayImages[safeIdx] ? (
          <Image
            src={displayImages[safeIdx]}
            alt="Product"
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 45vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Star Rating (clickable → scrolls to reviews) ────────────────────────── */
function StarRating({ rating, count, onViewReviews }) {
  const rounded = Math.round(rating);
  return (
    <button
      type="button"
      onClick={onViewReviews}
      className="group inline-flex items-center gap-1.5 text-left"
      aria-label={`${rating.toFixed(1)} out of 5, ${count} reviews. Click to view reviews.`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rounded ? "fill-[#B08D3F] text-[#B08D3F]" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm ml-1 group-hover:underline underline-offset-2" style={{ color: "#555" }}>
        {rating > 0 ? rating.toFixed(1) : "No ratings"}
      </span>
      <span className="text-sm font-medium group-hover:underline underline-offset-2" style={{ color: "#B08D3F" }}>
        ({count} {count === 1 ? "Review" : "Reviews"})
      </span>
    </button>
  );
}

/* ─── Size Selector (live stock, disables 0-stock sizes) ──────────────────── */
function SizeSelector({ sizes, inventory, selected, onSelect, onOpenGuide }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-800">Size</span>
        <button
          type="button"
          onClick={onOpenGuide}
          className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          <Ruler className="w-3.5 h-3.5" />
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const stock = inventory[size] ?? 0;
          const out = stock <= 0;
          const isSel = selected === size;
          return (
            <button
              key={size}
              type="button"
              disabled={out}
              onClick={() => onSelect(size)}
              aria-pressed={isSel}
              title={out ? "Out of stock" : `${stock} in stock`}
              className={`relative flex flex-col items-center justify-center rounded-none border text-sm transition-all duration-200 ${
                out
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : isSel
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-800 border-gray-300 hover:border-gray-600"
              }`}
              style={{ width: "58px", height: "50px" }}
            >
              <span className={`font-medium leading-none ${out ? "line-through" : ""}`}>{size}</span>
              <span
                className={`mt-1.5 text-[10px] leading-none ${
                  out ? "text-gray-400" : isSel ? "text-white/80" : "text-gray-500"
                }`}
              >
                {out ? "Sold Out" : `(${stock})`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Color Selector (square, reflects selected variant) ──────────────────── */
function ColorSelector({ colors, selected, onSelect }) {
  return (
    <div>
      <span className="text-sm font-medium text-gray-800 mb-2 block">
        Color:{" "}
        <span className="font-normal" style={{ color: "#B08D3F" }}>
          {colors[selected]?.name}
        </span>
      </span>
      <div className="flex items-center gap-2.5">
        {colors.map((color, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={color.name}
              onClick={() => onSelect(i)}
              aria-label={color.name}
              aria-pressed={isSelected}
              title={color.name}
              className={`w-9 h-9 rounded-none border flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1"
                  : "border-gray-300 hover:border-gray-600"
              }`}
              style={{ backgroundColor: color.value }}
            >
              {isSelected && (
                <Check
                  className="w-4 h-4 text-white"
                  style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.75))" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Quantity Selector (number input + stacked +/-) ──────────────────────── */
function QuantitySelector({ qty, onChange, max = 99 }) {
  const clamp = (v) => Math.max(1, Math.min(max, v || 1));
  const handleRaw = (raw) => {
    const n = parseInt(raw, 10);
    onChange(Number.isNaN(n) ? 1 : clamp(n));
  };

  return (
    <div className="inline-flex items-stretch border border-gray-300 bg-white overflow-hidden" style={{ height: "44px" }}>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={qty}
        onChange={(e) => handleRaw(e.target.value)}
        aria-label="Quantity"
        className="w-14 text-center text-sm font-medium text-gray-900 outline-none border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <div className="flex flex-col border-l border-gray-300">
        <button
          type="button"
          onClick={() => onChange(clamp(qty + 1))}
          disabled={qty >= max}
          aria-label="Increase quantity"
          className="flex flex-1 items-center justify-center w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onChange(clamp(qty - 1))}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
          className="flex flex-1 items-center justify-center w-8 border-t border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Trust Badges Row ─────────────────────────────────────────────────────── */
function TrustBadges() {
  const badges = [
    { icon: Leaf, label: "Sustainable" },
    { icon: Hand, label: "Handmade by Indian Artisans" },
    { icon: Truck, label: "Free Shipping" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px border border-gray-200 bg-gray-200">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center justify-center gap-2 bg-white px-3 py-3 text-center">
          <Icon className="w-4 h-4 shrink-0" style={{ color: "#997b47" }} />
          <span className="text-xs font-medium" style={{ color: "#444" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Star rating builder (shared) ─────────────────────────────────────────── */
function Stars({ rating, size = "w-3.5 h-3.5" }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${size} ${s <= rounded ? "fill-[#B08D3F] text-[#B08D3F]" : "text-gray-300"}`}
        />
      ))}
    </span>
  );
}


/* ─── Scrollable Product Row ───────────────────────────────────────────────── */
function ProductScrollRow({ items, title, path = "" }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1280px" }}>
        <h2 className="font-sans font-semibold mb-8" style={{ fontSize: "20px", color: "#1a1a1a", letterSpacing: "0.02em" }}>
          {title}
        </h2>
        <div className="relative">
          {canScrollLeft && (
            <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-lg">
              &#8249;
            </button>
          )}
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>{`.pdp-scroll::-webkit-scrollbar { display: none; }`}</style>
            {items.map((item) => (
              <Link key={item.slug} href={`/products/${item.slug}?path=${encodeURIComponent(path)}`} className="pdp-scroll block shrink-0 bg-white overflow-hidden group" style={{ width: "220px" }}>
                <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
                  <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="220px" />
                </div>
                <div className="px-3 py-3">
                  <p className="uppercase font-semibold tracking-wide text-xs" style={{ color: "#2B2B2B", fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}>{item.name}</p>
                  <p className="font-bold text-sm mt-1" style={{ color: "#2B2B2B" }}>{formatPrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
          {canScrollRight && (
            <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-lg">
              &#8250;
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Related Subcategories Row ────────────────────────────────────────────── */
function CategoryScrollRow({ categories }) {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1280px" }}>
        <h2 className="font-sans font-semibold mb-8" style={{ fontSize: "20px", color: "#1a1a1a", letterSpacing: "0.02em" }}>
          Related Subcategories
        </h2>
        <div className="relative">
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>{`.cat-scroll::-webkit-scrollbar { display: none; }`}</style>
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/her/${cat.slug}`} className="cat-scroll block shrink-0 bg-white overflow-hidden group" style={{ width: "220px" }}>
                <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="220px" />
                </div>
                <div className="px-3 py-3">
                  <p className="uppercase font-semibold tracking-wide text-xs" style={{ color: "#2B2B2B" }}>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
          {canScrollRight && (
            <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-lg">
              &#8250;
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Tabs (controlled) ────────────────────────────────────────────────────── */
function ProductTabs({ product, slug, reviews, stats, activeTab, onTabChange, onReviewCreated }) {
  const tabs = [
    "Description & Fit",
    "Wash & Care",
    "Materials",
    "Shipping & Returns",
    stats.count > 0 ? `Reviews (${stats.count})` : "Reviews",
  ];

  return (
    <section style={{ backgroundColor: "#ffffff" }}>
      {/* Tab bar */}
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1280px" }}>
        <div className="flex overflow-x-auto" style={{ backgroundColor: "#F5EDE7" }}>
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => onTabChange(i)}
              className="relative flex-1 min-w-max px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                color: activeTab === i ? "#1a1a1a" : "#666",
                borderRight: i < tabs.length - 1 ? "1px solid #e0d5cb" : "none",
              }}
            >
              <span className="relative z-10">{tab}</span>
              {activeTab === i && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-12"
                  style={{ backgroundColor: "#E8534A" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content panel */}
      <div className="mx-auto px-4 md:px-8 mt-[10px]" style={{ maxWidth: "1280px" }}>
        <div style={{ backgroundColor: "#F5EDE7", padding: "40px 48px" }}>
          {activeTab === 0 && (
            <div className="pdp-tab-content space-y-6">
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#333" }}>
                {product.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/70 border border-stone-200/60 shadow-soft-sm">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Fabric</span>
                  <span className="text-sm font-semibold text-[#141b28]">{product.details.fabric || "Handcrafted Sustainable"}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Fit</span>
                  <span className="text-sm font-semibold text-[#141b28]">{product.details.fit || "Relaxed Fit"}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Colour</span>
                  <span className="text-sm font-semibold text-[#141b28]">{product.details.colour || "Natural"}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">SKU</span>
                  <span className="text-sm font-mono font-medium text-[#141b28]">{product.details.sku}</span>
                </div>
              </div>

              {(product.model?.size || product.model?.text) && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs text-stone-700">
                  <span className="font-semibold text-stone-900">Model Dimensions:</span>{" "}
                  {product.model.size ? `Wearing Size ${product.model.size}` : ""}
                  {product.model.text ? ` (${product.model.text})` : ""}
                </div>
              )}
            </div>
          )}
          {activeTab === 1 && (
            <div className="pdp-tab-content space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Garment Care Instructions</h4>
              <ul className="space-y-2.5">
                {product.washCare.map((item, i) => (
                  <li key={i} className="text-sm flex items-center gap-2.5 text-stone-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#997b47] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-500 pt-2 border-t border-stone-200/50">
                Crafted with conscious, chemical-free methods. Gentle washing prolongs the vibrant natural fibers.
              </p>
            </div>
          )}
          {activeTab === 2 && (
            <div className="pdp-tab-content space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Sustainable Materials</h4>
              <div className="text-sm leading-relaxed space-y-2.5 text-stone-800">
                {product.materials.split("\n").filter(Boolean).map((line, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="text-[#997b47] font-bold">•</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <div className="pdp-tab-content space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-white/70 border border-stone-200/60 space-y-2">
                  <h4 className="text-sm font-bold text-[#141b28] flex items-center gap-2">
                    <span>🚚</span> Shipping & Dispatch
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Enjoy <strong>Free Shipping across India</strong> on all orders. As part of our conscious slow-fashion model, each garment is handcrafted in small batches, typically dispatched within <strong>5–7 business days</strong> and delivered in <strong>8–14 working days</strong>.
                  </p>
                  <Link href="/shipping" className="inline-block text-xs font-semibold text-[#997b47] hover:underline pt-1">
                    Read Shipping Policy →
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-white/70 border border-stone-200/60 space-y-2">
                  <h4 className="text-sm font-bold text-[#141b28] flex items-center gap-2">
                    <span>🌱</span> Returns & Exchange Policy
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    To prevent waste, we follow a <strong>strict no return or exchange policy</strong>. However, if you receive an <strong>incorrect product</strong> or <strong>incorrect size</strong>, contact us within <strong>48 hours of delivery</strong> with clear photo proof for an immediate replacement.
                  </p>
                  <Link href="/returns" className="inline-block text-xs font-semibold text-[#997b47] hover:underline pt-1">
                    Read Returns & Exchange Policy →
                  </Link>
                </div>
              </div>
            </div>
          )}
          {activeTab === 4 && (
            <div className="pdp-tab-content">
              <ProductReviewsSection
                slug={slug}
                productName={product.name}
                productId={product._id || product.id}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── The Inspiration (Full-Width Designer Banner) ────────────────────────── */
function TheInspiration({ product }) {
  if (!product || !product.inspiration_image) return null;

  const bannerUrl = getImageUrl(product.inspiration_image);

  return (
    <section className="w-full py-6 md:py-12 bg-[#FAF8F4] overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-soft border border-[#f0e6dc] bg-white">
          <img
            src={bannerUrl}
            alt={product.name ? `${product.name} - The Inspiration` : "The Inspiration"}
            className="w-full h-auto object-cover block"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Dynamic Breadcrumb ───────────────────────────────────────────────────── */
const BREADCRUMB_ROUTE_INFO = {
  her: { label: "Her", href: "/her" },
  him: { label: "Him", href: "/him" },
  "dog-togs": { label: "Dog Togs", href: "/dog-togs" },
  dog_togs: { label: "Dog Togs", href: "/dog_togs" },
  collections: { label: "Collections", href: "/collections" },
  shop: { label: "Shop", href: "/shop" },
  products: { label: "All Products" },
  topwear: { label: "Topwear" },
  bottomwear: { label: "Bottomwear" },
  dresses: { label: "Dresses" },
  outerwear: { label: "Outerwear" },
  accessories: { label: "Accessories" },
  festive: { label: "Festive" },
  "festive-wear": { label: "Festive" },
  pawsails: { label: "Pawsails" },
  pristine: { label: "Pristine" },
  evolve: { label: "Evolve" },
  ekam: { label: "E.K.A.M." },
  new: { label: "New Arrivals", href: "/new" },
  blog: { label: "Blog", href: "/blog" },
  sustainability: { label: "Sustainability", href: "/sustainability" },
};

function getBreadcrumbTrail(path, productName) {
  const parts = (path || "").split("/").filter(Boolean);
  const trail = [];
  let href = "";
  parts.forEach((part) => {
    const info = BREADCRUMB_ROUTE_INFO[part];
    if (!info) return;
    href = href ? `${href}/${part}` : info.href || `/${part}`;
    trail.push({ label: info.label, href });
  });
  if (trail.length === 0) trail.push({ label: "Shop", href: "/shop" });
  trail.push({ label: productName, href: null });
  return trail;
}

/* ─── Main Client Component ────────────────────────────────────────────────── */
export default function ProductDetailClient({ slug, breadcrumbPath: propBreadcrumbPath }) {
  const [apiProduct, setApiProduct] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);

  // Try fetching from API first
  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const cleanSlug = encodeURIComponent(String(slug).trim());
        const res = await productsApi.getOne(cleanSlug);
        if (res.data) {
          setApiProduct(res.data.data || res.data);
        }
      } catch (e) {
        // fallback to static
      } finally {
        setApiLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  // Build product from API
  const product = apiProduct ? {
    name: apiProduct.name,
    collection: apiProduct.collection?.name || "Flaunt Green",
    price: Number(apiProduct.price),
    description: apiProduct.description || "A sustainably crafted piece from our collection.",
    details: {
      size: apiProduct.model_size || "Standard",
      measurements: apiProduct.model_measurements || "",
      fabric: apiProduct.fabric || "Handcrafted Sustainable Fabric",
      colour: apiProduct.colour || apiProduct.variants?.[0]?.color_name || "Natural",
      fit: apiProduct.fit || "Relaxed Fit",
      sku: apiProduct.sku || `FG-${String(slug || "").toUpperCase().slice(0, 8)}`,
    },
    model: { 
      text: apiProduct.model_measurements || "", 
      size: apiProduct.model_size || "M" 
    },
    colors: apiProduct.variants && apiProduct.variants.length > 0
      ? [...new Map(apiProduct.variants.map(v => [v.color_name || "Default", { name: v.color_name || "Default", value: v.color_hex || "#888888" }])).values()]
      : [{ name: "Default", value: "#888888" }],
    sizes: apiProduct.variants && apiProduct.variants.length > 0
      ? [...new Set(apiProduct.variants.filter(v => v.stock > 0 || true).map(v => v.size))].filter(Boolean)
      : ["S", "M", "L", "XL"],
    images: apiProduct.images && apiProduct.images.length > 0
      ? apiProduct.images.map(img => getImageUrl(img.image_url))
      : ["/placeholder.jpg"],
    washCare: apiProduct.wash_care && Array.isArray(apiProduct.wash_care) && apiProduct.wash_care.length > 0
      ? apiProduct.wash_care
      : (typeof apiProduct.wash_care === "string" && apiProduct.wash_care.trim()
          ? apiProduct.wash_care.split("\n").filter(Boolean)
          : ["Hand Wash in Cold Water", "Do Not Bleach", "Dry in Shade", "Warm Iron on Reverse"]),
    materials: apiProduct.materials || apiProduct.materials_info || "100% Certified Organic & Sustainable Fabric, handcrafted with care.",
    shipping: "Free Shipping across India! Small-batch sustainable production dispatched in 5-7 business days, delivered in 8-14 working days.",
    returns: "We follow a conscious slow-fashion model with a no return/exchange policy. If you receive an incorrect product or size, contact us within 48 hours for replacement.",
    styleWith: [],
    similar: [],
    relatedCategories: [],
    // Store variants for inventory lookups
    _variants: apiProduct.variants || [],
    _id: apiProduct.id,
  } : null;

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [path, setPath] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ count: 0, avg: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const searchParams = useSearchParams();
  const cart = useCartStore();
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    s.items.some((i) => i.id === (apiProduct?.id || product?._id || slug) || (slug && i.slug === slug))
  );
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const isInCart = cart.items.some(
    (i) => i.product_id === apiProduct?.id || i.product_id === slug || i.id === apiProduct?.id
  );
  const cartItem = cart.items.find(
    (i) => i.product_id === apiProduct?.id || i.product_id === slug || i.id === apiProduct?.id
  );

  const handleToggleWishlist = () => {
    if (!isAuthenticated()) {
      toast.error("Please log in to add to wishlist");
      router.push(`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/wishlist")}`);
      return;
    }
    const wishlistItem = {
      id: apiProduct?.id || slug,
      product_id: apiProduct?.id || slug,
      slug: slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.jpg",
      category: product.category,
    };
    toggleWishlist(wishlistItem);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  useEffect(() => {
    setPath(searchParams.get("path") || "");
  }, [searchParams]);

  const breadcrumbPath = path || propBreadcrumbPath || (product ? "her/topwear" : "");

  // Build inventory from API variants or static
  const inventory = product ? (() => {
    if (apiProduct && apiProduct.variants) {
      const inv = {};
      apiProduct.variants.forEach(v => {
        if (v.size) {
          inv[v.size] = (inv[v.size] || 0) + (v.stock || 0);
        }
      });
      return inv;
    }
    return getInventoryForSlug(slug, product.sizes);
  })() : {};

  const selectedVariant = (apiProduct && apiProduct.variants) ? (
    apiProduct.variants.find(v => 
      v.size === selectedSize && (v.color_name === product?.colors?.[selectedColor]?.name || !v.color_name)
    ) || apiProduct.variants.find(v => v.size === selectedSize)
      || apiProduct.variants[0]
  ) : null;

  const stockForSize = selectedVariant 
    ? (selectedVariant.stock ?? 0)
    : (inventory[selectedSize] ?? 0);

  const maxQty = Math.max(1, stockForSize > 0 ? stockForSize : 1);

  const refreshReviews = useCallback(() => {
    if (!slug) return;
    const currentUser = useAuthStore.getState().user;
    reviewsApi.getByProduct(slug, { user_id: currentUser?.id, email: currentUser?.email })
      .then((res) => {
        if (res.data && res.data.reviews) {
          setReviews(res.data.reviews);
          if (res.data.stats) {
            setStats(res.data.stats);
          }
        }
      })
      .catch((err) => {
        console.warn("Reviews load notice:", err?.message || err);
      });
  }, [slug]);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  const openReviews = useCallback(() => {
    setActiveTab(4);
    setTimeout(() => {
      document.getElementById("pdp-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    if (!isAuthenticated()) {
      toast.error("Please log in to add items to your cart.");
      router.push(`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/cart")}`);
      return;
    }

    // For API products, look up the specific variant
    if (apiProduct && apiProduct.variants) {
      const selectedColorName = product.colors[selectedColor]?.name;
      const variant = selectedVariant || apiProduct.variants[0];

      if (!variant || variant.stock <= 0) {
        toast.error("This size/color is currently out of stock.");
        return;
      }

      // Check current quantity already in cart
      const existingKey = `${apiProduct.id}-${selectedSize || ""}-${selectedColorName || ""}`;
      const existingInCart = cart.items.find(
        (i) => i._cartKey === existingKey || (i.product_id === apiProduct.id && i.size === selectedSize && i.color === selectedColorName)
      );
      const alreadyInCartQty = existingInCart ? existingInCart.quantity : 0;

      if (alreadyInCartQty >= variant.stock) {
        toast.error(`You already have all ${variant.stock} available unit(s) in your cart.`);
        return;
      }

      const primaryImage = apiProduct.images?.[0]
        ? getImageUrl(apiProduct.images[0].image_url)
        : "/placeholder.jpg";

      cart.addItem({
        product_id: apiProduct.id,
        variant_id: variant.id,
        name: product.name,
        price: product.price,
        image: primaryImage,
        size: selectedSize,
        color: selectedColorName,
        stock: variant.stock,
      }, qty);
    } else {
      // Static fallback
      if (stockForSize <= 0) {
        toast.error("This size is currently out of stock.");
        return;
      }
      cart.addItem({
        product_id: slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        size: selectedSize,
        color: product.colors[selectedColor]?.name,
        stock: stockForSize,
      }, Math.min(qty, stockForSize));
    }
    toast.success("Added to cart!");
  };

  if (apiLoading) {
    return (
      <div style={{ backgroundColor: "#ffffff" }}>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-400">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    const fallbackLabel = String(slug || "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const trail = getBreadcrumbTrail(breadcrumbPath, fallbackLabel);
    return (
      <div style={{ backgroundColor: "#ffffff" }}>
        <Header />
        <div className="mx-auto px-4 md:px-8 py-4" style={{ maxWidth: "1280px" }}>
          <nav className="flex items-center gap-1.5 text-xs" style={{ color: "#888" }}>
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            {trail.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <span>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-gray-900 transition-colors">{crumb.label}</Link>
                ) : (
                  <span style={{ color: "#555" }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
        <div className="container-site py-20 text-center">
          <h1 className="font-heading text-3xl mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-gold">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const styleWithProducts = [];
  const similarProducts = [];

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* ── Header ── */}
      <Header />

      {/* ── Breadcrumb (dynamic from navigation path) ── */}
      <div className="mx-auto px-4 md:px-8 py-4" style={{ maxWidth: "1280px" }}>
        <nav className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: "#888" }}>
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          {getBreadcrumbTrail(breadcrumbPath, product.name).map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              <span>/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-gray-900 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: "#555" }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* ── Product Hero ── */}
      <section className="mx-auto px-4 md:px-8 pb-14" style={{ maxWidth: "1280px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <ImageGallery images={product.images} />
          </div>

          <div className="lg:col-span-3 flex flex-col gap-5">
            <p className="text-sm" style={{ color: "#B08D3F" }}>
              Collection <span className="mx-1">&bull;</span> {product.collection}
            </p>

            <h1 className="font-heading font-semibold" style={{ fontSize: "clamp(28px, 3vw, 36px)", color: "#1a1a1a", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <p className="text-sm leading-relaxed" style={{ color: "#666", maxWidth: "520px" }}>
              {product.description}
            </p>

            <StarRating rating={stats.avg} count={stats.count} onViewReviews={openReviews} />

            {/* Price */}
            <div>
              <p className="font-bold" style={{ fontSize: "28px", color: "#1a1a1a" }}>{formatPrice(product.price)}</p>
              <p className="text-xs mt-0.5" style={{ color: "#888" }}>Inclusive of all Taxes.</p>
            </div>

            {/* Model info line - data driven per product */}
            {product.model && (
              <p className="text-xs leading-relaxed" style={{ color: "#777" }}>
                Model ({product.model.text}) is wearing Size {product.model.size}
              </p>
            )}

            <ColorSelector colors={product.colors} selected={selectedColor} onSelect={setSelectedColor} />
            <SizeSelector
              sizes={product.sizes}
              inventory={inventory}
              selected={selectedSize}
              onSelect={setSelectedSize}
              onOpenGuide={() => setSizeGuideOpen(true)}
            />

            <div className="flex items-center gap-3 mt-1">
              <QuantitySelector qty={qty} onChange={setQty} max={maxQty} />
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stockForSize <= 0}
                className="flex-1 h-11 border-2 border-[#997b47] text-gray-900 bg-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#997b47] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
              >
                {stockForSize <= 0 ? "Out of Stock" : isInCart ? `In Cart (${cartItem.quantity}) — Add More` : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`w-11 h-11 border flex items-center justify-center transition-all duration-200 ${
                  isWishlisted
                    ? "border-rose-300 bg-rose-50 text-rose-500 shadow-sm"
                    : "border-gray-300 bg-white text-gray-500 hover:text-rose-500 hover:border-rose-300"
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 transition-transform ${isWishlisted ? "fill-rose-500 text-rose-500 scale-105" : ""}`} />
              </button>
            </div>

            <p className="text-xs italic" style={{ color: "#888" }}>
              {stockForSize > 0 && stockForSize <= 3
                ? `Only ${stockForSize} left in this size — order soon.`
                : "Limited Edition collection."}
            </p>

            {/* Trust badges */}
            <TrustBadges />

            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#888" }}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Small Batch Fashion: 48-hr issue resolution — <Link href="/returns" className="underline hover:text-[#997b47]">Check Returns Policy</Link></span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs (description, care, materials, shipping, reviews) ── */}
      <ProductTabs
        product={product}
        slug={slug}
        reviews={reviews}
        stats={stats}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReviewCreated={refreshReviews}
      />

      {/* ── Style With ── */}
      {styleWithProducts.length > 0 && (
        <section className="py-14 md:py-20 bg-white">
          <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1280px" }}>
            <h2 className="font-sans font-semibold mb-8" style={{ fontSize: "20px", color: "#1a1a1a", letterSpacing: "0.02em" }}>Style With</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {styleWithProducts.map((item) => (
                <Link key={item.slug} href={`/products/${item.slug}?path=${encodeURIComponent(breadcrumbPath)}`} className="block bg-white overflow-hidden group">
                  <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
                    <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                  <div className="px-3 py-3">
                    <p className="uppercase font-semibold tracking-wide text-xs" style={{ color: "#2B2B2B", fontFamily: "var(--font-heading), 'Playfair Display', serif" }}>{item.name}</p>
                    <p className="font-bold text-sm mt-1" style={{ color: "#2B2B2B" }}>{formatPrice(item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── The Inspiration (Full Width Designer Banner) ── */}
      {(apiProduct?.inspiration_image || product?.inspiration_image) && (
        <TheInspiration product={apiProduct || product} />
      )}

      {/* ── Similar Products ── */}
      {similarProducts.length > 0 && <ProductScrollRow items={similarProducts} title="Similar Products" path={breadcrumbPath} />}

      {/* ── Related Subcategories ── */}
      <CategoryScrollRow categories={product.relatedCategories} />

      {/* ── Related Blogs (reused) ── */}
      <FeaturedArticles />

      <NewsletterSection />
      <Footer />

      {/* ── Size Guide Modal ── */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        breadcrumbPath={breadcrumbPath}
      />
    </div>
  );
}