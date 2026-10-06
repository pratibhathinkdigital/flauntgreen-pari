import { sustainabilityStrip } from "@/lib/content";
import { images } from "@/lib/images";

const stripImages = [
  images.sustainabilityStrip.guide,
  images.sustainabilityStrip.materials,
  images.sustainabilityStrip.impact,
];

export default function SustainabilityStrip() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-sans font-bold leading-tight mb-4 text-center"
style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              color: "#1C2A3A",
            }}>
          {sustainabilityStrip.heading}
        </h2>
        <p className="text-center mb-16" style={{ fontSize: "20px", color: "var(--gold)", lineHeight: "1.4" }}>
          Leaving a sustainable footprint…
        </p>

        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar">
          {sustainabilityStrip.items.map((item, i) => (
            <div key={item.label} className="text-center shrink-0 snap-center">
              <div
                className="overflow-hidden rounded mb-3 mx-auto w-[min(340px,82vw)] md:w-full"
                style={{ aspectRatio: "16/9" }}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${stripImages[i]})` }}
                />
              </div>
              <span className="font-heading font-medium text-2xl text-text-primary">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
