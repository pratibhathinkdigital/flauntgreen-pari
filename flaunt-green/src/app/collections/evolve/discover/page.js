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
  const progressBarRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const isSeekingRef = useRef(false);

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
    e.stopPropagation();
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

  // Direct Seek to percentage
  const seekToPercent = useCallback(
    (pct) => {
      const video = videoRef.current;
      if (!video) return;

      const targetPct = Math.max(0, Math.min(100, pct));
      const totalDuration = video.duration || duration;
      if (!totalDuration || isNaN(totalDuration)) return;

      const newTime = (targetPct / 100) * totalDuration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(targetPct);
    },
    [duration]
  );

  // Scrub via slider input
  const handleSeekInput = (e) => {
    e.stopPropagation();
    isSeekingRef.current = true;
    const val = parseFloat(e.target.value);
    setProgress(val);
    seekToPercent(val);
  };

  const handleSeekChange = (e) => {
    e.stopPropagation();
    isSeekingRef.current = false;
    const val = parseFloat(e.target.value);
    seekToPercent(val);
  };

  // Click / Touch anywhere on progress bar
  const handleProgressClick = (e) => {
    e.stopPropagation();
    const bar = progressBarRef.current;
    if (!bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = (clickX / rect.width) * 100;
    seekToPercent(pct);
  };

  // Rotate Landscape Toggle (for mobile)
  const toggleRotateLandscape = async (e) => {
    if (e) e.stopPropagation();

    // If currently rotated or fullscreen, exit cleanly
    if (isRotatedLandscape || isFullscreen) {
      setIsRotatedLandscape(false);
      try {
        if (screen.orientation?.unlock) {
          screen.orientation.unlock();
        }
      } catch (_) {}

      const exitFs =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
      if (exitFs && (document.fullscreenElement || document.webkitFullscreenElement)) {
        try {
          await exitFs.call(document);
        } catch (_) {}
      }
      setIsFullscreen(false);
      return;
    }

    // Entering Rotate Landscape
    const container = containerRef.current;
    const video = videoRef.current;

    // 1. On iOS Safari: use native video fullscreen directly
    if (video?.webkitEnterFullscreen && !container?.requestFullscreen) {
      try {
        video.webkitEnterFullscreen();
        setIsFullscreen(true);
        return;
      } catch (_) {}
    }

    // 2. On Android / Chrome: Request Fullscreen on container, then lock orientation
    const reqFs =
      container?.requestFullscreen ||
      container?.webkitRequestFullscreen ||
      container?.mozRequestFullScreen ||
      container?.msRequestFullscreen;

    let fsSuccess = false;
    if (reqFs) {
      try {
        await reqFs.call(container);
        fsSuccess = true;
        setIsFullscreen(true);
      } catch (_) {
        fsSuccess = false;
      }
    }

    // Try orientation lock if supported
    if (screen.orientation && typeof screen.orientation.lock === "function") {
      try {
        await screen.orientation.lock("landscape");
        setIsRotatedLandscape(true);
        return;
      } catch (_) {
        // If orientation lock fails and fs worked, user can physically rotate phone or use CSS
      }
    }

    // 3. Fallback: CSS rotation
    setIsRotatedLandscape(true);
  };

  // Fullscreen toggle
  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current;

    const isCurrentlyFs = Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      isFullscreen
    );

    if (!isCurrentlyFs) {
      if (video?.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
        setIsFullscreen(true);
        return;
      }

      const reqFs =
        container?.requestFullscreen ||
        container?.webkitRequestFullscreen ||
        container?.mozRequestFullScreen ||
        container?.msRequestFullscreen;

      if (reqFs) {
        reqFs.call(container).then(() => {
          setIsFullscreen(true);
          if (screen.orientation && typeof screen.orientation.lock === "function") {
            screen.orientation.lock("landscape").catch(() => {});
          }
        }).catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
    } else {
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
      }, 3500);
    }
  }, [isPlaying]);

  // Video time & metadata updates
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isSeekingRef.current) return;
    setCurrentTime(video.currentTime);
    if (video.duration && !isNaN(video.duration)) {
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
          className={`relative w-full bg-black overflow-hidden shadow-2xl group select-none cursor-pointer ${
            isFullscreen && !isRotatedLandscape
              ? "fixed inset-0 z-[9999] !w-screen !h-[100dvh] !rounded-none !border-none flex items-center justify-center"
              : isRotatedLandscape
              ? "fixed inset-0 z-[9999] !w-[100dvh] !h-[100dvw] origin-top-left rotate-90 translate-x-[100dvw] !rounded-none !border-none flex items-center justify-center overflow-hidden"
              : "md:h-[100vh] md:min-h-[550px] aspect-video max-w-6xl rounded-lg sm:rounded-xl md:rounded-none md:max-w-none border border-white/10 md:border-none"
          }`}
        >
          {/* Main Video */}
          <video
            ref={videoRef}
            src="/videos/flauntgreen.mp4"
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className={`w-full h-full bg-black pointer-events-none ${
              isFullscreen || isRotatedLandscape
                ? "object-contain"
                : "object-contain md:object-cover md:object-center"
            }`}
          />

          {/* Center Big Play Button Overlay */}
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

          {/* Floating Video Controls Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 sm:p-5 md:p-6 transition-opacity duration-300 flex flex-col gap-2 sm:gap-3 z-30 ${
              showControls || !isPlaying
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Interactive Progress Bar & Scrub Track */}
            <div
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="relative w-full py-2.5 sm:py-3 flex items-center cursor-pointer group/bar"
            >
              {/* Visual track background */}
              <div className="w-full h-1.5 sm:h-2 bg-white/25 rounded-full overflow-hidden relative group-hover/bar:h-2.5 transition-all">
                {/* Active Progress fill */}
                <div
                  className="h-full bg-[#997b47] rounded-full transition-[width] duration-75"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>

              {/* Native range input for seamless drag/touch scrub */}
              <input
                type="range"
                min="0"
                max="100"
                step="0.05"
                value={progress || 0}
                onInput={handleSeekInput}
                onChange={handleSeekChange}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Seek Video Scrub"
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
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Rotate Screen / Landscape Toggle Button */}
                <button
                  type="button"
                  onClick={toggleRotateLandscape}
                  title="Rotate to Landscape"
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-white/10 hover:bg-[#997b47] transition-colors text-[10px] sm:text-xs font-medium ${
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
