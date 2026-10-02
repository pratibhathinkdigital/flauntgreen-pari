import HeroSection          from "@/components/sections/HeroSection";
import BrandFeatures        from "@/components/sections/BrandFeatures";
import ShopByCategory       from "@/components/sections/ShopByCategory";
import FeaturedCollections  from "@/components/sections/FeaturedCollections";
import DogTogsMiniSection   from "@/components/sections/DogTogsMiniSection";
import StatementProducts    from "@/components/sections/StatementProducts";
import SustainabilityStrip  from "@/components/sections/SustainabilityStrip";
import OurPromiseSection from "@/components/sections/OurPromiseSection";
// import FeaturedArticles     from "@/components/sections/FeaturedArticles";

import TestimonialsSection  from "@/components/sections/TestimonialsSection";
import InstagramFeed        from "@/components/sections/InstagramFeed";
import NewsletterSection    from "@/components/sections/NewsletterSection";
import { getSeoMetadata }   from "@/lib/seo";

export async function generateMetadata() {
  const meta = await getSeoMetadata("/");
  return {
    title: meta.title || "Home – Flaunt Green | Sustainable Luxury Fashion India",
    description: meta.description || "Flaunt Green — sustainable luxury fashion brand in India. Discover eco-friendly clothing, organic handloom fabrics, and timeless silhouettes crafted with purpose.",
    keywords: meta.keywords || ["sustainable fashion India", "eco-friendly clothing", "organic fabrics", "slow fashion brand", "ethical fashion India"],
    ...(meta.openGraph && { openGraph: meta.openGraph })
  };
}


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandFeatures />
      <ShopByCategory />
      <FeaturedCollections />
      <DogTogsMiniSection />
      <StatementProducts />
      <SustainabilityStrip />
        <div className="py-2 bg-white">
          <OurPromiseSection />
        </div>
      {/* <FeaturedArticles /> */}

      <TestimonialsSection />
      <InstagramFeed />
      <NewsletterSection />
    </>
  );
}
