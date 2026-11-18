"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Webp Frames (/public/Webp-frames) ──────────────────────────────────────
const START_FRAME = 0;
// Frame 3387 is the true, clean final frame of the visual story before black frames
const TOTAL_FRAMES = 3388;
const FRAME_PATH = "/Webp-frames/Sequence 01";
const FRAME_EXT = ".webp";
// ─────────────────────────────────────────────────────────────────────────────

const PRELOAD_AHEAD = 24;
const PRELOAD_BEHIND = 6;

function padFrameNumber(num) {
  return num.toString().padStart(4, "0");
}

function ScrollVideo() {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    let ctx = null;
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !container || !canvas) return;

    const glCtx = canvas.getContext("2d");
    if (!glCtx) return;

    const imageCache = new Map();
    const pendingLoads = new Set();
    let currentFrame = -1;

    function drawFrame(frameIndex) {
      const img = imageCache.get(frameIndex);
      if (!img) return;
      if (!canvas || !glCtx) return;
      const gl = glCtx;

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return;
      canvas.width = cw;
      canvas.height = ch;

      const ratio = img.naturalWidth / img.naturalHeight;
      let dw = cw;
      let dh = cw / ratio;
      if (dh < ch) {
        dh = ch;
        dw = ch * ratio;
      }
      let dx = (cw - dw) / 2;
      let dy = (ch - dh) / 2;
      gl.clearRect(0, 0, cw, ch);
      gl.drawImage(img, dx, dy, dw, dh);
    }

    function preloadFrame(index) {
      if (index < 0 || index >= TOTAL_FRAMES) return;
      if (imageCache.has(index) || pendingLoads.has(index)) return;
      pendingLoads.add(index);

      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        imageCache.set(index, img);
        pendingLoads.delete(index);
        if (index === 0 || index === currentFrame) drawFrame(index);
      };
      img.onerror = () => pendingLoads.delete(index);
      img.src = `${FRAME_PATH}${padFrameNumber(index + START_FRAME)}${FRAME_EXT}`;
    }

    function setFrame(frameIndex) {
      if (frameIndex === currentFrame) return;
      currentFrame = frameIndex;

      preloadFrame(frameIndex);
      drawFrame(frameIndex);

      for (let i = 1; i <= PRELOAD_AHEAD; i++) preloadFrame(frameIndex + i);
      for (let j = 1; j <= PRELOAD_BEHIND; j++) preloadFrame(frameIndex - j);
    }

    for (let i = 0; i < PRELOAD_AHEAD + 4; i++) {
      preloadFrame(i);
    }

    ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        pin: container,
        pinSpacing: false,
        scrub: true,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(self.progress * (TOTAL_FRAMES - 1)))
          );
          setFrame(frameIndex);
        },
      });
    });

    const onResize = () => {
      if (currentFrame >= 0) drawFrame(currentFrame);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ctx) ctx.revert();
      imageCache.clear();
      pendingLoads.clear();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "1200vh", position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          position: "sticky",
          top: 0,
          left: 0,
        }}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
    </div>
  );
}

export default function DiscoverEvolvePage() {
  const [scrolledPastTop, setScrolledPastTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastTop(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full bg-[#03153D]">
      {/* Header hides smoothly when user starts scrolling */}
      <Header
        showSpacer={false}
        className={`transition-transform duration-500 ease-in-out ${
          scrolledPastTop ? "-translate-y-full pointer-events-none" : "translate-y-0"
        }`}
      />

      <main className="w-full">
        <ScrollVideo />
      </main>

      {/* Footer displays directly when animation finishes */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
