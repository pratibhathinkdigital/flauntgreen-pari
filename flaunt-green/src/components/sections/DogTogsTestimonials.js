"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, X, Quote } from "lucide-react";
import { testimonialsApi } from "@/services/api";

const INITIAL_DOG_TESTIMONIALS = [
  {
    id: 1,
    name: "Priya M.",
    city: "Bangalore",
    rating: 5,
    quote: "Finally-a brand that gets it. My Frenchie can actually move in these!",
  },
  {
    id: 2,
    name: "Aasif",
    city: "Delhi",
    rating: 5,
    quote: "So soft, I'd wear them myself.",
  },
  {
    id: 3,
    name: "Meera K.",
    city: "Mumbai",
    rating: 5,
    quote: "The quality is incredible. Worth every rupee for my little princess.",
  },
];

function SingleDogTestimonialCard({ t, onOpenModal }) {
  const isLong = t.quote && t.quote.length > 130;

  return (
    <div
      className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-soft-sm hover:shadow-soft transition-all duration-200 border border-stone-200/60 h-full min-h-[250px] relative group"
      style={{ background: "#F3F3F1" }}
    >
      <div className="flex flex-col flex-1">
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3.5">
          {[...Array(t.rating || 5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-current"
              style={{ color: "#F5C518" }}
            />
          ))}
        </div>

        {/* Quote Content - Consistent height with line clamp so card height is ALWAYS identical */}
        <div className="min-h-[96px] flex flex-col justify-center mb-3">
          <p
            className="font-heading font-bold text-stone-900 leading-snug line-clamp-3"
            style={{ fontSize: "16px", color: "#222222" }}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => onOpenModal(t)}
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold mt-1.5 self-start hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Read full testimonial →
            </button>
          )}
        </div>
      </div>

      {/* Author & Verification Footer */}
      <div className="pt-4 border-t border-black/[0.06] mt-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-sans font-semibold text-stone-800 truncate">
            {t.name}
          </p>
          {t.city && (
            <p className="text-xs font-sans text-stone-500 truncate">
              {t.city}
            </p>
          )}
        </div>
        <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Verified
        </span>
      </div>
    </div>
  );
}

export default function DogTogsTestimonials() {
  const [testimonials, setTestimonials] = useState(INITIAL_DOG_TESTIMONIALS);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_DOG_TESTIMONIALS.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await testimonialsApi.getByPage("dog_togs");
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setTestimonials(res.data);
          setCurrentIndex(res.data.length);
        }
      } catch (err) {
        console.warn("Could not fetch dog togs testimonials dynamically, using fallback:", err);
      }
    }
    fetchTestimonials();
  }, []);

  // Update visible count based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = testimonials.length;
  // Repeat items 3 times for seamless infinite forward and backward gliding
  const extendedItems = [...testimonials, ...testimonials, ...testimonials];

  // Auto-scroll timer: relaxed 5 seconds interval
  useEffect(() => {
    if (isPaused || selectedTestimonial || total <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, selectedTestimonial, total]);

  // Seamless jump without animation once slide completes
  const handleTransitionEnd = () => {
    if (currentIndex >= total * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - total);
    } else if (currentIndex < total) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + total);
    }
  };

  // Re-enable smooth transition right after silent jump
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const activeDotIndex = total > 0 ? ((currentIndex % total) + total) % total : 0;
  const slidePercent = 100 / itemsPerView;
  const translateX = currentIndex * slidePercent;

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="container-site mb-10 md:mb-12 text-center">
        <h2
          className="font-sans font-bold leading-tight mb-5 md:mb-6"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 3.5vw, 48px)",
            color: "#1A1A1A",
          }}
        >
          Customer Testimonials
        </h2>
        <p
          className="font-tagline"
          style={{
            fontSize: "clamp(18px, 2.2vw, 22px)",
            color: "#333333",
          }}
        >
          Loved by Dogs. Trusted by Their Humans.
        </p>
      </div>

      <div
        className="w-full px-4 sm:px-8 lg:px-16 py-10 md:py-14"
        style={{ background: "#F9F9F7" }}
      >
        <div
          className="max-w-6xl mx-auto relative px-2 sm:px-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Side Navigation Arrow: PREV */}
          {total > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute -left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-stone-700 shadow-md hover:shadow-lg border border-stone-200/90 flex items-center justify-center transition-all duration-200 hover:bg-stone-50 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-stone-700" />
            </button>
          )}

          {/* Visible Window with Hidden Overflow */}
          <div className="overflow-hidden w-full py-2">
            {/* Sliding Track - 1200ms smooth gentle gliding */}
            <div
              className="flex items-stretch"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${translateX}%)`,
                transition: isTransitioning
                  ? "transform 1200ms cubic-bezier(0.25, 1, 0.5, 1)"
                  : "none",
                willChange: "transform",
              }}
            >
              {extendedItems.map((item, idx) => (
                <div
                  key={`${item.id || idx}-${idx}`}
                  className="shrink-0 px-3"
                  style={{ width: `${slidePercent}%` }}
                >
                  <SingleDogTestimonialCard
                    t={item}
                    onOpenModal={setSelectedTestimonial}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Side Navigation Arrow: NEXT */}
          {total > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute -right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-stone-700 shadow-md hover:shadow-lg border border-stone-200/90 flex items-center justify-center transition-all duration-200 hover:bg-stone-50 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-stone-700" />
            </button>
          )}

          {/* Subtle Bottom Dots Indicator */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(total + idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeDotIndex
                      ? "w-6 bg-brand-700"
                      : "w-2 bg-stone-300 hover:bg-stone-400"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL FOR FULL TESTIMONIAL */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-stone-100 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close testimonial popup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Stars & Verified Badge */}
            <div className="flex items-center justify-between mb-4 pr-8">
              <div className="flex items-center gap-1">
                {[...Array(selectedTestimonial.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-current"
                    style={{ color: "#F5C518" }}
                  />
                ))}
              </div>
              <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Buyer
              </span>
            </div>

            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-stone-300 mb-2 rotate-180" />

            {/* Full Quote Content */}
            <div className="max-h-[50vh] overflow-y-auto pr-1 my-3 scrollbar-thin">
              <p
                className="font-heading font-bold text-stone-900 leading-relaxed"
                style={{ fontSize: "17px", color: "#1A1A1A" }}
              >
                &ldquo;{selectedTestimonial.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-stone-100 mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-800 text-brand-100 flex items-center justify-center font-bold text-sm uppercase">
                {selectedTestimonial.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-sm">
                  {selectedTestimonial.name}
                </p>
                {selectedTestimonial.city && (
                  <p className="text-xs text-stone-500">
                    {selectedTestimonial.city}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
