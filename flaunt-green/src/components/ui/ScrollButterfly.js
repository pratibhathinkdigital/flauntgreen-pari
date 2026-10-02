"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";

/* ─────────────────────────────────────────────
   Golden Butterfly SVG — detailed anatomy
   forewings + hindwings + body + antennae
───────────────────────────────────────────── */
function ButterflySVG({ wingScale = 1, side = "right" }) {
  const flip = side === "left" ? -1 : 1;
  return (
    <svg
      width="220"
      height="200"
      viewBox="0 0 220 200"
      fill="none"
      style={{ overflow: "visible", transform: `scaleX(${flip})` }}
    >
      <defs>
        {/* Forewing gradient */}
        <radialGradient id={`fw-${side}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"  stopColor="#FFD966" />
          <stop offset="30%" stopColor="#F0A500" />
          <stop offset="65%" stopColor="#C47D00" />
          <stop offset="100%" stopColor="#7A4A00" stopOpacity="0.85" />
        </radialGradient>
        {/* Hindwing gradient */}
        <radialGradient id={`hw-${side}`} cx="45%" cy="30%" r="65%">
          <stop offset="0%"  stopColor="#FFE082" />
          <stop offset="40%" stopColor="#E8961C" />
          <stop offset="75%" stopColor="#B86800" />
          <stop offset="100%" stopColor="#5C3000" stopOpacity="0.9" />
        </radialGradient>
        {/* Shimmer overlay */}
        <radialGradient id={`sh-${side}`} cx="30%" cy="20%" r="50%">
          <stop offset="0%"  stopColor="#FFFDE7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFDE7" stopOpacity="0"   />
        </radialGradient>
        <filter id={`glow-${side}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Right Forewing ── */}
      <motion.g
        style={{ originX: "110px", originY: "100px" }}
        animate={{ scaleX: wingScale }}
        transition={{ duration: 0 }}
      >
        <path
          d="M110 100
             C 95 78, 55 40, 20 25
             C  5 18, 2 35, 12 52
             C 30 78, 72 92, 110 100 Z"
          fill={`url(#fw-${side})`}
          filter={`url(#glow-${side})`}
        />
        {/* Wing cells */}
        <path d="M110 100 C 85 78, 55 52, 28 38" stroke="#7A4A00" strokeWidth="0.8" strokeOpacity="0.6" fill="none"/>
        <path d="M110 100 C 88 82, 62 62, 38 50" stroke="#7A4A00" strokeWidth="0.7" strokeOpacity="0.5" fill="none"/>
        <path d="M110 100 C 92 86, 72 74, 54 66" stroke="#7A4A00" strokeWidth="0.6" strokeOpacity="0.4" fill="none"/>
        {/* Wing margin veins */}
        <path d="M20 25 C 30 38, 48 56, 62 70" stroke="#7A4A00" strokeWidth="0.5" strokeOpacity="0.4" fill="none"/>
        <path d="M35 30 C 44 44, 58 58, 70 72" stroke="#7A4A00" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
        {/* Dark border spots */}
        <ellipse cx="22" cy="30" rx="7" ry="5"  fill="#3A2000" fillOpacity="0.55" transform="rotate(-25 22 30)"/>
        <ellipse cx="42" cy="22" rx="5" ry="4"  fill="#3A2000" fillOpacity="0.45" transform="rotate(-15 42 22)"/>
        {/* Shimmer highlight */}
        <path
          d="M110 100 C 95 78, 55 40, 20 25 C 5 18, 2 35, 12 52 C 30 78, 72 92, 110 100 Z"
          fill={`url(#sh-${side})`}
        />
      </motion.g>

      {/* ── Right Hindwing ── */}
      <motion.g
        style={{ originX: "110px", originY: "100px" }}
        animate={{ scaleX: wingScale }}
        transition={{ duration: 0 }}
      >
        <path
          d="M110 100
             C 92 112, 60 128, 28 148
             C 10 158, 8 142, 18 128
             C 36 106, 75 98, 110 100 Z"
          fill={`url(#hw-${side})`}
          filter={`url(#glow-${side})`}
        />
        {/* Hindwing veins */}
        <path d="M110 100 C 88 110, 62 122, 36 138" stroke="#7A4A00" strokeWidth="0.7" strokeOpacity="0.5" fill="none"/>
        <path d="M110 100 C 92 108, 70 118, 50 132" stroke="#7A4A00" strokeWidth="0.6" strokeOpacity="0.4" fill="none"/>
        {/* Dark margin spots */}
        <ellipse cx="24" cy="142" rx="6" ry="5" fill="#3A2000" fillOpacity="0.5" transform="rotate(20 24 142)"/>
        <ellipse cx="40" cy="152" rx="5" ry="4" fill="#3A2000" fillOpacity="0.4" transform="rotate(15 40 152)"/>
        {/* Shimmer */}
        <path
          d="M110 100 C 92 112, 60 128, 28 148 C 10 158, 8 142, 18 128 C 36 106, 75 98, 110 100 Z"
          fill={`url(#sh-${side})`}
        />
      </motion.g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Full butterfly: left + right wings + body
───────────────────────────────────────────── */
function GoldenButterfly({ flapProgress }) {
  // flapProgress: 0 = fully open, 1 = fully closed
  const wingOpen  =  1;
  const wingClose = 0.1;
  const scale = wingOpen - (wingOpen - wingClose) * flapProgress;

  return (
    <div style={{ position: "relative", width: "220px", height: "200px" }}>
      {/* Left wing (mirrored) */}
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "right center" }}>
        <ButterflySVG wingScale={scale} side="left" />
      </div>
      {/* Right wing */}
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "left center" }}>
        <ButterflySVG wingScale={scale} side="right" />
      </div>

      {/* Body */}
      <svg
        width="220"
        height="200"
        viewBox="0 0 220 200"
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="body-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#5C3600" />
            <stop offset="50%" stopColor="#3A2000" />
            <stop offset="100%" stopColor="#1A0E00" />
          </linearGradient>
        </defs>
        {/* Thorax */}
        <ellipse cx="110" cy="96" rx="5" ry="8" fill="url(#body-g)" />
        {/* Abdomen */}
        <path d="M107 104 Q110 140 110 158" stroke="url(#body-g)" strokeWidth="7" strokeLinecap="round" fill="none"/>
        {/* Head */}
        <circle cx="110" cy="88" r="5" fill="#3A2000"/>
        {/* Eyes */}
        <circle cx="107" cy="86" r="1.5" fill="#C47D00"/>
        <circle cx="113" cy="86" r="1.5" fill="#C47D00"/>
        {/* Antennae */}
        <path d="M108 84 Q94 64, 86 50" stroke="#3A2000" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M112 84 Q124 62, 130 48" stroke="#3A2000" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        {/* Antenna tips (clubs) */}
        <circle cx="86"  cy="50" r="3" fill="#C47D00" />
        <circle cx="130" cy="48" r="3" fill="#C47D00" />
      </svg>

      {/* Golden glow halo */}
      <div style={{
        position: "absolute",
        inset: "-20px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,165,0,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main exported component
   — scroll-linked position + flapping wings
───────────────────────────────────────────── */
export default function ScrollButterfly() {
  const containerRef = useRef(null);

  // Track scroll of the whole page
  const { scrollYProgress } = useScroll();

  // ── X path: butterfly weaves left-right as you scroll ──
  // Uses a sine-wave-like multi-stop transform
  const rawX = useTransform(
    scrollYProgress,
    [0,   0.1,  0.2,  0.3,  0.4,  0.5,  0.6,  0.7,  0.8,  0.9,  1.0],
    ["65vw","55vw","70vw","45vw","60vw","35vw","55vw","25vw","50vw","30vw","60vw"]
  );

  // ── Y path: butterfly drifts down with scroll, with slight oscillation ──
  const rawY = useTransform(
    scrollYProgress,
    [0,   0.15, 0.3,  0.45, 0.6,  0.75, 0.9,  1.0],
    ["12vh","20vh","15vh","28vh","22vh","35vh","28vh","18vh"]
  );

  // ── Rotation: tilts in the direction of horizontal movement ──
  const rotation = useTransform(
    scrollYProgress,
    [0,   0.1,  0.2,  0.3,  0.4,  0.5,  0.6,  0.7,  0.8,  0.9,  1.0],
    [0,  -8,    10,   -12,   8,   -15,   10,   -10,   8,   -8,    5]
  );

  // Spring-smooth everything so motion feels organic
  const x        = useSpring(rawX,   { stiffness: 30, damping: 20 });
  const y        = useSpring(rawY,   { stiffness: 25, damping: 18 });
  const rotate   = useSpring(rotation, { stiffness: 40, damping: 22 });

  // ── Wing flap: continuous oscillation via MotionValue ──
  const flapMV = useMotionValue(0);
  useEffect(() => {
    const controls = animate(flapMV, [0, 1, 0], {
      duration: 0.45,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return controls.stop;
  }, [flapMV]);

  // Sync flapMV to a React state for rendering
  const flapRef = useRef(0);
  useEffect(() => {
    return flapMV.on("change", (v) => { flapRef.current = v; });
  }, [flapMV]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x,
        y,
        rotate,
        zIndex: 40,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {/* Re-render butterfly each frame via motion subscription */}
      <FlapRenderer flapMV={flapMV} />
    </motion.div>
  );
}

/* ── Sub-component that subscribes to flapMV and re-renders ── */
function FlapRenderer({ flapMV }) {
  const [flap, setFlap] = useState(0);

  useEffect(() => {
    return flapMV.on("change", (v) => setFlap(v));
  }, [flapMV]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <GoldenButterfly flapProgress={flap} />
    </motion.div>
  );
}
