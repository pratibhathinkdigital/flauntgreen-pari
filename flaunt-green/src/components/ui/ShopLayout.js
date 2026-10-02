"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ShoppingCart, Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore }    from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { productsApi, categoriesApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";
import toast from "react-hot-toast";
import NewsletterSection from "@/components/sections/NewsletterSection";
const GENDERS     = ["Women", "Men", "Pets"];
const PRICE_RANGES = [
  { label: "Under ₹3,000",       min: 0,     max: 3000  },
  { label: "₹3,000 – ₹6,000",   min: 3000,  max: 6000  },
  { label: "₹6,000 – ₹10,000",  min: 6000,  max: 10000 },
  { label: "Above ₹10,000",      min: 10000, max: Infinity },
];

const PRODUCTS_PER_PAGE = 9;

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const router = useRouter();
  const addToCart      = useCartStore((s) => s.addItem);
  const cartItems      = useCartStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted   = useWishlistStore((s) =>
    s.items.some((i) => i.id === product.id || i.product_id === product.id || (product.slug && i.slug === product.slug))
  );
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const cartItem = cartItems.find((i) => i.product_id === product.id || i.id === product.id);
  const isInCart = Boolean(cartItem);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }
    const wishlistItem = {
      id: product.id,
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: primaryImage,
      category: product.category,
    };
    toggleWishlist(wishlistItem);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  const primaryImage = getImageUrl(
    product.primary_image?.image_url || product.images?.[0]?.image_url,
    "/placeholder.png"
  );

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={primaryImage} fill alt={product.name}
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* In Cart Badge */}
        {isInCart && (
          <span className="absolute top-3 left-3 bg-[#41542f] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" /> In Cart ({cartItem.quantity})
          </span>
        )}

        {/* Wishlist Button — Always visible if wishlisted with red heart */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm z-10 ${
            isWishlisted
              ? "opacity-100 bg-white border-rose-300 text-rose-600 shadow-md"
              : "opacity-0 group-hover:opacity-100 bg-white/95 border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:scale-105"
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? "fill-rose-500 text-rose-500 scale-105" : ""}`} />
        </button>

        {/* Add to cart shortcut */}
        <button
          type="button"
          onClick={(e) => { 
            e.preventDefault(); 
            if (!isAuthenticated()) {
              toast.error("Please login to add to cart");
              router.push("/login?redirect=/cart");
              return;
            }
            const variant = product.variants?.[0];
            if (!variant || (variant.stock !== undefined && variant.stock <= 0)) {
              toast.error("Out of stock");
              return;
            }
            addToCart({ 
              product_id: product.id, 
              variant_id: variant.id, 
              name: product.name, 
              price: product.price, 
              image: primaryImage,
              size: variant.size,
              color: variant.color_name,
              stock: variant.stock
            }); 
            toast.success("Added to cart!"); 
          }}
          className={`absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
            isInCart
              ? "bg-[#41542f] text-white translate-y-0 shadow-md"
              : "bg-black text-white translate-y-full group-hover:translate-y-0 hover:bg-[#344325]"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isInCart ? `In Cart (${cartItem.quantity}) — Add +1` : "Add to Cart"}
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 border-t border-gray-100">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-black mb-1 hover:text-[#997b47] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] text-gray-400 font-sans tracking-wider mb-1">
          {product.category?.name || "Category"}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          ₹{Number(product.price).toLocaleString("en-IN")}.00/-
        </p>
      </div>
    </div>
  );
}

// ── Filter Checkbox ───────────────────────────────────────────────────────────
function FilterCheck({ label, checked, onChange, color }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <input
        type="checkbox" checked={checked} onChange={onChange}
        className="w-4 h-4 border-2 border-gray-300 rounded-sm accent-black cursor-pointer"
      />
      <span className={`text-sm group-hover:text-black transition-colors ${checked ? "text-black font-medium" : "text-gray-600"} ${color || ""}`}>
        {label}
      </span>
    </label>
  );
}

