import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/ui/ProductGrid";

// Async server component – fetches from your Node.js backend
async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?featured=true&limit=8`,
      { next: { revalidate: 300 } } // ISR: revalidate every 5 minutes
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="section">
      <div className="container-site">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 font-semibold text-sm mb-2 uppercase tracking-wider">
              Handpicked for You
            </p>
            <h2 className="section-title mb-0" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}>Featured Products</h2>
          </div>
          <Link href="/shop" className="btn-outline hidden sm:flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={products} />

        <div className="flex justify-center mt-8 sm:hidden">
          <Link href="/shop" className="btn-primary">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
