"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NewsletterSection from "@/components/sections/NewsletterSection";

const subcategories = [
  {
    id: "blogs",
    title: "BLOGS",
    subtitle: "Stories, insights & journeys",
    description:
      "Dive into our written world — explorations of sustainable fashion, artisan craftsmanship, material stories, and the philosophy behind every thread we choose.",
    image: "/assets/journal/Blogs_Tab.JPG",
    href: "/journal/blogs",
    cta: "READ MORE",
    accent: "#9C8148",
  },
  {
    id: "social-outreach",
    title: "SOCIAL OUTREACH",
    subtitle: "Community, impact & connection",
    description:
      "Explore how we engage beyond garments — our partnerships with artisan communities, sustainable initiatives, and the conversations that shape a greener future for fashion.",
    image: "/assets/journal/Social_Outreach_Tab.jpg",
    href: "/journal/social-outreach",
    cta: "READ MORE",
    accent: "#4A7B5A",
  },
];

export default function JournalPage() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, []);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C2A3A]">
      {/* ── HERO VIDEO SECTION ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "92vh", minHeight: "480px", maxHeight: "900px" }}>
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={muted}
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoLoaded ? 1 : 0, transition: "opacity 0.8s ease" }}
        >
          <source src="/assets/journal/JOURNAL_LP.mp4" type="video/mp4" />
        </video>

        {/* Fallback poster while loading */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-[#1C2A3A]" />
        )}

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1
            className="text-white text-[52px] sm:text-[72px] md:text-[88px] lg:text-[100px] font-bold tracking-wider uppercase leading-none drop-shadow-lg"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            Journal
          </h1>
          <p className="text-white/80 mt-5 text-base sm:text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            Please join us as we document our journey on the path from unlearning to relearning.
          </p>
        </div>

        {/* Mute/Unmute button */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300"
          aria-label={muted ? "Unmute video" : "Mute video"}
          id="journal-video-mute-btn"
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </section>


      {/* ── TWO SUB-CATEGORY TILES ── */}
      <section className="px-6 pt-24 pb-20 max-w-[1200px] mx-auto flex flex-col gap-12" id="journal-sections">
        {subcategories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center">
            {/* Title above image */}
            <h2
              className="text-[20px] sm:text-[24px] md:text-[28px] tracking-widest text-[#1C2A3A] mb-4 uppercase font-bold"
              style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
            >
              {cat.title}
            </h2>

            <Link
              href={cat.href}
              id={`journal-tile-${cat.id}`}
              className="group relative block overflow-hidden w-full h-[250px] sm:h-[350px] md:h-[400px]"
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

              {/* Centered CTA button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="inline-block px-8 py-3 border border-[#9C8148] text-[#ffffff] text-sm sm:text-base tracking-[0.2em] uppercase font-medium bg-black/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-[#9C8148] group-hover:text-[#ffffff]"
                >
                  {cat.cta}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* ── NEWSLETTER ── */}
      <NewsletterSection />
    </div>
  );
}
