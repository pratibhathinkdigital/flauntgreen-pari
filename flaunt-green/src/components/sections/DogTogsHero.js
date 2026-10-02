"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    image: "/assets/dogtogs/DTBannerFESTIVE.png",
    title: "Dog Togs",
    subtitle: "Pet Wear Reimagined Sustainably",
    exploreLink: "/dog_togs/collections/festive",
  },
  {
    id: 2,
    image: "/assets/dogtogs/DTBannerPAWSAIL.png",
    title: "Dog Togs",
    subtitle: "Pet Wear Reimagined Sustainably",
    exploreLink: "/dog_togs/collections/pawsails",
  },
];

export default function DogTogsHero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden group">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: () => '<span class="swiper-pagination-bullet bg-gold"></span>',
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div
              className="absolute inset-y-0 left-0 w-full sm:w-[55%] lg:w-[46%] flex items-center z-10"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)",
              }}
            >
              <div className="px-6 sm:pl-20 lg:pl-28 sm:pr-12 max-w-2xl">
                <h1
                  className="font-heading font-normal text-white leading-tight mb-5 whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                    fontSize: "clamp(40px, 8vw, 92px)",
                    textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  className="text-white font-heading text-[17px] sm:text-[24px] mt-3 whitespace-nowrap"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-6">
                  <Link
                    href={slide.exploreLink}
                    className="inline-block text-xs uppercase tracking-[1.5px] font-medium px-6 py-[14px] border border-[var(--gold)] bg-white text-black transition-all duration-[250ms] hover:bg-[var(--gold)] hover:text-[#F5F1E8]"
                  >
                    Explore
                  </Link>
                  <a
                    href="#waffles"
                    className="inline-block text-xs uppercase tracking-[1.5px] font-medium px-6 py-[14px] border border-[var(--gold)] bg-white text-black transition-all duration-[250ms] hover:bg-[var(--gold)] hover:text-[#F5F1E8]"
                  >
                    Meet Waffles
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev !text-gold opacity-0 group-hover:opacity-100 transition-opacity !left-8 after:!text-2xl" />
        <div className="swiper-button-next !text-gold opacity-0 group-hover:opacity-100 transition-opacity !right-8 after:!text-2xl" />
      </Swiper>
    </section>
  );
}

