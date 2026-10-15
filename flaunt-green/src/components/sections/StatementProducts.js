"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { statementPieces } from "@/lib/content";
import { productsApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";

const fallbackProducts = [
  {
    id: 1,
    name: "ASYMMETRIC PINTUCKS SHIRT",
    desc: "Discover our signature shirt featuring a concealed placket for a sleek, hidden button front. Made from Medium Weight Khadi, it offers an exceptionally soft touch while maintaining durability.",
    price: 5444,
    image: "/assets/SP1.jpeg",
    slug: null,
  },
  {
    id: 2,
    name: "KHADI BLAZER",
    desc: "A sophisticated piece featuring a deep neckline that adds a modern edge to its classic design. The triangle flaps provide a distinctive, stylish detail.",
    price: 8691,
    image: "/assets/sp2.png",
    slug: null,
  },
  {
    id: 3,
    name: "KHADI BIKER JACKET",
    desc: "An easy, relaxed shift dress designed for a sophisticated corporate look with its unique triangle seam detail. The shift silhouette offers effortless style and comfort.",
    price: 7376,
    image: "/assets/SP3.jpeg",
    slug: null,
  },
];

export default function StatementProducts() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    productsApi
      .getAll()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const live = res.data.slice(0, 3).map((p) => ({
            id: p.id,
            name: p.name,
            desc: p.description || p.fabric || "Sustainably crafted luxury piece.",
            price: Number(p.price) || 0,
            image: getImageUrl(
              p.primary_image?.image_url || p.images?.[0]?.image_url,
              "/assets/SP1.jpeg"
            ),
            slug: p.slug,
          }));
          setProducts(live);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch statement products:", err);
      });
  }, []);

  return (
    <section className="py-[80px] bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-[40px] px-2 sm:px-4">
          <h2
            className="text-center font-sans font-bold leading-tight mb-3"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3.5vw, 48px)",
              color: "#1C2A3A",
            }}
          >
            {statementPieces.heading}
          </h2>
          <p
            className="text-center mx-auto mb-14"
            style={{
              fontSize: "19px",
              color: "var(--gold)",
            }}
          >
            {statementPieces.subheading}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[44px]">
            {products.map((product) => {
              const cardContent = (
                <div className="flex flex-col group cursor-pointer">
                  <div
                    className="relative w-full overflow-hidden bg-gray-50 rounded-sm"
                    style={{ aspectRatio: "3 / 4" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 900px) 100vw, 33vw"
                    />
                  </div>
                  <p
                    className="mt-[18px] font-medium tracking-[0.5px] group-hover:text-[#997b47] transition-colors"
                    style={{
                      color: "var(--gold)",
                      fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                      fontSize: "22px",
                    }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="mt-2 leading-relaxed line-clamp-2"
                    style={{
                      color: "#3A3A3A",
                      fontSize: "15px",
                    }}
                  >
                    {product.desc}
                  </p>
                  <p
                    className="mt-[10px] font-bold"
                    style={{
                      color: "#1C2A3A",
                      fontSize: "19px",
                    }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}.00
                  </p>
                </div>
              );

              return product.slug ? (
                <Link key={product.id} href={`/products/${product.slug}`} className="block">
                  {cardContent}
                </Link>
              ) : (
                <div key={product.id}>{cardContent}</div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="btn inline-block text-xs uppercase tracking-[1.5px] font-medium px-6 py-[14px] border border-[var(--gold)] bg-transparent text-[#1C2A3A] transition-all duration-[250ms] hover:bg-[var(--gold)] hover:text-[#F5F1E8] rounded-none"
            >
              {statementPieces.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
