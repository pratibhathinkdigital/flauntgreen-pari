import Image from "next/image";
import Link from "next/link";
import { dogTogs } from "@/lib/content";
import { images } from "@/lib/images";

export default function DogTogsMiniSection({ title, showSubheading = true }) {
  return (
    <section className="py-[70px] bg-white">
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
            {title || dogTogs.heading}
          </h2>
          {showSubheading && (
            <p
              className="text-center mx-auto mb-8"
              style={{
                fontSize: "21px",
                color: "var(--gold)",
              }}
            >
              {dogTogs.subheading}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[5px]">
            {/* Left Card — Festive Wear */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
              <Image
                src={images.dogTogs.left}
                alt="Festive Wear"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-y-0 left-0 w-[46%] flex items-center"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)",
                }}
              >
                <div className="px-6 sm:px-6">
                  <p className="font-heading tracking-widest text-white text-[30px] leading-tight">
                    FESTIVE
                  </p>
                  <div className="w-[64px] h-[1.5px] bg-white mt-3 mb-3" />

                  <p className="text-white text-[18px] leading-relaxed max-w-[400px] ">
                    Make your pup the star <br />of all festivities


                  </p>
                  <Link
                    href="/dog_togs/collections/festive"
                    className="mt-4 inline-block text-[14px] uppercase tracking-widest font-medium px-4 py-2 bg-[#F0E9DC] text-[#1C2A3A] transition-all duration-[250ms] hover:bg-[#E0D5C0]"
                  >
                    SHOP FESTIVE
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Card — Pawsails */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
              <Image
                src={images.dogTogs.right}
                alt="Pawsails"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-y-0 left-0 w-2/5 flex items-center"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)",
                }}
              >
                <div className="px-6 sm:px-10">
                  <p className="font-heading tracking-widest text-white text-[30px] leading-tight">
                    PAWSAILS
                  </p>
                  <div className="w-[64px] h-[1.5px] bg-white mt-3 mb-3" />
                  <p className="text-white text-[18px] leading-relaxed max-w-[280px]">
                    This collection is breezy, bold, and built for play.
                  </p>
                  <Link
                    href="/dog_togs/collections/pawsails"
                    className="mt-4 inline-block text-[14px] uppercase tracking-widest font-medium whitespace-nowrap px-4 py-2 bg-[#F0E9DC] text-[#1C2A3A] transition-all duration-[250ms] hover:bg-[#E0D5C0]"
                  >
                    SHOP PAWSAILS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
