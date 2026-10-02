"use client";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import NewsletterSection from '@/components/sections/NewsletterSection';
import DogTogsHero from '@/components/sections/DogTogsHero';
import DogTogsFeatures from '@/components/sections/DogTogsFeatures';
import DogTogsMiniSection from '@/components/sections/DogTogsMiniSection';
import DogTogsBestSellers from '@/components/sections/DogTogsBestSellers';
import WafflesStory from '@/components/sections/WafflesStory';
// import FeaturedArticles from '@/components/sections/FeaturedArticles';
import DogTogsTestimonials from '@/components/sections/DogTogsTestimonials';

export default function DogTogsPage() {
  return (
    <div>
      {/* Navbar */}
      <Header />

      <DogTogsHero />
      <DogTogsFeatures />
      <DogTogsMiniSection title="Explore Our Collections" showSubheading={false} />
      <DogTogsBestSellers />
      <WafflesStory />

      {/* Graphic Section */}
      <section className="w-full py-2 flex justify-center bg-white">
        <div className="relative w-full max-w-6xl" style={{ aspectRatio: "4/3" }}>
          <Image
            src="/assets/dogtogs/doggraphic.png"
            alt="Dog Togs Graphic"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* <FeaturedArticles /> */}
      <DogTogsTestimonials />

      {/* Join Green Journey section */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
