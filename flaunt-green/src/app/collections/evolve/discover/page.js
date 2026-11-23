"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  ScreenShare,
} from "lucide-react";

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function DiscoverEvolvePage() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotatedLandscape, setIsRotatedLandscape] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Mute / Unmute toggle
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      video.volume = volume || 0.5;
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Volume slider change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Seek bar scrub
  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(parseFloat(e.target.value));
  };

  // Rotate Landscape Toggle
  const toggleRotateLandscape = (e) => {
    if (e) e.stopPropagation();

    // Check if Screen Orientation API is supported
    if (screen.orientation && typeof screen.orientation.lock === "function") {
      if (!isRotatedLandscape) {
        screen.orientation.lock("landscape").catch(() => {
          setIsRotatedLandscape(true);
        });
        setIsRotatedLandscape(true);
      } else {
        screen.orientation.unlock?.();
        setIsRotatedLandscape(false);
      }
      return;
    }

    // CSS Fallback toggle
    setIsRotatedLandscape((prev) => !prev);
  };

  // Fullscreen toggle (optimized for mobile & desktop)
  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current;

    // Check if currently in fullscreen (native or CSS fullscreen)
    const isCurrentlyFs = Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      isFullscreen
    );

    if (!isCurrentlyFs) {
      // 1. Try iOS native video fullscreen if on iOS Safari
      if (video?.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
        setIsFullscreen(true);
        return;
      }

      // 2. Try Standard Fullscreen API on container
      const reqFs =
        container?.requestFullscreen ||
        container?.webkitRequestFullscreen ||
        container?.mozRequestFullScreen ||
        container?.msRequestFullscreen;

      if (reqFs) {
        reqFs.call(container).then(() => {
          setIsFullscreen(true);
          // Auto lock landscape orientation on mobile devices
          if (screen.orientation && typeof screen.orientation.lock === "function") {
            screen.orientation.lock("landscape").catch(() => {});
          }
        }).catch(() => {
          // Fallback to CSS Fullscreen
          setIsFullscreen(true);
        });
      } else {
        // Fallback to full viewport CSS mode
        setIsFullscreen(true);
      }
    } else {
      // Exit fullscreen
      const exitFs =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;

      if (exitFs && (document.fullscreenElement || document.webkitFullscreenElement)) {
        exitFs.call(document).catch(() => {});
      }
      setIsFullscreen(false);
      setIsRotatedLandscape(false);
      if (screen.orientation?.unlock) {
        screen.orientation.unlock();
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      const fsActive = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(fsActive);
      if (!fsActive) {
        setIsRotatedLandscape(false);
        screen.orientation?.unlock?.();
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  // Controls visibility timeout
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Video time & metadata updates
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  return (
    <div className="w-full bg-[#03153D] text-white min-h-screen flex flex-col">
      <Header />

      <main className="w-full flex-1 flex flex-col items-center justify-center py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-3 sm:gap-4">
          {/* Section Header */}
          <div className="text-center mb-1 sm:mb-2 px-2">
            <h1
              className="text-xl sm:text-3xl md:text-4xl font-light tracking-[0.25em] uppercase text-white/95"
              style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
            >
              Discover Evolve
            </h1>
            <p className="text-[11px] sm:text-sm tracking-[0.18em] uppercase text-white/60 mt-0.5 sm:mt-1">
              A continuous transformation
            </p>
          </div>

          {/* Video Player Container */}
          <div
            ref={containerRef}
            onMouseMove={resetControlsTimeout}
            onTouchStart={resetControlsTimeout}
            onClick={togglePlay}
            className={`relative w-full bg-black overflow-hidden shadow-2xl group select-none cursor-pointer border border-white/10 ${
              isFullscreen
                ? "fixed inset-0 z-[9999] !w-[100vw] !h-[100dvh] !max-w-none !rounded-none !border-none flex items-center justify-center"
                : isRotatedLandscape
                ? "fixed inset-0 z-[9999] !w-[100vh] !h-[100vw] !max-w-none origin-top-left rotate-90 translate-x-[100vw] rounded-none border-none flex items-center justify-center"
                : "aspect-video rounded-lg sm:rounded-xl"
            }`}
          >
            <video
              ref={videoRef}
              src="/videos/flauntgreen.mp4"
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              className={`w-full h-full bg-black ${
                isFullscreen || isRotatedLandscape ? "object-contain" : "object-cover"
              }`}
            />

            {/* Center Big Play/Pause Button Overlay */}
            {(!isPlaying || !hasStarted) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  aria-label={isPlaying ? "Pause Video" : "Play Video"}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#997b47] hover:bg-[#856839] text-white flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 pl-1"
                >
                  <Play className="w-7 h-7 sm:w-11 sm:h-11 fill-current" />
                </button>
              </div>
            )}

            {/* Video Controls Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 sm:p-5 transition-opacity duration-300 flex flex-col gap-2 sm:gap-3 z-10 ${
                showControls || !isPlaying
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Progress Slider */}
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress || 0}
                  onChange={handleSeek}
                  className="w-full h-1.5 sm:h-2 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[#997b47] touch-none"
                  aria-label="Seek Video"
                />
              </div>

              {/* Bottom Controls Row */}
              <div className="flex items-center justify-between gap-2 text-white text-xs sm:text-sm">
                {/* Left Controls: Play/Pause, Replay, Volume, Time */}
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Play / Pause */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1 sm:p-1.5 hover:text-[#997b47] transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    )}
                  </button>

                  {/* Replay */}
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-1 sm:p-1.5 hover:text-[#997b47] transition-colors"
                    aria-label="Restart Video"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Volume / Mute */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 sm:p-1.5 hover:text-[#997b47] transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                    {/* Hide volume slider on very small screens to keep UI spacious */}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="hidden sm:inline-block w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#997b47]"
                      aria-label="Volume Slider"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-[10px] sm:text-xs font-mono text-white/80 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Controls: Rotate to Landscape & Fullscreen */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Rotate Screen / Landscape Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleRotateLandscape}
                    title="Rotate to Landscape"
                    className={`flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-[#997b47] transition-colors text-[10px] sm:text-xs font-medium ${
                      isRotatedLandscape ? "bg-[#997b47] text-white" : "text-white/90"
                    }`}
                    aria-label="Rotate Landscape Mode"
                  >
                    <ScreenShare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Rotate</span>
                  </button>

                  {/* Fullscreen Toggle */}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-1 sm:p-1.5 hover:text-[#997b47] transition-colors"
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