// ── Main Shop Layout ──────────────────────────────────────────────────────────
export default function ShopLayout({ title = "Shop All", fetchParams = {} }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const effectiveSection = fetchParams?.section || searchParams?.get("section") || undefined;
  const effectiveCategory = fetchParams?.category || searchParams?.get("category") || undefined;
  const effectiveCollection = fetchParams?.collection || searchParams?.get("collection") || undefined;
  const effectiveSearch = fetchParams?.search || searchParams?.get("search") || undefined;

  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders,    setSelectedGenders]    = useState([]);
  const [selectedPrices,     setSelectedPrices]     = useState([]);
  const [sidebarOpen,        setSidebarOpen]        = useState(false);
  const [currentPage,        setCurrentPage]        = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [effectiveSection, effectiveCategory, effectiveCollection, effectiveSearch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (effectiveSection) params.section = effectiveSection;
      if (effectiveCategory) params.category = effectiveCategory;
      if (effectiveCollection) params.collection = effectiveCollection;
      if (effectiveSearch) params.search = effectiveSearch;
      
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll(params),
        categoriesApi.getAll()
      ]);
      setProducts(prodRes.data);
      setDbCategories([...new Set(catRes.data.map(c => c.name))]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catOk   = selectedCategories.length === 0 || selectedCategories.includes(p.category?.name);
      
      // Determine pseudo-gender based on section
      let pGender = "Women";
      if (p.category?.section === "him") pGender = "Men";
      if (p.category?.section === "dog-togs") pGender = "Pets";
      const isUnisex = p.category?.section === "unisex";
      
      const genOk   = selectedGenders.length === 0 || 
                      (isUnisex && (selectedGenders.includes("Women") || selectedGenders.includes("Men"))) ||
                      selectedGenders.includes(pGender);
      const priceOk = selectedPrices.length === 0 || selectedPrices.some((label) => {
        const range = PRICE_RANGES.find((r) => r.label === label);
        return range && Number(p.price) >= range.min && Number(p.price) < range.max;
      });
      return catOk && genOk && priceOk;
    });
  }, [products, selectedCategories, selectedGenders, selectedPrices]);

  const totalPages  = Math.ceil(filtered.length / PRODUCTS_PER_PAGE) || 1;
  const paginated   = filtered.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const activeCount = selectedCategories.length + selectedGenders.length + selectedPrices.length;

  const clearAll = () => { setSelectedCategories([]); setSelectedGenders([]); setSelectedPrices([]); setCurrentPage(1); };

  // ── Sidebar JSX ─────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className="w-full border border-gray-200 bg-gray-50/50 p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-heading font-bold text-lg">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-black underline transition-colors">Clear all</button>
        )}
      </div>

      {/* Category */}
      <div className="mb-7">
        <h4 className="font-heading font-bold text-base mb-3 text-black">Category</h4>
        <div className="space-y-1.5">
          {dbCategories.map((cat) => (
            <FilterCheck key={cat} label={cat} checked={selectedCategories.includes(cat)}
              onChange={() => { toggle(selectedCategories, setSelectedCategories, cat); setCurrentPage(1); }} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-7" />

      {/* Gender */}
      <div className="mb-7">
        <h4 className="font-heading font-bold text-base mb-3 text-black">Gender</h4>
        <div className="space-y-1.5">
          {GENDERS.map((g) => (
            <FilterCheck key={g} label={g}
              color={g.startsWith("Pets") ? "text-gray-400" : ""}
              checked={selectedGenders.includes(g)}
              onChange={() => { toggle(selectedGenders, setSelectedGenders, g); setCurrentPage(1); }} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-7" />

      {/* Price */}
      <div className="mb-7">
        <h4 className="font-heading font-bold text-base mb-3 text-black">Price Range</h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((r) => (
            <FilterCheck key={r.label} label={r.label} checked={selectedPrices.includes(r.label)}
              onChange={() => { toggle(selectedPrices, setSelectedPrices, r.label); setCurrentPage(1); }} />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* ── Page Header ── */}
      <div className="border-b border-gray-100 py-8">
        <div className="container-site">
          <div className="relative flex items-end justify-between">
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-black text-center" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", letterSpacing: "-0.02em" }}>
                {title}
              </h1>
            </div>
            <div className="invisible font-heading font-bold text-3xl md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
              {title}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden md:block">{filtered.length} products</span>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm font-medium hover:border-black transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeCount > 0 && `(${activeCount})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Filter / Search Chips ── */}
      {(activeCount > 0 || effectiveSearch) && (
        <div className="border-b border-gray-100 py-3 bg-slate-50/50">
          <div className="container-site flex items-center gap-2 flex-wrap">
            {effectiveSearch && (
              <span className="flex items-center gap-1.5 bg-[#41542f] text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">
                <span>Search: &ldquo;{effectiveSearch}&rdquo;</span>
                <button
                  onClick={() => router.push("/shop")}
                  className="hover:text-amber-200 transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {[...selectedCategories, ...selectedGenders, ...selectedPrices].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 bg-black text-white text-xs px-3 py-1.5 font-medium">
                {tag}
                <button onClick={() => {
                  if (selectedCategories.includes(tag)) toggle(selectedCategories, setSelectedCategories, tag);
                  else if (selectedGenders.includes(tag)) toggle(selectedGenders, setSelectedGenders, tag);
                  else toggle(selectedPrices, setSelectedPrices, tag);
                  setCurrentPage(1);
                }}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="container-site py-10">
        <div className="flex gap-10">

          {/* ── Desktop Sidebar ── */}
          <div className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* ── Mobile Sidebar Drawer ── */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative bg-white w-72 h-full overflow-y-auto p-6 shadow-xl">
                <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
                  <X className="w-4 h-4" />
                </button>
                <Sidebar />
              </div>
            </div>
          )}

          {/* ── Products Section ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-24">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-gray-400">Loading products…</p>
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-heading text-2xl text-gray-400 mb-4">No products found</p>
                <p className="text-sm text-gray-400 mb-4">Add products from the Admin panel to see them here.</p>
                <button onClick={clearAll} className="text-sm underline text-gray-500 hover:text-black">Clear filters</button>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginated.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div className="mt-14 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 flex items-center justify-center text-sm font-medium border transition-colors ${
                          currentPage === page
                            ? "bg-black text-white border-black"
                            : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 flex items-center justify-center border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Page count info */}
                <p className="text-center text-xs text-gray-400 mt-4">
                  Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} of {filtered.length} products
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
