import SustainabilityHero from "@/components/sections/SustainabilityHero";
import SustainabilitySections from "@/components/sections/SustainabilitySections";

export const metadata = {
  title: "Sustainability | Flaunt Green",
  description:
    "Explore Flaunt Green's sustainability practice — conscious materials, ethical trims, and slow fashion principles.",
};

export default function SustainabilityPage() {
  return (
    <div className="bg-white">
      <SustainabilityHero />

      <section className="py-[80px] px-6 text-center" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-[820px] mx-auto">
          <p
            className="mx-auto leading-relaxed"
            style={{
              fontSize: "19px",
              color: "#1C2A3A",
              maxWidth: "820px",
              fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif",
            }}
          >
            Sustainability at Flaunt Green is not a collection, it is a practice. Every
            silhouette begins with a question: can this be made responsibly, and can it last?
            Explore the materials, the makers, and the thinking that shape every piece we put
            into the world.
          </p>
        </div>
      </section>

      <SustainabilitySections />
    </div>
  );
}
