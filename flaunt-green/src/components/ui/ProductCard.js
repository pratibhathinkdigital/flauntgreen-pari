"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.slug}?path=shop`} className="block border border-gray-200 bg-white group">
      <div className="relative w-full" style={{ aspectRatio: "3 / 4" }}>
        <Image
          src={product.images?.[0] || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="py-4 text-center">
        <p className="font-heading uppercase text-[13px] font-bold tracking-wide">
          {product.name}
        </p>
        <p className="text-[13px] font-bold mt-1">₹{product.price}/-</p>
      </div>
    </Link>
  );
}
