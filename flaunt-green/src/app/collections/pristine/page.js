"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Image from "next/image";
import Link from "next/link";
import { productsApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}.00/-`;
}

const capsuleImages = [
  "/assets/pristine/capsule_look images/img-4589.webp",
  "/assets/pristine/capsule_look images/img-4750.webp",
  "/assets/pristine/capsule_look images/img-4889.webp",
  "/assets/pristine/capsule_look images/img-5084.webp",
  "/assets/pristine/capsule_look images/img-5279.webp",
  "/assets/pristine/capsule_look images/img-5436.webp",
  "/assets/pristine/capsule_look images/img-5845.webp",
  "/assets/pristine/capsule_look images/img-5986.webp",
  "/assets/pristine/capsule_look images/img-6071.webp",
  "/assets/pristine/capsule_look images/img-6311.webp",
  "/assets/pristine/capsule_look images/img-6373.webp",
  "/assets/pristine/capsule_look images/img-6479.webp",
  "/assets/pristine/capsule_look images/img-6606.webp",
  "/assets/pristine/capsule_look images/img-6649.webp",
  "/assets/pristine/capsule_look images/img-6783.webp",
];

const categories = ["Topwear", "Outerwear", "Bottomwear", "Dresses", "Accessories"];
const genders = ["Women", "Men", "Unisex"];
const priceRanges = [
  { label: "Under ₹3,000", min: 0, max: 2999 },
  { label: "₹3,000–₹5,000", min: 3000, max: 5000 },
  { label: "Over ₹5,000", min: 5001, max: Infinity },
];

export default function PristinePage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getAll({ collection: "pristine" })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((p) => {
            let gender = "Women";
            if (p.category?.section === "him") gender = "Men";
            if (p.category?.section === "unisex") gender = "Unisex";
            return {
              id: p.id,
              slug: p.slug,
              name: p.name,
              price: Number(p.price),
              gender: gender,
              category: p.category?.name || "Outerwear",
              img: getImageUrl(p.primary_image?.image_url || p.images?.[0]?.image_url, "/placeholder.png"),
            };
          });
          setDbProducts(mapped);
        } else {
          setDbProducts([]);
        }
      })
      .catch(() => setDbProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const allProducts = dbProducts;

  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const toggleFilter = (arr, setArr, val) => {
    setArr((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  const filtered = allProducts.filter((p) => {
    if (selectedCategories.length && !selectedCategories.some((c) => p.category?.toLowerCase().includes(c.toLowerCase()))) return false;
    if (selectedGenders.length && !selectedGenders.includes(p.gender)) return false;
    if (selectedPrices.length) {
      const match = selectedPrices.some((label) => {
        const range = priceRanges.find((r) => r.label === label);
        return range && p.price >= range.min && p.price <= range.max;
      });
      if (!match) return false;
    }
    return true;
  });

  const checkCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkCarouselScroll();
    el.addEventListener("scroll", checkCarouselScroll, { passive: true });
    window.addEventListener("resize", checkCarouselScroll);
    return () => {
      el.removeEventListener("scroll", checkCarouselScroll);
      window.removeEventListener("resize", checkCarouselScroll);
    };
  }, [checkCarouselScroll]);

  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 400 : -400, behavior: "smooth" });
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-semibold text-sm mb-3" style={{ color: "#1a1a1a" }}>Category</h3>
        {categories.map((c) => (
          <label key={c} className="flex items-center gap-2 mb-2 cursor-pointer text-sm" style={{ color: "#333" }}>
            <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleFilter(selectedCategories, setSelectedCategories, c)} className="accent-[#1F4A3D]" />
            {c}
          </label>
        ))}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3" style={{ color: "#1a1a1a" }}>Gender</h3>
        {genders.map((g) => (
          <label key={g} className="flex items-center gap-2 mb-2 cursor-pointer text-sm" style={{ color: "#333" }}>
            <input type="checkbox" checked={selectedGenders.includes(g)} onChange={() => toggleFilter(selectedGenders, setSelectedGenders, g)} className="accent-[#1F4A3D]" />
            {g}
          </label>
        ))}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3" style={{ color: "#1a1a1a" }}>Price Range</h3>
        {priceRanges.map((r) => (
          <label key={r.label} className="flex items-center gap-2 mb-2 cursor-pointer text-sm" style={{ color: "#333" }}>
            <input type="checkbox" checked={selectedPrices.includes(r.label)} onChange={() => toggleFilter(selectedPrices, setSelectedPrices, r.label)} className="accent-[#1F4A3D]" />
            {r.label}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Header />

      {/* ── 1. Hero Section ── */}
      <section className="relative w-full flex items-center justify-center" style={{ height: "min(80vh, 700px)" }}>
        <Image src="/assets/pristine/PB.png" alt="Pristine Hero" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />
        <div className="absolute inset-x-0 bottom-12 z-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <Link
            href="/collections/pristine/discover"
            className="rounded-none inline-block text-center text-xs uppercase tracking-[2px] font-medium px-[30px] py-[14px] bg-[#8C7A4E] text-[#F5F1E8] transition-all duration-[250ms] hover:bg-[#7A6A3E]"
          >
            Discover Pristine
          </Link>
          <a
            href="#products"
            className="rounded-none inline-block text-center text-xs uppercase tracking-[2px] font-medium px-[30px] py-[14px] bg-[#8C7A4E] text-[#F5F1E8] transition-all duration-[250ms] hover:bg-[#7A6A3E]"
          >
            Explore Products
          </a>
        </div>
      </section>

      {/* ── 2. Inspiration Text Section ── */}
      <section id="inspiration" style={{ scrollMarginTop: "112px", backgroundColor: "#fff", borderTop: "1px solid #000", padding: "40px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontWeight: 700, fontSize: "26px", color: "#1a1a1a", marginBottom: "20px" }}>
            Inspiration
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "17px", lineHeight: 1.6, color: "#1a1a1a", marginBottom: "16px" }}>
            Our latest work wear collection Pristine derives inspiration from the receding glaciers of the majestic landscapes of the HKH mountain ranges and the clothing typical to its indigenous people. This collection is defined by its bold colours and confident silhouettes. The garments are crafted out of Khadi in varying textures, EcoVero, and Modal fabrics. Pristine offers versatile and functional garments that make a robust capsule collection for the modern professional.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "17px", lineHeight: 1.6, color: "#1a1a1a" }}>
            Staying true to our commitment to sustainable practices, we have maximised fabric consumption, used azo-free dyes, recycled threads, corozo and wooden buttons, and YKK zippers - for handcrafted excellence.
          </p>
        </div>
      </section>

      {/* ── 3. Product Listing Section ── */}
      <section id="products" className="py-12" style={{ scrollMarginTop: "112px", backgroundColor: "#fafafa" }}>
        <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1400px" }}>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: "#ccc", color: "#333" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M6 12h12M8 18h8" /></svg>
            Filters
          </button>

          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className={`${mobileFiltersOpen ? "block" : "hidden"} md:block w-full md:w-56 flex-shrink-0`}>
              <div className="sticky top-24 bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-base mb-5 flex items-center gap-2" style={{ color: "#1a1a1a" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M6 12h12M8 18h8" /></svg>
                  Filters
                </h3>
                <FilterPanel />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <p className="mb-4 text-sm" style={{ color: "#888" }}>{filtered.length} products</p>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#997b47]"></div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
                  <p className="font-heading text-2xl mb-2" style={{ color: "#1C2A3A" }}>No products found in Pristine</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters or check back soon for new arrivals.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {filtered.map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}?path=collections/pristine`} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                      <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                        <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="px-3 py-3">
                        <p className="uppercase font-semibold text-xs tracking-wide" style={{ color: "#1a1a1a", fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}>{p.name}</p>
                        <p className="font-bold text-sm mt-1" style={{ color: "#1a1a1a" }}>{formatPrice(p.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Capsule Collection Carousel ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="mx-auto px-6 md:px-12 mb-10" style={{ maxWidth: "1000px" }}>
          <p className="text-center leading-relaxed" style={{ fontWeight: 700, fontSize: "clamp(16px, 2vw, 22px)", color: "#1a1a1a" }}>
            Our versatile design palette can be curated into a robust capsule collection - with each piece a testament to pristine craftsmanship
          </p>
        </div>

        <div className="relative mx-auto px-4" style={{ maxWidth: "1400px" }}>
          {canScrollLeft && (
            <button onClick={() => scrollCarousel("left")} aria-label="Scroll left" className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50">
              ‹
            </button>
          )}
          <div ref={carouselRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}>
            <style>{`.pristine-carousel::-webkit-scrollbar { display: none; }`}</style>
            {capsuleImages.map((src, i) => (
              <div key={i} className="flex-shrink-0 snap-center" style={{ width: "min(320px, 80vw)" }}>
                <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "2/3" }}>
                  <img src={src} alt={`Capsule Look ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
          {canScrollRight && (
            <button onClick={() => scrollCarousel("right")} aria-label="Scroll right" className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50">
              ›
            </button>
          )}
        </div>
      </section>

      {/* ── 6. Newsletter ── */}
      <NewsletterSection />

      {/* ── 7. Footer ── */}
      <Footer />
    </div>
  );
}
