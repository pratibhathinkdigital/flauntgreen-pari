"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Link from "next/link";
import Image from "next/image";

const accentCards = [
  {
    image: "/assets/collections/Artistic Expression/sh.png",
    title: "Sustainable Haven",
    description: "Crafted from eco-friendly fabrics and green trims, inviting conscious choices.",
    tag: "HANDSPUN & HANDMADE",
  },
  {
    image: "/assets/collections/Artistic Expression/cc.png",
    title: "Comfort Chic",
    description: "Crisp, functional silhouettes designed to elevate confidence, grace, and poise.",
    tag: "MINIMALIST ELEGANCE",
  },
  {
    image: "/assets/collections/Artistic Expression/ct.png",
    title: "Creative Threads",
    description: "Where sustainable fabrics meet Indian handloom techniques for global appeal.",
    tag: "CONTEMPORARY HANDLOOM",
  },
  {
    image: "/assets/collections/Artistic Expression/el.png",
    title: "Eco Luxury",
    description: "Silhouettes inspired by traditional craft, designed for a sustainable future.",
    tag: "GLOBAL FUSION",
  },
];



export default function CollectionsPage() {
  return (
    <div>
      <Header />

      {/* ── 1. Hero Section (fixed background) ── */}
      <div className="fixed top-0 left-0 w-full h-screen" style={{ zIndex: 0 }}>
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/assets/collections/CLP.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Spacer to push content below the fixed hero */}
      <div className="h-screen" />

      {/* ── Hero Text Section ── */}
      <section className="relative z-10" style={{ backgroundColor: "#fff", padding: "80px 20px 60px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontWeight: 700, fontSize: "36px", color: "#042943", marginBottom: "24px" }}
          >
            Collections
          </h1>
          <p
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: "21px", lineHeight: 1.5, color: "#042943" }}
          >
            Every collection is a considered expression of conscious craftsmanship, bringing together sustainable comfort, enduring elegance, and a story uniquely its own.
          </p>
        </div>
      </section>

      {/* ── 2. E.K.A.M. Collection Feature ── */}
      <section className="relative z-10 py-16 md:py-24" style={{ backgroundColor: "#E8F2E9" }}>
        <div className="mx-auto px-6 md:px-12" style={{ maxWidth: "1260px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left — Text */}
            <div>
              <div className="w-12 h-0.5 bg-[#2D5A3D] mb-6" />
              <h2
                className="leading-tight mb-3"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 3.5vw, 44px)", color: "#1a3a2a" }}
              >
                E.K.A.M.: The Elements of Conscious Living
              </h2>
              <p className="italic mb-6" style={{ color: "#3a6b4a", fontSize: "20px" }}>
                A new oversized staple tee collection by Flaunt Green
              </p>
              <p className="mb-4" style={{ fontSize: "15px", color: "#042943", lineHeight: 1.7 }}>
                This season, Flaunt Green invites you to wear your values.
              </p>
              <p className="mb-4" style={{ fontSize: "15px", color: "#042943", lineHeight: 1.7 }}>
                Rooted in timeless philosophies and reimagined through sustainable design, our latest drop - &ldquo;E.K.A.M.: The Elements of Conscious Living&quot; - explores four guiding forces: Empathy. Karma. Ahimsa. Moksha. Each oversized tee is a modern canvas of thought, created to reflect what truly matters in today&apos;s world.
              </p>
              <p className="mb-8" style={{ fontSize: "15px", color: "#042943", lineHeight: 1.7 }}>
                Crafted from ethically sourced fabrics, painted with Azo-free dyes, and embroidered in Eco threads, this collection is a tribute to conscious living - where comfort meets meaning, and style carries intention. Whether you&apos;re walking through your day, your city, or your personal journey, these tees are made to move with you - soft on skin, bold in message, and gentle for the planet.
              </p>

              {/* Color Palette */}
              <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-3" style={{ color: "#666" }}>
                Color Palette
              </p>
              <div className="flex gap-3 mb-8">
                {[
                  { src: "/assets/collections/E.K.A.M/E1.png", alt: "Empathy Tee" },
                  { src: "/assets/collections/E.K.A.M/E2.png", alt: "Karma Tee" },
                  { src: "/assets/collections/E.K.A.M/E3.png", alt: "Ahimsa Tee" },
                  { src: "/assets/collections/E.K.A.M/E4.png", alt: "Moksha Tee" },
                ].map((img) => (
                  <div key={img.alt} className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" />
                  </div>
                ))}
              </div>

              <Link
                href="/collections/ekam"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#1F4A3D", color: "#fff" }}
              >
                ENTER COLLECTION <span className="text-lg">→</span>
              </Link>
            </div>

            {/* Right — Images */}
            <div className="relative">
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <Image src="/assets/collections/E.K.A.M/ekam_main.png" alt="E.K.A.M. Collection" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-[48px] md:-bottom-[70px] -right-6 w-40 md:w-56 rounded-xl overflow-hidden shadow-xl border-4 border-[#042943]" style={{ aspectRatio: "184 / 248" }}>
                <Image src="/assets/collections/E.K.A.M/ekam_inset.png" alt="E.K.A.M. Pattern" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Pristine Collection Feature ── */}
      <section className="relative z-10 pt-16 md:pt-24 pb-28 md:pb-40" style={{ backgroundColor: "#E8F2E9" }}>
        <div className="mx-auto px-6 md:px-12" style={{ maxWidth: "1260px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left — Images */}
            <div className="relative">
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <Image src="/assets/collections/Pristine/pristine_main.png" alt="Pristine Collection" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-[73px] md:-bottom-[105px] -left-6 w-40 md:w-56 rounded-xl overflow-hidden shadow-xl border-4 border-white" style={{ aspectRatio: "395 / 595" }}>
                <Image src="/assets/collections/Pristine/pristine_inset.png" alt="Pristine Vintage" fill className="object-cover" />
              </div>
            </div>

            {/* Right — Text */}
            <div>
              <div className="w-12 h-0.5 bg-[#042943] mb-6" />
              <h2
                className="leading-tight mb-6"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 3.5vw, 44px)", color: "#1a3a2a" }}
              >
                Pristine
              </h2>
              <p className="mb-4" style={{ fontSize: "15px", color: "#4A5C4E", lineHeight: 1.7 }}>
                The Hindu Kush Himalayan (HKH) ranges covering an area of over 4.3 million square kilometres and spanning a length of 3,500 kilometres, offer the largest sources of freshwater and volumes of ice on earth outside of the poles, earning it the sobriquet of &ldquo;The Third Pole.&rdquo; This region has an incredibly diverse ecosystem and is home to parts of four global biodiversity hotspots.
              </p>

              {/* Color Palette */}
              <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-3 mt-8" style={{ color: "#666" }}>
                Color Palette
              </p>
              <div className="flex gap-3 mb-8">
                {["#F5F0E1", "#FFFFFF", "#6B3A2A", "#2A5A8A", "#C0392B"].map((c) => (
                  <span key={c} className="w-8 h-8 rounded-full border border-gray-300" style={{ backgroundColor: c }} />
                ))}
              </div>

              <Link
                href="/collections/pristine"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#1F4A3D", color: "#fff" }}
              >
                ENTER COLLECTION <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Artistic Expressions ── */}
      <section className="relative z-10 py-16 md:py-24" style={{ backgroundColor: "#E8F2E9" }}>
        <div className="px-6 sm:px-8 md:px-12 lg:px-16">
          <h2
            className="text-center mb-4"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 3.5vw, 44px)", color: "#1a3a2a" }}
          >
            Artistic Expressions
          </h2>
          <p className="text-center mb-14" style={{ fontSize: "16px", color: "#5C584D" }}>
            Explore collections organized by artistic style and creative vision.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {accentCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2" style={{ color: "#1a3a2a" }}>{card.title}</h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: "#5C584D" }}>{card.description}</p>
                  <p className="uppercase tracking-[0.15em] text-xs font-semibold" style={{ color: "#9C8148" }}>{card.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── 6. Newsletter ── */}
      <div className="relative z-10">
        <NewsletterSection />
      </div>

      {/* ── 7. Footer ── */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
