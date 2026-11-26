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

  return (
    <div className="w-full bg-[#03153D] text-white min-h-screen flex flex-col">
      {/* Header: Automatically slides up & hides when video plays (on both mobile and website) */}
      <Header
        showSpacer={false}
        className={`transition-transform duration-700 ease-in-out ${
          isPlaying ? "-translate-y-full pointer-events-none" : "translate-y-0 pointer-events-auto"
        }`}
      />

      {/* Main container: Edge-to-edge full width with NO side gaps, padding or border */}
      <main className="w-full flex-1 flex flex-col p-0 items-center justify-center">
        {/* Video Player Container: Edge-to-edge full width (w-full aspect-video on mobile, full-screen hero on desktop) */}
        <section
          ref={containerRef}
          onMouseMove={resetControlsTimeout}
          onTouchStart={resetControlsTimeout}
          onClick={togglePlay}
          className="relative w-full aspect-video md:aspect-auto md:h-[100vh] md:min-h-[550px] bg-black overflow-hidden shadow-2xl group select-none cursor-pointer flex items-center justify-center"
        >
          {/* Main Video: fills edge-to-edge without gaps */}
          <video
            ref={videoRef}
            src="/videos/flauntgreen.mp4"
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            preload="auto"
            onEnded={handleEnded}
            className="w-full h-full bg-black pointer-events-none object-cover object-center"
          />

          {/* Center Play Button Overlay (when paused or before start) */}
          {(!isPlaying || !hasStarted) && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
                className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full bg-[#997b47]/90 hover:bg-[#856839] backdrop-blur-sm text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 pl-1 border border-white/20"
              >
                <Play className="w-6 h-6 sm:w-9 sm:h-9 md:w-12 md:h-12 fill-current" />
              </button>
            </div>
          )}


        </section>
      </main>

      <Footer />
    </div>
  );
}
