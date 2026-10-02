"use client";

import Link from "next/link";
import Image from "next/image";

const bestSellers = [
  { id: 1, image: "/assets/dogtogs/bs1.png", alt: "Dog Togs Best Seller 1", slug: "best-seller-1" },
  { id: 2, image: "/assets/dogtogs/bs2.png", alt: "Dog Togs Best Seller 2", slug: "best-seller-2" },
  { id: 3, image: "/assets/dogtogs/bs3.png", alt: "Dog Togs Best Seller 3", slug: "best-seller-3" },
  { id: 4, image: "/assets/dogtogs/bs4.png", alt: "Dog Togs Best Seller 4", slug: "best-seller-4" },
];

export default function DogTogsBestSellers() {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <h2
        className="font-sans font-bold text-center leading-tight mb-3"
        style={{
          fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
          fontSize: "clamp(32px, 3.5vw, 48px)",
          color: "#1C2A3A",
          paddingTop: "28px",
          paddingBottom: "28px",
        }}
      >
        Best Sellers
      </h2>

      <div className="best-sellers-grid" style={{ padding: "0 96px 32px", gap: "16px" }}>
        {bestSellers.map((item) => (
          <Link
            key={item.id}
            href={`/dog-togs/${item.slug}`}
            className="best-sellers-item"
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          </Link>
        ))}
      </div>

      <style>{`
        .best-sellers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .best-sellers-item {
          display: block;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          position: relative;
        }
        .best-sellers-item img {
          transition: transform 400ms ease-out;
        }
        .best-sellers-item:hover img {
          transform: scale(1.05);
        }
        @media (max-width: 1023px) {
          .best-sellers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 639px) {
          .best-sellers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
