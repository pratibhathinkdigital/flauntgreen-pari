"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";

const products = [
  { _id: 1, name: "Skipper's Shirt", slug: "skippers-shirt", price: 3187, image: "/assets/dogtogs/sks.png" },
  { _id: 2, name: "Hatch Coat", slug: "hatch-coat", price: 3404, image: "/assets/dogtogs/hc.png" },
  { _id: 3, name: "Sailor's Shirt", slug: "sailors-shirt", price: 3205, image: "/assets/dogtogs/ss.png" },
  { _id: 4, name: "High Tide Coat", slug: "high-tide-coat", price: 4069, image: "/assets/dogtogs/htc.png" },
  { _id: 5, name: "Reversible Lehenga Dress", slug: "reversible-lehenga-dress", price: 4431, image: "/assets/dogtogs/rl.png" },
  { _id: 6, name: "Reversible Bandhgala", slug: "reversible-bandhgala", price: 3839, image: "/assets/dogtogs/rb.png" },
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}.00/-`;
}

export default function DogTogsProductsPage() {
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => b._id - a._id);
        break;
      default:
        break;
    }
    return sorted;
  }, [sortBy]);

  const row1 = sortedProducts.slice(0, 3);
  const row2 = sortedProducts.slice(3, 6);

  return (
    <div>
      <Header />

      {/* Page Title Section */}
      <section style={{ backgroundColor: "#F7F7F2", paddingTop: "48px", paddingBottom: "24px" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          <h1
            className="font-heading text-center mb-8"
            style={{ fontSize: "clamp(36px, 4vw, 44px)", color: "#A8853D" }}
          >
            Our Products
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-[16px] font-normal" style={{ color: "#2B2B2B" }}>
              {products.length} Products
            </p>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-[14px] font-normal px-4 py-[10px] bg-white rounded-[4px] transition-colors duration-200 hover:bg-gray-50"
                style={{ border: "1px solid #D1D5DB", color: "#2B2B2B" }}
              >
                {sortOptions.find((o) => o.value === sortBy)?.label}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
              </button>

              {sortOpen && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white rounded-[4px] shadow-lg z-20 min-w-[180px]"
                  style={{ border: "1px solid #D1D5DB" }}
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-[10px] text-[14px] transition-colors duration-150 hover:bg-gray-50 ${
                        sortBy === option.value ? "font-semibold" : "font-normal"
                      }`}
                      style={{ color: sortBy === option.value ? "#A8853D" : "#2B2B2B" }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ backgroundColor: "#F7F7F2", paddingBottom: "60px" }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-16">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {row1.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}?path=dog_togs/products`}
                className="block bg-white overflow-hidden rounded-xl group shadow-sm"
              >
                <div className="relative w-full overflow-hidden rounded-t-xl" style={{ aspectRatio: "3 / 4" }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 py-4 md:px-5 md:py-5">
                  <p
                    className="uppercase font-semibold tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="font-bold mt-1"
                    style={{ fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center py-8">
            <span className="text-gray-400 text-xl leading-none select-none">&middot;</span>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {row2.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}?path=dog_togs/products`}
                className="block bg-white overflow-hidden rounded-xl group shadow-sm"
              >
                <div className="relative w-full overflow-hidden rounded-t-xl" style={{ aspectRatio: "3 / 4" }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 py-4 md:px-5 md:py-5">
                  <p
                    className="uppercase font-semibold tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="font-bold mt-1"
                    style={{ fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Green Journey */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}
