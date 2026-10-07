import Image from "next/image";
import Link from "next/link";
import "./OurPromiseSection.css";

export default function OurPromiseSection() {
  return (
    <>
      <section id="our-promise" className="relative bg-white py-2 px-4 md:px-8 lg:px-12">
        <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-center">
          <div className="relative w-full max-w-[1200px]">
            <Link href="/our-story" className="block w-full">
              <Image
                src="/assets/ourpromise11.png"
                alt="Our Promise"
                width={1400}
                height={642}
                className="w-full h-auto object-contain block"
                priority
              />
            </Link>
            <Link
              href="/our-story"
              className="btn absolute left-[15.5%] top-[69.5%] w-[18.5%] h-[10.5%] max-h-[44px] flex items-center justify-center border border-[var(--gold)] bg-white text-[#1C2A3A] transition-all duration-[250ms] hover:bg-[var(--gold)] hover:text-[#F5F1E8] font-sans font-normal uppercase tracking-[0.16em] text-[clamp(11px,1.3vw,17px)] rounded-none"
            >
              OUR STORY
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
