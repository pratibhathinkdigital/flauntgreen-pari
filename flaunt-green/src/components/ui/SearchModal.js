"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Tag, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/api/useProducts";
import { getImageUrl } from "@/lib/axios";
import { categoriesApi, collectionsApi } from "@/services/api";

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 250);
  const inputRef = useRef(null);

  const [allCategories, setAllCategories] = useState([]);
  const [allCollections, setAllCollections] = useState([]);

  // Fetch categories & collections once for instant category suggestion matching
  useEffect(() => {
    if (isOpen && allCategories.length === 0) {
      categoriesApi.getAll().then((res) => {
        setAllCategories(Array.isArray(res.data) ? res.data : []);
      }).catch(() => {});
      collectionsApi.getAll().then((res) => {
        setAllCollections(Array.isArray(res.data) ? res.data : []);
      }).catch(() => {});
    }
  }, [isOpen]);

  const { data: results, isLoading } = useProducts(
    debouncedQuery ? { search: debouncedQuery, limit: 8 } : {}
  );

  const productsList = Array.isArray(results)
    ? results
    : (results?.products && Array.isArray(results.products) ? results.products : []);

  // Matching categories & collections
  const matchingCategories = debouncedQuery
    ? allCategories.filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        c.slug?.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingCollections = debouncedQuery
    ? allCollections.filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        c.slug?.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 animate-fade-in flex flex-col items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl mt-16 sm:mt-24 px-4 z-10 animate-slide-down">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          {/* Input Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <Search className="w-5 h-5 text-[#997b47] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, fabrics, categories, collections..."
              className="flex-1 text-base outline-none bg-transparent text-slate-900 placeholder:text-slate-400 font-medium"
              id="search-modal-input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Categories & Collections matched */}
          {debouncedQuery && (matchingCategories.length > 0 || matchingCollections.length > 0) && (
            <div className="px-5 py-3 bg-[#faf7f2] border-b border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Quick Jump:
              </span>
              {matchingCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/${c.section === "him" ? "him" : "her"}/${c.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#997b47] hover:text-[#997b47] font-medium transition-all shadow-2xs"
                >
                  <Tag className="w-3 h-3 text-[#997b47]" />
                  <span>{c.name}</span>
                </Link>
              ))}
              {matchingCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#997b47] hover:text-[#997b47] font-medium transition-all shadow-2xs"
                >
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>{col.name}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 p-2">
            {!debouncedQuery ? (
              <div className="py-12 px-6 text-center text-slate-400 text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="font-medium text-slate-600">Start typing to search catalog...</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching "Tee", "Dress", "Organic Cotton", "Pristine", or "Ekam"
                </p>
              </div>
            ) : isLoading ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-14 h-14 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : productsList.length > 0 ? (
              <>
                <div className="p-1 space-y-1">
                  {productsList.map((product) => {
                    const rawImg =
                      product.primary_image?.image_url ||
                      product.primary_image?.url ||
                      product.image_url ||
                      (product.images && product.images[0]?.image_url);
                    const imgSrc = getImageUrl(rawImg) || "/placeholder-product.jpg";

                    return (
                      <Link
                        key={product.id || product._id || product.slug}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-all group"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-2xs">
                          <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="56px"
                            unoptimized={imgSrc.startsWith("http")}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-[#997b47] transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            {product.category?.name && (
                              <span className="font-medium text-slate-600">
                                {product.category.name}
                              </span>
                            )}
                            {product.collection?.name && (
                              <>
                                <span>•</span>
                                <span className="text-[#997b47] font-medium">
                                  {product.collection.name}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#997b47] group-hover:translate-x-0.5 transition-transform">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Footer action: See all */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100 mt-2">
                  <Link
                    href={`/shop?search=${encodeURIComponent(debouncedQuery)}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-[#41542f] hover:text-white hover:border-[#41542f] transition-all shadow-2xs"
                  >
                    <span>View all matching products for "{debouncedQuery}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 text-sm">
                <p className="font-semibold text-slate-700">No products found</p>
                <p className="text-xs text-slate-400 mt-1">
                  We couldn't find any results for "{debouncedQuery}". Try another keyword or category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
