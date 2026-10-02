"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const slides = [
  { id: 1, type: "video", src: "/assets/dogtogs/waffles.mp4", alt: "Waffles Video" },
];

export default function WafflesStory() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      id="waffles"
      className="waffles-section"
      style={{
        backgroundColor: "#F3E4DD",
        paddingTop: "48px",
        paddingBottom: "48px",
        paddingLeft: "clamp(24px, 6vw, 60px)",
        paddingRight: "clamp(24px, 6vw, 60px)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          className="font-sans text-center"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 3.5vw, 48px)",
            color: "#2B2B2B",
            fontWeight: 700,
            marginBottom: "32px",
          }}
        >
          &ldquo;Woof! I&apos;m Waffles, and I helped create Dog Togs&rdquo;
        </h2>

        <div className="waffles-columns">
          {/* Left Column — Text */}
          <div className="waffles-text">
            <p>
              So here&apos;s the thing. One day, my humans looked at me and said,
              &ldquo;Waffles, you deserve better than a ratty old sweater from the
              pet store.&rdquo; And I said, &ldquo;Woof.&rdquo; Which obviously
              means, &ldquo;You&apos;re absolutely right.&rdquo;
            </p>
            <p>
              Turns out, most pet clothing is made from synthetic junk that
              itches, falls apart after two washes, and looks like it was designed
              by someone who&apos;s never even met a dog. I deserve organic
              cotton. I deserve handloom fabrics. I deserve to look festive
              during Diwali and breezy during beach trips.
            </p>
            <p>
              So my humans started Flaunt Green&apos;s Dog Togs line — sustainable,
              breathable, and honestly? Pretty stylish if I do say so myself.
              Every piece is made from organic and natural fabrics, because
              why should humans have all the fun?
            </p>
            <p>
              From festive bandanas to resort-ready vests, every Dog Togs
              outfit is designed to make your pup look good and feel
              comfortable. No itchy seams. No scratchy tags. Just pure,
              tail-wagging comfort.
            </p>
            <p>
              And I call it: Dog Togs.
            </p>
            <div style={{ marginTop: "16px", display: "flex", gap: "6px" }}>
              <span style={{ fontSize: "20px" }}>🐾</span>
              <span style={{ fontSize: "20px" }}>🐾</span>
            </div>
          </div>

          {/* Right Column — Image/Video Card */}
          <div className="waffles-card-wrapper">
              <div style={{ position: "relative", width: "fit-content" }}>
              {/* <button
                ref={prevRef}
                aria-label="Previous"
                className="waffles-arrow waffles-arrow-left"
              >
                <ChevronLeft size={28} strokeWidth={1.5} />
              </button> */}

              {/* <button
                ref={nextRef}
                aria-label="Next"
                className="waffles-arrow waffles-arrow-right"
              >
                <ChevronRight size={28} strokeWidth={1.5} />
              </button> */}

              <div className="waffles-card">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  onBeforeInit={(swiper) => {
                    swiper.params.prevEl = prevRef.current;
                    swiper.params.nextEl = nextRef.current;
                  }}
                  spaceBetween={0}
                  slidesPerView={1}
                  style={{ width: "100%", height: "100%" }}
                >
                  {slides.map((slide) => (
                    <SwiperSlide key={slide.id} style={{ height: "100%" }}>
                      <div className="waffles-slide">
                        {slide.type === "video" ? (
                          <video
                            src={slide.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="waffles-media"
                          />
                        ) : (
                          <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className="waffles-media"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <p
              className="font-heading text-center"
              style={{
                fontStyle: "italic",
                color: "#A8853D",
                fontSize: "20px",
                marginTop: "20px",
                textAlign: "center",
                width: "100%",
              }}
            >
              Chief Pup Officer
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .waffles-columns {
          display: flex;
          align-items: flex-start;
          gap: 48px;
        }
        .waffles-text {
          flex: 0 0 50%;
        }
        .waffles-text p {
          font-family: var(--font-playwrite-au-vic), cursive;
          font-size: 15px;
          line-height: 1.6;
          color: #333333;
          margin: 0 0 18px 0;
        }
        .waffles-text p:last-of-type {
          margin-bottom: 0;
        }
        .waffles-card-wrapper {
          flex: 0 0 45%;
          margin-left: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .waffles-card {
          position: relative;
          border: 20px solid #A8853D;
          background: #ffffff;
          aspect-ratio: 4 / 5;
          max-width: 360px;
          overflow: hidden;
        }
        .waffles-slide {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .waffles-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .waffles-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          color: #A8853D;
        }
        .waffles-arrow-left {
          left: -28px;
        }
        .waffles-arrow-right {
          right: -28px;
        }

        @media (max-width: 1023px) {
          .waffles-columns {
            flex-direction: column;
            align-items: center;
          }
          .waffles-text,
          .waffles-card-wrapper {
            flex: none;
            width: 100%;
            max-width: 560px;
          }
          .waffles-text {
            margin-bottom: 40px;
          }
        }
        @media (max-width: 639px) {
          .waffles-section {
            padding-left: 24px;
            padding-right: 24px;
          }
          .waffles-card {
            border-width: 12px;
          }
          .waffles-arrow {
            background: rgba(255, 255, 255, 0.75);
            border-radius: 9999px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .waffles-arrow-left {
            left: 8px;
          }
          .waffles-arrow-right {
            right: 8px;
          }
        }
      `}</style>
    </section>
  );
}
