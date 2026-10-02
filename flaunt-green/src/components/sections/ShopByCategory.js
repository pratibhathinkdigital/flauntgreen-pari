import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "HER", slug: "her", image: "/assets/her.png" },
  { name: "HIM", slug: "him", image: "/assets/him1.jpg" },
  { name: "ACCESSORIES", slug: "accessories", image: "/assets/accessories.jpg" },
  { name: "DOG TOGS", slug: "dog-togs", image: "/assets/dogtogs.jpg" },
];

function CategoryCard({ name, image, slug }) {
  return (
    <Link href={slug === 'her' ? '/her' : slug === 'him' ? '/him' : `/shop/${slug}`} className="group flex flex-col items-center">
      <div className="relative w-full" style={{ aspectRatio: "3 / 4.3" }}>

        {/* Gold outline frame — offset bottom-right behind the image, reduced height */}
        <div
          className="absolute z-0"
          style={{
            top: "14%",
            left: "10%",
            right: "0%",
            bottom: "0%",
            border: "1.5px solid #997b47",
          }}
        />

        {/* Solid gold fill box — same size as image, peeks out top-left behind it */}
        <div
          className="absolute z-[5]"
          style={{
            top: "-3%",
            left: "-3%",
            right: "28%",
            bottom: "28%",
            backgroundColor: "#997b47",
          }}
        />

        {/* Photo — top-left, overlaps the frame, with white border feel */}
        <div
          className="absolute z-10 overflow-hidden bg-white"
          style={{
            top: "0%",
            left: "0%",
            right: "10%",
            bottom: "12%",
            boxShadow: "1px 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 42vw, (max-width: 1024px) 22vw, 240px"
          />
        </div>

        {/* Category label — bottom center in the outline frame's extra space */}
        <span
          className="absolute z-20 left-0 right-0 text-center"
          style={{
            bottom: "2%",
            color: "#997b47",
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "16px",
            fontWeight: 500,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
          }}
        >
          {name}
        </span>
      </div>
    </Link>
  );
}

export default function ShopByCategory() {
  return (
    <section className="py-[80px] bg-white">
      <h2
        className="font-sans font-bold leading-tight mb-4 text-center"
style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              color: "#1C2A3A",
            }}
      >
        Shop By Category
      </h2> <br></br>

      <div className="max-w-[1800px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-[30px] lg:gap-[50px] px-4 sm:px-6 lg:px-8">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} {...cat} />
        ))}
      </div>
    </section>
  );
}
