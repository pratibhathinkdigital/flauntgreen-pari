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

// High preloading buffer to eliminate stuttering during fast/continuous scroll
const PRELOAD_AHEAD = 60;
const PRELOAD_BEHIND = 20;

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

    const glCtx = canvas.getContext("2d", { alpha: false });
    if (!glCtx) return;

    // Cache settings
    const MAX_CACHE_SIZE = 180;
    const imageCache = new Map();
    const pendingLoads = new Set();
    let currentRenderedFrame = -1;
    let targetFrame = 0;
    let animFrameId = null;

    // Render loop synced with browser refresh rate (60fps/120fps)
    function render() {
      if (targetFrame !== currentRenderedFrame) {
        const img = imageCache.get(targetFrame);
        if (img && img.complete && img.naturalWidth > 0) {
          const cw = canvas.clientWidth;
          const ch = canvas.clientHeight;
          if (cw > 0 && ch > 0) {
            // Keep canvas buffer matching display size
            if (canvas.width !== cw || canvas.height !== ch) {
              canvas.width = cw;
              canvas.height = ch;
            }

            const ratio = img.naturalWidth / img.naturalHeight;
            let dw = cw;
            let dh = cw / ratio;
            if (dh < ch) {
              dh = ch;
              dw = ch * ratio;
            }
            const dx = (cw - dw) * 0.5;
            const dy = (ch - dh) * 0.5;

            glCtx.imageSmoothingEnabled = true;
            glCtx.imageSmoothingQuality = "high";
            glCtx.drawImage(img, dx, dy, dw, dh);
            currentRenderedFrame = targetFrame;
          }
        }
      }
      animFrameId = requestAnimationFrame(render);
    }
    animFrameId = requestAnimationFrame(render);

    function trimCache(centerIndex) {
      if (imageCache.size > MAX_CACHE_SIZE) {
        for (const [key] of imageCache) {
          if (Math.abs(key - centerIndex) > PRELOAD_AHEAD + 30) {
            imageCache.delete(key);
            if (imageCache.size <= MAX_CACHE_SIZE - 20) break;
          }
        }
      }
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
      };
      img.onerror = () => pendingLoads.delete(index);
      img.src = `${FRAME_PATH}${padFrameNumber(index + START_FRAME)}${FRAME_EXT}`;
    }

    function setFrame(frameIndex) {
      targetFrame = frameIndex;

      preloadFrame(frameIndex);
      for (let i = 1; i <= PRELOAD_AHEAD; i++) preloadFrame(frameIndex + i);
      for (let j = 1; j <= PRELOAD_BEHIND; j++) preloadFrame(frameIndex - j);
      trimCache(frameIndex);
    }

    // Initial preloading of beginning frames
    for (let i = 0; i < 40; i++) {
      preloadFrame(i);
    }

    // Smooth scrub object for interpolated easing
    const scrollObj = { frame: 0 };

    ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        pin: container,
        pinSpacing: false,
        scrub: 1.2, // Ultra-smooth momentum scrubbing
        onUpdate: (self) => {
          const destFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(self.progress * (TOTAL_FRAMES - 1)))
          );
          setFrame(destFrame);
        },
      });
    });

    const onResize = () => {
      if (currentRenderedFrame >= 0) {
        currentRenderedFrame = -1; // Force repaint on next animation frame
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", onResize);
      if (ctx) ctx.revert();
      imageCache.clear();
      pendingLoads.clear();
    };
  }, []);

  return (
    // Height set to 2400vh for comfortable, slow and controlled scroll reading speed
    <div ref={wrapperRef} style={{ height: "2400vh", position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          position: "sticky",
          top: 0,
          left: 0,
          willChange: "transform",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        />
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
