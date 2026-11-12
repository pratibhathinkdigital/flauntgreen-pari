"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function EvolvePage() {
  return (
    <div className="w-full bg-[#FAF9F6]">
      <Header />

      <main className="w-full h-[100dvh] flex flex-col items-center justify-center px-6 pt-0 pb-0">
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto -translate-y-3 sm:-translate-y-4">
          {/* Evolve Word */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-[0.3em] text-[#1a1a1a] mb-5 sm:mb-6 pl-[0.3em]"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            Evolve
          </h1>

          {/* Subtle Accent Line */}
          <div className="w-12 h-px bg-[#41542f]/20 mb-5 sm:mb-6" />

          {/* Coming Soon Text */}
          <p className="text-[10px] sm:text-xs md:text-sm font-light uppercase tracking-[0.35em] sm:tracking-[0.45em] text-neutral-500 pl-[0.35em] sm:pl-[0.45em]">
            Coming Soon
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
