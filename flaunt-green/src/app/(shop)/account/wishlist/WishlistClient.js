"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/axios";

export default function WishlistClient() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleMoveToCart = (item) => {
    const rawImage = item.primary_image?.image_url || item.images?.[0]?.image_url || item.image;
    const primaryImage = getImageUrl(rawImage, "/placeholder.jpg");

    addItem({
      product_id: item.id,
      name: item.name,
      price: item.price,
      image: primaryImage,
      size: "M", // Default — user can go to PDP to select exact size
    });
    removeItem(item.id);
    toast.success(`${item.name} moved to cart`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#141b28]"
          style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}>
          My Wishlist
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Your wishlist is empty</p>
          <p className="text-slate-400 text-xs mt-1">Save items you love to find them easily later.</p>
          <Link href="/collections" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#997b47] text-white text-xs font-medium hover:bg-[#836838] transition-colors">
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group">
              <div className="aspect-[3/4] relative bg-slate-100">
                <Image
                  src={getImageUrl(item.primary_image?.image_url || item.images?.[0]?.image_url || item.image, "/placeholder.jpg")}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:text-red-600 shadow-sm transition-all"
                  aria-label="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <Link href={`/products/${item.slug}`} className="block">
                  <h3 className="text-sm font-semibold text-[#141b28] truncate">{item.name}</h3>
                </Link>
                <p className="text-sm font-bold text-[#997b47] mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#41542f] text-white text-xs font-medium hover:bg-[#344326] transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
