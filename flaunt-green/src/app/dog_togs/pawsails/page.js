import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DogTogsFeatures from "@/components/sections/DogTogsFeatures";
import NewsletterSection from "@/components/sections/NewsletterSection";

const pawsailsProducts = [
  { _id: 1, name: "Skipper's Shirt", slug: "skippers-shirt", price: 3187, image: "/assets/dogtogs/sks.png" },
  { _id: 2, name: "Hatch Coat", slug: "hatch-coat", price: 3404, image: "/assets/dogtogs/hc.png" },
  { _id: 3, name: "Sailor's Shirt", slug: "sailors-shirt", price: 3205, image: "/assets/dogtogs/ss.png" },
  { _id: 4, name: "High Tide Coat", slug: "high-tide-coat", price: 4069, image: "/assets/dogtogs/htc.png" },
];

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}.00/-`;
}

export const metadata = {
  title: "Pawsails | Flaunt Green Dog Togs",
  description: "Nautical-inspired sustainable dog wear collection from Flaunt Green Dog Togs.",
};

export default function PawsailsPage() {
  return (
    <div>
      <Header />

      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        <Image
          src="/assets/dogtogs/pawsails/PB.png.png"
          alt="Pawsails Dog Togs"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute top-10 inset-x-4 sm:inset-x-auto sm:right-[48px]"
          
        >
          <div className="max-w-2xl sm:max-w-[52rem] sm:text-right">
            <h1 className="font-heading font-bold text-white uppercase tracking-[0.25em] leading-none mb-0" style={{ fontSize: "clamp(34px, 11vw, 100px)" }}>
PAWSAILS
            </h1>
            <p className="font-heading font-normal text-white text-lg sm:text-4xl mt-2.5 leading-snug max-w-full text-balance">
              This collection is breezy, bold, and built for play.
            </p>

          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: "#ffffff",
          paddingTop: "60px",
          paddingBottom: "60px",
          paddingLeft: "20px",
          paddingRight: "20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            className="font-sans font-bold leading-tight text-center"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              color: "#1C2A3A",
              marginBottom: "24px",
            }}
          >
            INSPIRATION
          </h2>
          <p
            style={{
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "#333333",
              letterSpacing: "normal",
              margin: 0,
            }}
          >
            Flaunt Green's Dog Togs launches Pawsails, which is inspired from the carefree spirit of nautical adventures and the rugged beauty of the seascapes. Pawsails is a celebration of conscious design, circularity, and effortless style. Crafted from a hemp cotton blended fabric that caters to the clothing requirements of our adventurous furry friends!
Nautically-inspired details, playful patterns, and breathable fabrics come together to create active wear garments designed for comfort, convenience, and ease of movement. Pawsails reflects Flaunt Green's belief in designing with sustainable intention to optimize resources and offer distinctive styles.
          </p>
        </div>
      </section>

      <DogTogsFeatures />

      <section style={{ backgroundColor: "#F7F7F2", paddingTop: "32px", paddingBottom: "60px" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <p className="text-[14px] font-normal mb-6" style={{ color: "#555" }}>
            {pawsailsProducts.length} products
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {pawsailsProducts.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}?path=dog_togs/pawsails`}
                className="block bg-white overflow-hidden rounded-xl group shadow-sm"
              >
                <div className="relative w-full overflow-hidden rounded-t-xl" style={{ aspectRatio: "3 / 4" }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 py-4 md:px-5 md:py-5">
                  <p
                    className="uppercase font-semibold tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="font-bold mt-1"
                    style={{ fontSize: "15px", color: "#2B2B2B" }}
                  >
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />

      <Footer />
    </div>
  );
}
