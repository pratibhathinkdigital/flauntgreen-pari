"use client";

import { useEffect, useRef } from "react";

export default function ButterflyHero({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let W, H;

    // ── Resize ──────────────────────────────────────────────────────────────
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Colour palette ───────────────────────────────────────────────────────
    const palette = [
      { body: "#0d3d2e", wing1: "#14533d", wing2: "#0a8a5e", vein: "#07c47a", glow: "rgba(7,196,122,0.18)" },
      { body: "#0a2e3a", wing1: "#0f4a5c", wing2: "#0a7a8c", vein: "#00c4d4", glow: "rgba(0,196,212,0.18)" },
      { body: "#1a1200", wing1: "#3d2e00", wing2: "#7a5c00", vein: "#c49a00", glow: "rgba(196,154,0,0.18)"  },
    ];

    // ── Bokeh particles ──────────────────────────────────────────────────────
    const NUM_BOKEH = 80;
    const bokeh = Array.from({ length: NUM_BOKEH }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 3 + 1,
      alpha: Math.random() * 0.35 + 0.05,
      speed: (Math.random() * 0.15 + 0.04) * 0.001,
      col:   Math.random() < 0.5 ? "#c49a00" : "#07c47a",
    }));

    // ── Butterflies ──────────────────────────────────────────────────────────
    const NUM_BF = 6;

    function makeBF(i) {
      const col = palette[i % palette.length];
      return {
        col,
        // position (0-1 normalised)
        x:     Math.random(),
        y:     Math.random() * 0.7 + 0.1,
        // flight path parameters
        cx:    Math.random() * Math.PI * 2,   // phase offset for X
        cy:    Math.random() * Math.PI * 2,   // phase offset for Y
        ax:    (Math.random() * 0.18 + 0.10), // amplitude X
        ay:    (Math.random() * 0.10 + 0.05), // amplitude Y
        sx:    (Math.random() * 0.3 + 0.15) * (Math.random() < 0.5 ? 1 : -1) * 0.001, // speed X
        sy:    (Math.random() * 0.2 + 0.10) * 0.001, // speed Y
        // wing flap
        flapSpeed: Math.random() * 0.06 + 0.05,
        flapPhase: Math.random() * Math.PI * 2,
        // scale / depth
        scale: Math.random() * 0.55 + 0.35,
        // trail
        trail: [],
      };
    }

    const bfs = Array.from({ length: NUM_BF }, (_, i) => makeBF(i));

    // ── Draw one butterfly wing (mirrored for both sides) ───────────────────
    function drawWing(ctx, col, flapAngle, scale) {
      const s = scale;
      // Each wing is two overlapping bezier "petals"

      // Upper wing
      ctx.save();
      ctx.rotate(flapAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo( 0.8*s, -1.4*s,  2.2*s, -1.0*s,  2.0*s,  0.3*s);
      ctx.bezierCurveTo( 1.8*s,  1.2*s,  0.4*s,  0.8*s,  0,      0);
      const gU = ctx.createRadialGradient(0.8*s, -0.4*s, 0.1*s, 0.8*s, -0.4*s, 2.0*s);
      gU.addColorStop(0,   col.wing2 + "ee");
      gU.addColorStop(0.5, col.wing1 + "cc");
      gU.addColorStop(1,   col.body  + "55");
      ctx.fillStyle = gU;
      ctx.fill();
      // vein lines
      ctx.strokeStyle = col.vein + "66";
      ctx.lineWidth   = 0.06 * s;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(1.6*s, -0.9*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(1.2*s, -1.2*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0.6*s, -1.3*s); ctx.stroke();

      // Lower wing (smaller)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo( 0.6*s,  0.5*s,  2.0*s,  0.8*s,  1.6*s,  1.6*s);
      ctx.bezierCurveTo( 1.0*s,  2.2*s, -0.1*s,  1.2*s,  0,      0);
      const gL = ctx.createRadialGradient(0.7*s, 0.8*s, 0.05*s, 0.7*s, 0.8*s, 1.6*s);
      gL.addColorStop(0,   col.wing2 + "dd");
      gL.addColorStop(0.6, col.wing1 + "aa");
      gL.addColorStop(1,   col.body  + "33");
      ctx.fillStyle = gL;
      ctx.fill();
      ctx.restore();
    }

    function drawButterfly(ctx, bf, t) {
      const bx = bf.x * W;
      const by = bf.y * H;
      const s  = bf.scale * Math.min(W, H) * 0.1; // px size

      // Draw trail
      for (let k = 0; k < bf.trail.length; k++) {
        const pt = bf.trail[k];
        const alpha = (k / bf.trail.length) * 0.12;
        ctx.beginPath();
        ctx.arc(pt.x * W, pt.y * H, s * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = bf.col.vein + Math.round(alpha * 255).toString(16).padStart(2,"0");
        ctx.fill();
      }

      // Glow halo
      const glow = ctx.createRadialGradient(bx, by, 0, bx, by, s * 2.2);
      glow.addColorStop(0,   bf.col.glow);
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bx, by, s * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Flap angle (wings fold inward at top, spread at bottom of flap)
      const flapAngle = Math.cos(t * bf.flapSpeed * Math.PI * 2 * 60 + bf.flapPhase) * 0.55;

      ctx.save();
      ctx.translate(bx, by);

      // Left wing (mirrored)
      ctx.save();
      ctx.scale(-1, 1);
      drawWing(ctx, bf.col, flapAngle, s);
      ctx.restore();

      // Right wing
      drawWing(ctx, bf.col, flapAngle, s);

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.10, s * 0.75, 0, 0, Math.PI * 2);
      ctx.fillStyle = bf.col.body;
      ctx.fill();

      // Antennae
      ctx.strokeStyle = bf.col.vein + "88";
      ctx.lineWidth   = 0.05 * s;
      ctx.beginPath(); ctx.moveTo(0,-0.6*s); ctx.quadraticCurveTo(-0.5*s,-1.3*s,-0.3*s,-1.6*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-0.6*s); ctx.quadraticCurveTo( 0.5*s,-1.3*s, 0.3*s,-1.6*s); ctx.stroke();
      // antenna tips
      ctx.fillStyle = bf.col.vein;
      ctx.beginPath(); ctx.arc(-0.3*s,-1.65*s, 0.08*s, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc( 0.3*s,-1.65*s, 0.08*s, 0, Math.PI*2); ctx.fill();

      ctx.restore();
    }

    // ── Main loop ────────────────────────────────────────────────────────────
    let t = 0;
    function tick() {
      t += 1;

      // Background
      ctx.fillStyle = "#080e0c";
      ctx.fillRect(0, 0, W, H);

      // Subtle radial vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, H*0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.7)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Bokeh
      bokeh.forEach((b) => {
        b.y -= b.speed;
        if (b.y < 0) { b.y = 1; b.x = Math.random(); }
        ctx.beginPath();
        ctx.arc(b.x * W, b.y * H, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.col + Math.round(b.alpha * 255).toString(16).padStart(2,"0");
        ctx.fill();
      });

      // Butterflies
      bfs.forEach((bf) => {
        // Update position — figure-8 / lissajous-ish path
        bf.x += bf.sx + Math.cos(t * 0.009 + bf.cx) * 0.0008;
        bf.y += Math.sin(t * 0.012 + bf.cy) * bf.sy;

        // Bounce gently off edges
        if (bf.x < 0.05) { bf.sx  =  Math.abs(bf.sx);  }
        if (bf.x > 0.95) { bf.sx  = -Math.abs(bf.sx);  }
        if (bf.y < 0.05) { bf.y   = 0.06;               }
        if (bf.y > 0.92) { bf.y   = 0.91;               }

        // Trail
        bf.trail.push({ x: bf.x, y: bf.y });
        if (bf.trail.length > 18) bf.trail.shift();

        drawButterfly(ctx, bf, t);
      });

      animId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "min(90vh, 750px)",
        background: "#080e0c",
        overflow: "hidden",
      }}
    >
      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />

      {/* Bottom gradient fade — so text pops */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(8,14,12,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content slot */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}
