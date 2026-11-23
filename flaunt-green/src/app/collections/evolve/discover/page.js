"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Play, Pause } from "lucide-react";

export default function DiscoverEvolvePage() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {
        // Autoplay policy or gesture error handling
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Auto-hide controls after inactivity while playing
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  // On Desktop/Website: Hide navbar automatically when video plays
  const hideNavbarOnDesktop = isDesktop && isPlaying;

  return (
    <div className="w-full bg-[#03153D] text-white min-h-screen flex flex-col">
      {/* Header: On desktop, automatically hides when video is playing. On mobile, stays normal */}
      <Header
        showSpacer={false}
        className={`transition-transform duration-700 ease-in-out ${
          hideNavbarOnDesktop ? "-translate-y-full pointer-events-none" : "translate-y-0 pointer-events-auto"
        }`}
      />

      {/* Main container: On mobile, original padded card view; On desktop, edge-to-edge full screen hero */}
      <main className="w-full flex-1 flex flex-col md:p-0 p-2 sm:p-4 items-center justify-center">
        {/* Mobile Header Title (shown only on mobile view as originally designed) */}
        <div className="md:hidden text-center mb-3 px-2">
          <h1
            className="text-xl sm:text-2xl font-light tracking-[0.25em] uppercase text-white/95"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            Discover Evolve
          </h1>
          <p className="text-[11px] tracking-[0.18em] uppercase text-white/60 mt-0.5">
            A continuous transformation
          </p>
        </div>

        {/* Video Player Container */}
        <section
          ref={containerRef}
          onMouseMove={resetControlsTimeout}
          onTouchStart={resetControlsTimeout}
          onClick={togglePlay}
          className="relative w-full bg-black overflow-hidden shadow-2xl group select-none cursor-pointer md:h-[100vh] md:min-h-[550px] aspect-video max-w-6xl rounded-lg sm:rounded-xl md:rounded-none md:max-w-none border border-white/10 md:border-none flex items-center justify-center"
        >
          {/* Main Video */}
          <video
            ref={videoRef}
            src="/videos/flauntgreen.mp4"
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            preload="auto"
            onEnded={handleEnded}
            className="w-full h-full bg-black pointer-events-none object-contain md:object-cover md:object-center"
          />

          {/* Center Play Button Overlay (when paused or before start) */}
          {(!isPlaying || !hasStarted) && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/35 backdrop-blur-[1px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#997b47]/90 hover:bg-[#856839] backdrop-blur-sm text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 pl-1 border border-white/20"
              >
                <Play className="w-7 h-7 sm:w-11 sm:h-11 md:w-12 md:h-12 fill-current" />
              </button>
            </div>
          )}

          {/* Minimal Play/Pause Control Button in bottom-left when active */}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`absolute bottom-4 left-4 sm:bottom-6 sm:left-6 transition-opacity duration-300 z-30 ${
              showControls || !isPlaying
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#997b47] backdrop-blur-md text-white flex items-center justify-center shadow-lg transition-all duration-200 border border-white/20"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current pl-0.5" />
              )}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
