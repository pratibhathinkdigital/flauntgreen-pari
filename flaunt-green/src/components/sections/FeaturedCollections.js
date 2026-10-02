"use client";

import { useState, useEffect, useRef } from "react";
import { featuredCollections } from "@/lib/content";

  const videos = [
  { id: 1, src: "/videos/FC1.mp4", poster: null },
  { id: 2, src: "/videos/FC2.mp4", poster: null },
  { id: 3, src: "/videos/FC3.mp4", poster: null },
  { id: 4, src: "/videos/FC4.mp4", poster: null },
];

export default function FeaturedCollections() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);

  const changeVideo = (newIndex) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Start fade out
    if (videoRef.current) {
      videoRef.current.style.opacity = "0";
      videoRef.current.style.transform = "scale(1.05)";
    }
    
    // After fade out completes, change video and fade in
    setTimeout(() => {
      setCurrentIndex(newIndex);
      
      // Small delay to ensure new video source is loaded
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.style.opacity = "1";
          videoRef.current.style.transform = "scale(1)";
        }
        setIsTransitioning(false);
      }, 100);
    }, 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % videos.length;
      changeVideo(nextIndex);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videos[currentIndex].src;
      videoRef.current.load();
    }
  }, [currentIndex]);

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    changeVideo(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
    changeVideo(nextIndex);
  };

  const currentVideo = videos[currentIndex];

  return (
    <section className="py-24 bg-white">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text */}
        <div className="flex flex-col justify-center">
          <h2
            className="font-sans font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              color: "#1C2A3A",
            }}
          >
            {featuredCollections.heading}
          </h2>
          <p
            className="mb-10"
            style={{
              fontSize: "20px",
              color: "var(--gold)",
              lineHeight: "1.4",
            }}
          >
            {featuredCollections.subheading}
          </p>
          <button
            className="self-start inline-block text-xs uppercase tracking-[1.5px] font-medium px-4 py-[14px] border border-[var(--gold)] bg-transparent text-[#1C2A3A] transition-all duration-[250ms] hover:bg-[var(--gold)] hover:text-[#F5F1E8]"
          >
            {featuredCollections.buttonText}
          </button>
        </div>

        {/* Right: Video Frame */}
        <div className="flex items-center justify-center gap-5">
          {/* Left arrow */}
          <button
            onClick={goToPrevious}
            className="hidden lg:block select-none cursor-pointer bg-transparent border-none p-0"
            style={{ fontSize: "44px", color: "var(--gold)" }}
            aria-label="Previous video"
          >
            &#8249;
          </button>

          {/* Gold frame */}
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              border: "20px solid #a17f3f",
              width: "100%",
              maxWidth: "360px",
              aspectRatio: "4 / 5",
              backgroundColor: "#fff",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              style={{ 
                transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                opacity: 1,
                transform: "scale(1)"
              }}
              {...(currentVideo.poster ? { poster: currentVideo.poster } : {})}
              src={currentVideo.src}
            />
          </div>

          {/* Right arrow */}
          <button
            onClick={goToNext}
            className="hidden lg:block select-none cursor-pointer bg-transparent border-none p-0"
            style={{ fontSize: "44px", color: "var(--gold)" }}
            aria-label="Next video"
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
