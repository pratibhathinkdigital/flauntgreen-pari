import Image from "next/image";
import Link from "next/link";
import { statementPieces } from "@/lib/content";

const products = [
  {
    id: 1,
    name: "ASYMMETRIC PINTUCKS SHIRT",
    desc: "Discover our signature shirt featuring a concealed placket for a sleek, hidden button front. Made from Medium Weight Khadi, it offers an exceptionally soft touch while maintaining durability.",
    price: 5444,
    image: "/assets/SP1.jpeg",
  },
  {
    id: 2,
    name: "KHADI BLAZER",
    desc: "A sophisticated piece featuring a deep neckline that adds a modern edge to its classic design. The triangle flaps provide a distinctive, stylish detail.",
    price: 8691,
    image: "/assets/sp2.png",
  },
  {
    id: 3,
    name: "KHADI BIKER JACKET",
    desc: "An easy, relaxed shift dress designed for a sophisticated corporate look with its unique triangle seam detail. The shift silhouette offers effortless style and comfort.",
    price: 7376,
    image: "/assets/SP3.jpeg",
  },
];

export default function StatementProducts() {
  return (
    <section className="py-[80px] bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-[40px] px-2 sm:px-4">
        <h2
          className="text-center font-sans font-bold leading-tight mb-3"
style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 3.5vw, 48px)",
              color: "#1C2A3A",
            }}
        >
          {statementPieces.heading}
        </h2>
        <p
          className="text-center mx-auto mb-14"
          style={{
            fontSize: "19px",
            color: "var(--gold)",
          }}
        >
          {statementPieces.subheading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[44px]">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col">
              <div className="relative w-full" style={{ aspectRatio: "3 / 4" }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <p
                className="mt-[18px] font-medium tracking-[0.5px]"
                style={{
                  color: "var(--gold)",
                  fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                  fontSize: "22px",
                }}
              >
                {product.name}
              </p>
              <p
                className="mt-2 leading-relaxed line-clamp-2"
                style={{
                  color: "#3A3A3A",
                  fontSize: "15px",
                }}
              >
                {product.desc}
              </p>
              <p
                className="mt-[10px] font-bold"
                style={{
                  color: "#1C2A3A",
                  fontSize: "19px",
                }}
              >
                ₹{product.price.toLocaleString("en-IN")}.00
              </p>
            </div>
          ))}
        </div>

          <div className="text-center mt-12">
            <Link href="/shop" className="btn inline-block text-xs uppercase tracking-[1.5px] font-medium px-6 py-[14px] border border-[var(--gold)] bg-transparent text-[#1C2A3A] transition-all duration-[250ms] hover:bg-[var(--gold)] hover:text-[#F5F1E8] rounded-none">
              {statementPieces.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
