"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { hero } from "@/lib/content";

const slides = [
  {
    id: 1,
    image: "/assets/Banner11.png",
    alt: "Flaunt Green collection banner 1 of 3",
    focus: "100%",
  },
  {
    id: 2,
    image: "/assets/Banner2.png",
    alt: "Flaunt Green collection banner 2 of 3",
    focus: "0%",
  },
  {
    id: 3,
    image: "/assets/Banner4.png",
    alt: "Flaunt Green collection banner 3 of 3",
    focus: "65%",
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full h-[clamp(360px,52vh,480px)] sm:h-[85vh] sm:min-h-[500px] bg-midnight overflow-hidden group">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, renderBullet: () => '<span class="swiper-pagination-bullet bg-gold"></span>' }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "eager"}
              sizes="100vw"
              className="hero-slide-img object-cover transition-transform duration-[10000ms] scale-100 hover:scale-110"
              style={{ "--hero-focus-x": slide.focus }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)" }} />
            <div className="absolute inset-0 flex items-end" style={{ top: "55%" }}>
              <div className="w-full text-center px-4 sm:px-8 pb-8 sm:pb-[12%] -ml-0 sm:-ml-[0.80%]">
                <h1
                  className="font-heading font-normal text-white leading-tight mb-5"
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 46px)",
                    textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                    color: "#FFFFFF",
                    textWrap: "balance",
                  }}
                >
                  {hero.headline}
                </h1>
                <Link
                  href="/collections/ekam"
                  className="btn rounded-none inline-block text-xs uppercase tracking-[2px] font-medium mx-auto px-[30px] py-[14px] bg-[#8C7A4E] text-[#F5F1E8] transition-all duration-[250ms] hover:bg-[#7A6A3E]"
                >
                  {hero.buttonText}
                </Link>
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
