"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";

const festiveProducts = [
  { _id: 1, name: "Reversible Lehenga Dress", slug: "reversible-lehenga-dress", price: 4431, image: "/assets/dogtogs/rl.png" },
  { _id: 2, name: "Reversible Bandhgala", slug: "reversible-bandhgala", price: 3839, image: "/assets/dogtogs/rb.png" },
];

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}.00/-`;
}

export default function FestiveCollectionPage() {
  return (
    <div>
      <Header />

      {/* Product Count + Grid */}
      <section style={{ backgroundColor: "#F7F7F2", paddingTop: "32px", paddingBottom: "60px" }}>
        <div className="max-w-[800px] mx-auto px-6 md:px-16">
          <p className="text-[14px] font-normal mb-6" style={{ color: "#555" }}>
            {festiveProducts.length} products
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {festiveProducts.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}?path=dog_togs/collections/festive`}
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
