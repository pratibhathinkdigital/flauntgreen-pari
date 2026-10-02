import Image from "next/image";
import { trustBadges } from "@/lib/content";

export default function BrandFeatures() {
  return (
    <section className="bg-white grid grid-cols-4 md:grid-cols-7 gap-y-10 gap-x-2 md:gap-x-6 py-16 px-4 sm:px-8 md:px-16 lg:px-24">
      {trustBadges.items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="h-[80px] w-full flex items-center justify-center">
            <Image src={item.icon} alt={item.label} width={60} height={60} className="h-[64px] w-auto object-contain" />
          </div>
          <span className="mt-[3px] text-[10px] font-medium capitalize tracking-widest text-text-secondary text-center max-w-[120px] leading-tight" style={{ whiteSpace: "pre-line" }}>
            {item.label}
          </span>
        </div>
      ))}
    </section>
  );
}
