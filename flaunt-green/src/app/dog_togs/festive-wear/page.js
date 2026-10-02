import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DogTogsFeatures from "@/components/sections/DogTogsFeatures";
import NewsletterSection from "@/components/sections/NewsletterSection";

const festiveProducts = [
  { _id: 1, name: "Reversible Lehenga Dress", slug: "reversible-lehenga-dress", price: 4431, image: "/assets/dogtogs/rl.png" },
  { _id: 2, name: "Reversible Bandhgala", slug: "reversible-bandhgala", price: 3839, image: "/assets/dogtogs/rb.png" },
];

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}.00/-`;
}

export const metadata = {
  title: "Festive | Flaunt Green Dog Togs",
  description: "Make your pup the star of every celebration with our festive ethnic wear collection.",
};

export default function FestivePage() {
  return (
    <div>
      <Header />

      <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        <Image
          src="/assets/dogtogs/festive/FB.png"
          alt="Festive Dog Togs"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute top-10 inset-x-4 sm:inset-x-auto sm:left-[80px]"
          
        >
          <div className="max-w-xl sm:max-w-none">
            <h1 className="font-heading font-bold text-white uppercase tracking-[0.25em] leading-none mb-0" style={{ fontSize: "clamp(40px, 12vw, 100px)" }}>
FESTIVE
            </h1>
            <p
              className="font-heading font-normal text-white mt-2.5 leading-snug sm:whitespace-nowrap"
              style={{ fontSize: "clamp(18px, 2.6vw, 36px)" }}
            >
              Make your pup the star of all festivities
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
              fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif",
              fontWeight: 400,
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "#333333",
              letterSpacing: "normal",
              margin: 0,
            }}
          >
            Inspired by the joy and splendour of Indian festivities, Flaunt Green's Dog Togs, launches a Festive Collection which reimagines tradition through the lens of conscious luxury. Featuring authentic Ajrak and Bagru prints, each piece celebrates India's rich textile heritage in a refined, contemporary form. Crafted from pure cotton and thoughtfully designed to be fully reversible, every garment offers two distinct expressions in one, extending versatility and wearability without compromising comfort. Designed with considered functionality and responsible craftsmanship, the collection brings together timeless design, cultural heritage, and conscious living - so every festive moment can be celebrated with enduring style.
          </p>
        </div>
      </section>

      <DogTogsFeatures />

      <section style={{ backgroundColor: "#F7F7F2", paddingTop: "32px", paddingBottom: "60px" }}>
        <div className="max-w-[800px] mx-auto px-6 md:px-16">
          <p className="text-[14px] font-normal mb-6" style={{ color: "#555" }}>
            {festiveProducts.length} products
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {festiveProducts.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}?path=dog_togs/festive-wear`}
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
