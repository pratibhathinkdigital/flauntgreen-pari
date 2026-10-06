"use client";

import { useRef, useState, useEffect } from "react";

export default function SustainabilityHero() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "92vh", minHeight: "480px", maxHeight: "900px" }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/assets/Sustainability/sustainability-hero-poster.jpg"
        onCanPlay={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: videoLoaded ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <source src="/assets/Sustainability/sustainability-hero.mp4" type="video/mp4" />
      </video>

      {!videoLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/Sustainability/sustainability-hero-poster.jpg')" }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1
          className="text-white text-[52px] sm:text-[72px] md:text-[88px] lg:text-[100px] font-bold tracking-wider uppercase leading-none drop-shadow-lg"
          style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
        >
          Sustainability
        </h1>
        <p className="text-white/80 mt-5 text-base sm:text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed">
          Luxury, considered through the lens of conscious materials, enduring craft and measurable impact
        </p>
      </div>
    </section>
  );
}
