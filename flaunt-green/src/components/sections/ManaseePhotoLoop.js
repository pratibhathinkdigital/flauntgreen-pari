"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/assets/Our Story/manasee1.jpg", alt: "Manasee Paranjape Ambhaikar" },
  { src: "/assets/Our Story/manasee2.JPG", alt: "Manasee Paranjape Ambhaikar" },
];

const DURATION = 4500;

export default function ManaseePhotoLoop({ caption }) {
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setFade(!query.matches);
    const onChange = (e) => setFade(!e.matches);
    query.addEventListener("change", onChange);

    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, DURATION);

    return () => {
      clearInterval(timer);
      query.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden bg-[#1C2A3A]/5" style={{ aspectRatio: "4 / 5" }}>
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            aria-hidden={i !== active}
            className="absolute inset-0"
            style={{
              opacity: i === active ? 1 : 0,
              transition: fade ? "opacity 1200ms ease-in-out" : "none",
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show photo ${i + 1} of ${SLIDES.length}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className="h-[3px] w-7 transition-all duration-300"
              style={{ backgroundColor: i === active ? "#F5F1E8" : "rgba(245,241,232,0.4)" }}
            />
          ))}
        </div>
      </div>

      {caption}
    </div>
  );
}
