"use client";

import { useRef, useState, useEffect } from "react";

export default function OurStoryVideoHero() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "92vh", minHeight: "480px", maxHeight: "900px" }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={muted}
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: videoLoaded ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <source src="/assets/Our Story/OUR STORY_LP.mp4" type="video/mp4" />
      </video>

      {!videoLoaded && <div className="absolute inset-0 bg-[#1C2A3A]" />}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1
          className="text-white text-[52px] sm:text-[72px] md:text-[88px] lg:text-[100px] font-bold tracking-wider uppercase leading-none drop-shadow-lg"
          style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
        >
          Our Story
        </h1>
        <p className="text-white/80 mt-5 text-base sm:text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed">
          Luxury fashion that tells a sustainability story — born from a commitment to conscious craftsmanship.
        </p>
      </div>

      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300"
        aria-label={muted ? "Unmute video" : "Mute video"}
        id="our-story-video-mute-btn"
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </section>
  );
}