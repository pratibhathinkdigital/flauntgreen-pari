import ShopLayout from "@/components/ui/ShopLayout";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Shop All | Flaunt Green",
  description: "Explore our entire collection of sustainable luxury fashion.",
};

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const section = params?.section ? String(params.section).toLowerCase() : "";
  const category = params?.category ? String(params.category).toLowerCase() : "";

  // Dedicated section page redirects
  if (section === "her" && !category) {
    redirect("/her/");
  }
  if (section === "him" && !category) {
    redirect("/him/");
  }

  // Dedicated category page redirects (Image 1 reference design)
  if (category) {
    const cleanCat = category.replace(/-(her|him)$/, "").trim();
    const knownHerCats = ["outerwear", "topwear", "bottomwear", "dresses", "accessories"];
    const knownHimCats = ["outerwear", "topwear", "bottomwear", "accessories"];

    if (section === "him" && knownHimCats.includes(cleanCat)) {
      redirect(`/him/${cleanCat}/`);
    } else if (knownHerCats.includes(cleanCat)) {
      redirect(`/her/${cleanCat}/`);
    }
  }

  const fetchParams = {
    section: params?.section,
    category: params?.category,
    collection: params?.collection,
    search: params?.search,
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading products...</div>}>
      <ShopLayout title="Shop All" fetchParams={fetchParams} />
    </Suspense>
  );
}
