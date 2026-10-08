import Image from "next/image";
import NewsletterSection from "@/components/sections/NewsletterSection";
import SlowFashionSteps from "./SlowFashionSteps";

export const metadata = {
  title: "Slow Fashion Guide | Flaunt Green",
  description:
    "A Roadmap to Slow Fashion Living: Reimagining Our Relationship with Clothing — six conscious steps from the Flaunt Green team.",
};

export default function SlowFashionGuidePage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C2A3A]">
      {/* ── Hero ── */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
        <Image
          src="/assets/Sustainability/slow-fashion-guide/SLOW_FASHION_GUIDE1.jpg"
          alt="Slow Fashion Guide Hero"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-16">
          <h1
            className="text-white text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] uppercase tracking-widest font-bold drop-shadow-lg leading-none mb-6"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            Slow Fashion
            <br />
            Guide
          </h1>
          <p className="text-white/85 text-[16px] sm:text-[18px] md:text-[20px] font-light tracking-wide max-w-5xl leading-relaxed">
            A Roadmap to Slow Fashion Living: Reimagining Our Relationship with Clothing
          </p>
        </div>
      </section>

      {/* ── Introduction ── */}
      <section className="w-full px-6 py-20 md:py-28 text-center">
        <p
          className="text-[#1C2A3A] leading-[1.5] md:leading-[1.25] font-bold flex flex-col gap-5 md:gap-8"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(20px, 2.9vw, 64px)",
          }}
        >
          <span className="block">
            Slow fashion is not a trend — it is a recalibration.
          </span>
          <span className="block">
            It is a return to clothing as craft, memory, and responsibility.
          </span>
        </p>
        <div className="mt-8 h-[1px] w-24 bg-[var(--gold)] mx-auto" />
        <p className="mt-8 text-[16px] sm:text-[17px] text-[#5C6578] leading-[1.85] font-light flex flex-col gap-3">
          <span className="block">
            For those beginning this journey, it is not about discarding everything you own
            overnight, but about gradually rethinking how you consume, care for, and connect with
            what you wear.
          </span>
          <span className="block">
            The following is our personal roadmap — not of rules, but of shifts — conscious,
            analytical, and ultimately empowering.
          </span>
        </p>
      </section>

      {/* ── Roadmap Diagram ── */}
      <section className="w-full max-w-[1100px] mx-auto px-6 pb-20 md:pb-32">
        <div className="relative w-full">
          <Image
            src="/assets/Sustainability/slow-fashion-guide/ICONS/SLOW FASHION GUIDE MAP.svg"
            alt="Slow Fashion Guide Roadmap Diagram"
            width={1100}
            height={700}
            className="w-full h-auto"
            color="#1C2A3A"
          />
        </div>
      </section>

      {/* ── Steps ── */}
      <SlowFashionSteps />

      {/* ── Closing Statement ── */}
      <section className="bg-[#1C2A3A] py-20 md:py-28 px-6 text-center">
        <div className="max-w-[760px] mx-auto">
          <div className="h-[1px] w-16 bg-[var(--gold)] mx-auto mb-10" />
          <p
            className="text-white text-[22px] sm:text-[26px] md:text-[32px] font-light leading-[1.7] italic"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            "Slow fashion is not about owning fewer clothes; it is about building a deeper relationship with what we choose to wear. When awareness becomes habit and habit becomes identity, sustainability stops being an effort and becomes a way of life."
          </p>
          <p className="mt-8 text-[var(--gold)] text-sm uppercase tracking-[0.25em] font-medium">
            — Team Flaunt Green
          </p>
        </div>
      </section>

      {/* ── Feature Image ── */}
      <section className="w-full">
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] overflow-hidden">
          <Image
            src="/assets/Sustainability/slow-fashion-guide/SLOW_FASHION_GUIDE1.jpg"
            alt="Slow Fashion Guide Feature Image"
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSection />
    </div>
  );
}
