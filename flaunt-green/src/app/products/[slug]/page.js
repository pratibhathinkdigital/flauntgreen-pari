import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { PRODUCT_SLUGS } from "@/data/productSlugs";

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  return (
    <Suspense fallback={null}>
      <ProductDetailClient slug={slug} />
    </Suspense>
  );
}
