import Link from "next/link";
import Image from "next/image";

const subsections = [
  {
    id: "slow-fashion-guide",
    title: "SLOW FASHION GUIDE",
    image: "/assets/SlowFashionGuide1.jpg",
    href: "/slow-fashion-guide",
    cta: "READ MORE",
  },
  {
    id: "our-materials",
    title: "OUR MATERIALS",
    image: "/assets/OurMaterials1.jpg",
    href: "/our-materials",
    cta: "READ MORE",
  },
  {
    id: "fg-impact",
    title: "FG IMPACT",
    image: "/assets/FGImpact.png",
    href: "/fg-impact",
    cta: "READ MORE",
  },
];

export default function SustainabilitySections() {
  return (
    <section
      className="px-6 pb-24 max-w-[1200px] mx-auto flex flex-col gap-24"
      id="sustainability-sections"
    >
      {subsections.map((cat) => (
        <div key={cat.id} className="flex flex-col items-center">
          <h2
            className="text-[20px] sm:text-[24px] md:text-[28px] tracking-widest text-[#1C2A3A] mb-4 uppercase font-bold text-center"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            {cat.title}
          </h2>

          <Link
            href={cat.href}
            id={`sustainability-tile-${cat.id}`}
            className="group relative block overflow-hidden w-full h-[250px] sm:h-[350px] md:h-[400px]"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />

            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-block px-8 py-3 border border-[#9C8148] text-[#ffffff] text-sm sm:text-base tracking-[0.2em] uppercase font-medium bg-black/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-[#9C8148] group-hover:text-[#ffffff]">
                {cat.cta}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
}
