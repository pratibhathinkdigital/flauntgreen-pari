"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ButterflyHero from "@/components/ui/ButterflyHero";
import Link from "next/link";
import Image from "next/image";
import { Leaf, TreeDeciduous, Sprout, Wind, Eye, Hand, ChevronLeft, ChevronRight, Sparkles, ArrowRight, HelpCircle, Info, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const colorStories = [
  {
    id: "blue-nawab",
    title: "BLUE NAWAB",
    subtitle: "Regal Metamorphosis",
    description: "The royal blues and majestic outlines of its wings inspire sharp, clean-cut silhouettes. Mixed with the fiery red nectar of the Ixora flowers, this narrative forms our Regal Blue and Fiery Red core signature.",
    image: "/assets/evolve/blue_nawab.png",
    bgGradient: "linear-gradient(135deg, #0a1826 0%, #102e4a 100%)",
    swatches: [
      { name: "Regal Blue", hex: "#0b233a" },
      { name: "Fiery Red", hex: "#8b1818" }
    ]
  },
  {
    id: "autumn-leaf",
    title: "AUTUMN LEAF",
    subtitle: "Organic Camouflage",
    description: "The perfect biological camouflage: wings mimicking rich dry leaves to blend with the forest. Translated into elegant draping capes and flowing jackets finished in a signature Oakleaf Orange.",
    image: "/assets/evolve/autumn_leaf.png",
    bgGradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)",
    swatches: [
      { name: "Oakleaf Orange", hex: "#d9541e" },
      { name: "Earthy Bark", hex: "#63390f" }
    ]
  },
  {
    id: "albulina",
    title: "ALBULINA",
    subtitle: "High Alpine Ventral",
    description: "Inspired by the metallic details of high-altitude Himalayan species. Reflected in delicate corded tucks representing wing venation, tinted with a glowing ventral Buttercup Yellow.",
    image: "/assets/evolve/albulina.png",
    bgGradient: "linear-gradient(135deg, #854d0e 0%, #ca8a04 100%)",
    swatches: [
      { name: "Buttercup Yellow", hex: "#e6c200" },
      { name: "Meadow Slate", hex: "#4e6570" }
    ]
  }
];

const designInspirations = [
  {
    id: "cocoon",
    title: "Cocoon Shape",
    desc: "Soft, protective, enveloping silhouettes mirroring the warm safety of a butterfly's cocoon.",
    natureLabel: "Chrysalis / Cocoon",
    garmentLabel: "Voluminous Drape",
    image: "/assets/evolve/cocoon_transform.png"
  },
  {
    id: "hem-design",
    title: "Butterfly Hem Design",
    desc: "Asymmetric hemlines and flowing trails that flutter organically with every movement.",
    natureLabel: "Wing Outline / Tail",
    garmentLabel: "Asymmetric Skirt",
    image: "/assets/evolve/hem_transform.png"
  },
  {
    id: "corded-tucks",
    title: "Corded Tucks",
    desc: "Finely stitched raised lines that copy the venation and structure of biological wings.",
    natureLabel: "Wing Venation Lines",
    garmentLabel: "Structured Pleating",
    image: "/assets/evolve/tucks_transform.png"
  },
  {
    id: "layered-wings",
    title: "Layered Wings",
    desc: "Multi-layered panel constructions and light capes that overlap to capture depth.",
    natureLabel: "Shimmering Scales",
    garmentLabel: "Tiered Organza",
    image: "/assets/evolve/layered_transform.png"
  }
];

const fabricBoards = [
  {
    id: "handloomed",
    title: "Handloomed Fabric",
    subtitle: "Slow Weave Craft",
    image: "/assets/evolve/fabric_handloomed.png",
    description: "Handwoven with care, rooted in tradition. Each texture tells a story of human touch and timeless craft. Handloomed fabric is a handspun and handwoven textile, known for its raw and natural look. It has a matte texture with a soft, earthy feel, reflecting its authentic, handcrafted nature.",
    colorTheme: "#d4a373"
  },
  {
    id: "orange-viscose",
    title: "Orange Viscose Fabric",
    subtitle: "Sustainable Innovation",
    image: "/assets/evolve/autumn_leaf.png",
    description: "Born from discarded citrus pulp — Orange Fiber technology transforms waste into wonder. This fabric is made from orange pulp, known as Orange Fiber, a sustainable textile with a silky, satin-like feel. It has a smooth, glossy surface with a butterfly-like shimmer.",
    colorTheme: "#4a4e69"
  },
  {
    id: "corded-tucks",
    title: "Corded Tucks",
    subtitle: "Surface Ornamentation",
    image: "/assets/evolve/artisan_weaving.png",
    description: "Surface ornamentation technique used in our designs. We used the Corded Tuck Technique to represent the texture and structure of a butterfly's wings. The folds and raised lines resemble the natural wing venation, adding depth and movement to our fabric.",
    colorTheme: "#e8efe4"
  }
];

const artisanSlides = [
  {
    id: 1,
    title: "Master Handloom Weaver",
    artisanName: "Ramanand Devangan",
    location: "Champa Cooperatives, Chhattisgarh",
    image: "/assets/evolve/artisan_weaving.png",
    desc: "Weaving raw textured Tussar yarns into luxury silhouette fabrics. Each thread carries generations of knowledge passed down through the Devangan weaving community."
  },
  {
    id: 2,
    title: "Yarn Dyeing Process",
    artisanName: "Savitri Dewangan",
    location: "Natural Dyeing Unit, Jagdalpur",
    image: "/assets/evolve/fabric_handloomed.png",
    desc: "Dyeing warp yarns with organic pigment extraction sourced from native Indian plants. Savitri leads a cooperative of 12 women artisans specializing in chemical-free dyeing."
  },
  {
    id: 3,
    title: "Fabric Finishing & QC",
    artisanName: "Karan Bhandari",
    location: "Himalayan Weaver Hub, Uttarakhand",
    image: "/assets/pristine/capsule_look images/img-6373.jpg",
    desc: "Inspecting weave uniformity and ensuring 100% fair wages. Each fabric passes through 6 quality checkpoints before becoming part of the Evolve collection."
  }
];

const processSteps = [
  { step: "Inspiration", desc: "Eco-systems & Himalayan butterflies" },
  { step: "Design Board", desc: "Translating winged beauty into lines" },
  { step: "Colour & Fabric Board", desc: "Curating Earth-conscious tones & fibres" },
  { step: "Yarn Dyeing", desc: "Organic dyes bound to raw yarns" },
  { step: "Warping", desc: "Setting the layout of loom threads" },
  { step: "Handloom Weaving", desc: "Slow, artisanal crafting of fabrics" },
  { step: "Fabric QC", desc: "Inspecting weave uniformity & durability" },
  { step: "Pattern Making", desc: "Constructing cocoon silhouettes" },
  { step: "Draping", desc: "Sculpting fabric flows on mannequins" },
  { step: "Final Pattern", desc: "Precision markers ready for finish" },
  { step: "Garment Stitching", desc: "Fine tailored seams and closures" },
  { step: "Photoshoot", desc: "Capturing the final organic elegance" }
];

export default function DiscoverEvolvePage() {
  const containerRef = useRef(null);
  const processContainerRef = useRef(null);
  const processScrollRef = useRef(null);
  const [activeArtisan, setActiveArtisan] = useState(0);

  const nextArtisan = useCallback(() => {
    setActiveArtisan((prev) => (prev + 1) % artisanSlides.length);
  }, []);

  const prevArtisan = useCallback(() => {
    setActiveArtisan((prev) => (prev - 1 + artisanSlides.length) % artisanSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextArtisan, 4000);
    return () => clearInterval(timer);
  }, [nextArtisan]);

  useGSAP(() => {
    // Horizontal scroll for Process timeline
    const pinWidth = processScrollRef.current.scrollWidth - window.innerWidth;
    if (pinWidth > 0) {
      gsap.to(processScrollRef.current, {
        x: -pinWidth,
        ease: "none",
        scrollTrigger: {
          trigger: processContainerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${pinWidth}`,
          invalidateOnRefresh: true,
        }
      });
    }

    // Generic fade-up ScrollTrigger animations
    gsap.utils.toArray(".gsap-fade-in-section").forEach((elem) => {
      gsap.fromTo(
        elem,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ background: "#fff", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <Header />

      {/* ── HERO ── */}
      <ButterflyHero>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", padding: "0 24px", position: "relative", zIndex: 12 }}
        >
          <Link
            href="/collections/evolve"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              marginBottom: "32px",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#c4a265"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Back to Evolve
          </Link>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#c4a265", marginBottom: "16px" }}>
            The Story Behind
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(48px, 9vw, 110px)",
              color: "#fff",
              letterSpacing: "0.06em",
              lineHeight: 1,
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              marginBottom: "24px",
            }}
          >
            Discover Evolve
          </h1>
          <div style={{ width: "64px", height: "1px", background: "#c4a265", margin: "0 auto 24px", opacity: 0.8 }} />
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>
            A collection shaped by nature · built for transformation
          </p>
        </motion.div>
      </ButterflyHero>



      {/* ── TILE 2: OUR INSPIRATION PALETTE — LIGHT THEME ── */}
      <section style={{ background: "#fff", padding: "0", overflow: "hidden", position: "relative" }}>

        {/* Section Header */}
        <div className="gsap-fade-in-section" style={{
          padding: "100px 40px 60px",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "40px",
          flexWrap: "wrap",
          borderBottom: "1px solid #e8efe4"
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#997b47", marginBottom: "20px", opacity: 0.9 }}>
              Our Inspiration Palette
            </p>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(44px, 7vw, 88px)",
              color: "#1a2213",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "-0.01em"
            }}>
              Nature&apos;s<br />Palette
            </h2>
          </div>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            lineHeight: 1.8,
            color: "#64748b",
            maxWidth: "420px",
            margin: 0
          }}>
            Three rare Indian butterflies — the Blue Nawab, the Autumn Leaf, and the Albulina — are the living blueprints behind the Evolve collection&apos;s colour, silhouette, and soul.
          </p>
        </div>

        {/* Butterfly Story Rows */}
        {[
          {
            id: "blue-nawab",
            number: "01",
            species: "Blue Nawab",
            subtitle: "Regal Metamorphosis",
            description: "The royal blues and majestic outlines of its wings inspire sharp, clean-cut silhouettes. Mixed with the fiery red nectar of the Ixora flowers, this narrative forms our Regal Blue and Fiery Red core signature.",
            image: "/assets/evolve/blue_nawab.png",
            accent: "#1a4a7a",
            swatches: [{ name: "Regal Blue", hex: "#0b233a" }, { name: "Fiery Red", hex: "#8b1818" }],
            flip: false
          },
          {
            id: "autumn-leaf",
            number: "02",
            species: "Autumn Leaf",
            subtitle: "Organic Camouflage",
            description: "The perfect biological camouflage: wings mimicking rich dry leaves to blend with the forest. Translated into elegant draping capes and flowing jackets finished in a signature Oakleaf Orange.",
            image: "/assets/evolve/autumn_leaf.png",
            accent: "#7c2d12",
            swatches: [{ name: "Oakleaf Orange", hex: "#d9541e" }, { name: "Earthy Bark", hex: "#63390f" }],
            flip: true
          },
          {
            id: "albulina",
            number: "03",
            species: "Albulina",
            subtitle: "High Alpine Ventral",
            description: "Inspired by the metallic details of high-altitude Himalayan species. Reflected in delicate corded tucks representing wing venation, tinted with a glowing ventral Buttercup Yellow.",
            image: "/assets/evolve/albulina.png",
            accent: "#854d0e",
            swatches: [{ name: "Buttercup Yellow", hex: "#e6c200" }, { name: "Meadow Slate", hex: "#4e6570" }],
            flip: false
          }
        ].map((item, i) => (
          <motion.div
            key={item.id}
            className="palette-row gsap-fade-in-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              minHeight: "620px",
              borderTop: "1px solid #e8efe4",
              direction: item.flip ? "rtl" : "ltr"
            }}
          >
            {/* Image Side */}
            <div style={{
              position: "relative",
              overflow: "hidden",
              minHeight: "480px",
              direction: "ltr"
            }}>
              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 1.08 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "absolute", inset: 0 }}
              >
                <Image
                  src={item.image}
                  alt={item.species}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </motion.div>

              {/* Number watermark */}
              <span style={{
                position: "absolute",
                bottom: "24px",
                right: item.flip ? "auto" : "24px",
                left: item.flip ? "24px" : "auto",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "120px",
                lineHeight: 1,
                color: "rgba(26,34,19,0.06)",
                pointerEvents: "none",
                userSelect: "none",
                letterSpacing: "-0.04em"
              }}>
                {item.number}
              </span>
            </div>

            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: item.flip ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                padding: "80px 60px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                direction: "ltr",
                position: "relative",
                background: i % 2 === 0 ? "#f7ece6" : "#fff"
              }}
            >
              {/* Thin accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{
                  width: "48px",
                  height: "2px",
                  background: "#997b47",
                  marginBottom: "32px",
                  transformOrigin: "left center"
                }}
              />

              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "#997b47",
                marginBottom: "20px",
                display: "block"
              }}>
                {item.number} — {item.species}
              </span>

              <h3 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(32px, 3.5vw, 52px)",
                color: "#1a2213",
                marginBottom: "24px",
                lineHeight: 1.1,
                letterSpacing: "-0.01em"
              }}>
                {item.subtitle}
              </h3>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                lineHeight: 1.85,
                color: "#475569",
                maxWidth: "420px",
                marginBottom: "40px"
              }}>
                {item.description}
              </p>

              {/* Colour Swatches */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {item.swatches.map((swatch, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      border: "1px solid #e2d5cc",
                      borderRadius: "100px",
                      padding: "8px 18px 8px 10px",
                      background: "#fff"
                    }}
                  >
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: swatch.hex,
                      border: "1px solid rgba(0,0,0,0.1)",
                      flexShrink: 0
                    }} />
                    <span style={{
                      fontSize: "11px",
                      fontFamily: "var(--font-body)",
                      color: "#475569",
                      letterSpacing: "0.08em",
                      fontWeight: 500
                    }}>
                      {swatch.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Bottom Quote Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            padding: "60px 40px",
            borderTop: "1px solid #e8efe4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "#f7ece6"
          }}
        >
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(16px, 2vw, 22px)",
            color: "#475569",
            maxWidth: "800px",
            lineHeight: 1.6,
            margin: 0
          }}>
            &ldquo;This collection celebrates the interconnectedness of nature and reminds us that conservation is not only about protecting individual species—it is about safeguarding the ecosystems, communities, and futures that depend on them.&rdquo;
          </p>
        </motion.div>

      </section>

      {/* ── TILE 3: WHY THEIR CONSERVATION MATTERS ── */}
      <section style={{ padding: "120px 24px", background: "#fff", borderBottom: "1px solid #e8efe4" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          
          <div className="gsap-fade-in-section" style={{ marginBottom: "64px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#997b47", marginBottom: "16px" }}>
              Environmental Significance
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(32px, 5vw, 52px)", color: "#1a2213", marginBottom: "24px" }}>
              Why Their Conservation Matters
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", lineHeight: 1.8, color: "#475569", maxWidth: "900px", margin: "0 auto" }}>
              Found across India&apos;s forests and fragile Himalayan ecosystems, these butterflies embody the delicate balance between biodiversity and survival. Their decline would signal not only the loss of remarkable species, but also the weakening of the natural systems that support life.
            </p>
          </div>

          {/* 5 Circular SVG Outline Diagrams */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            justifyContent: "center",
            marginBottom: "56px"
          }}>
            {[
              {
                title: "Pollination Service",
                svg: (
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="54" stroke="#997b47" strokeWidth="1.5" />
                    {/* Flower */}
                    <path d="M60 85V65" stroke="#997b47" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="60" cy="58" r="6" fill="#997b47" />
                    <circle cx="50" cy="58" r="5" stroke="#997b47" strokeWidth="1.2" />
                    <circle cx="70" cy="58" r="5" stroke="#997b47" strokeWidth="1.2" />
                    <circle cx="60" cy="48" r="5" stroke="#997b47" strokeWidth="1.2" />
                    {/* Butterfly */}
                    <path d="M72 40C72 32 84 32 84 40C84 48 72 48 72 40Z" fill="none" stroke="#997b47" strokeWidth="1.2" />
                    <path d="M72 40C72 48 60 48 60 40C60 32 72 32 72 40Z" fill="none" stroke="#997b47" strokeWidth="1.2" />
                  </svg>
                )
              },
              {
                title: "Forest Regeneration",
                svg: (
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="54" stroke="#997b47" strokeWidth="1.5" />
                    {/* Tree outline */}
                    <path d="M40 85V75M40 75L32 65H48L40 55L34 55H46L40 45" stroke="#997b47" strokeWidth="1.5" />
                    {/* Sprout */}
                    <path d="M75 85V75M75 75C75 70 85 70 85 70" stroke="#997b47" strokeWidth="1.5" />
                    {/* Flying Butterfly */}
                    <path d="M58 45C58 41 64 41 64 45C64 49 58 49 58 45Z" fill="none" stroke="#997b47" strokeWidth="1.2" />
                  </svg>
                )
              },
              {
                title: "Food Web Stability",
                svg: (
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="54" stroke="#997b47" strokeWidth="1.5" />
                    {/* Circular arrows */}
                    <path d="M60 22C75 22 88 32 92 46" stroke="#997b47" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d="M94 70C90 84 76 94 60 94" stroke="#997b47" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d="M38 78C28 68 28 52 38 42" stroke="#997b47" strokeWidth="1.2" strokeDasharray="3 3" />
                    {/* Tiny nodes */}
                    <circle cx="60" cy="22" r="3" fill="#997b47" />
                    <circle cx="94" cy="58" r="3" fill="#997b47" />
                    <circle cx="34" cy="58" r="3" fill="#997b47" />
                  </svg>
                )
              },
              {
                title: "Climate Changes Detector",
                svg: (
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="54" stroke="#997b47" strokeWidth="1.5" />
                    {/* Sun details */}
                    <circle cx="60" cy="45" r="8" stroke="#997b47" strokeWidth="1.2" />
                    {/* Snowflake lines */}
                    <path d="M40 75L50 65M35 65H45M40 55L50 65" stroke="#997b47" strokeWidth="1.2" />
                    {/* Winds */}
                    <path d="M70 65H85M75 75H90" stroke="#997b47" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )
              },
              {
                title: "Biodiversity Monitoring",
                svg: (
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="54" stroke="#997b47" strokeWidth="1.5" />
                    {/* Magnifying glass */}
                    <circle cx="55" cy="55" r="18" stroke="#997b47" strokeWidth="1.5" />
                    <path d="M68 68L85 85" stroke="#997b47" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Landscape silhouette inside */}
                    <path d="M45 60L50 52L55 60" stroke="#997b47" strokeWidth="1" />
                    <path d="M50 62L58 50L64 62" stroke="#997b47" strokeWidth="1" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  {item.svg}
                </div>
                <h4 style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600, color: "#1a2213", margin: 0, lineHeight: 1.4 }}>
                  {item.title}
                </h4>
              </motion.div>
            ))}
          </div>

          {/* Icon Guidelines specifications as per user sketch warning note */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", borderRadius: "12px", padding: "12px 18px" }}>
              <Info size={14} color="#64748b" />
              <p style={{ fontSize: "11px", color: "#64748b", margin: 0, fontFamily: "var(--font-body)" }}>
                🎯 <strong>Icon Guidelines:</strong> Recommended vector icon dimensions: <strong>160 &times; 160px</strong> stroke outline style (monochrome).
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── TILE 4: NATURE-TO-GARMENT DESIGN TRANSFORMATION (HORIZONTALLY SCROLLABLE CARD ROW) ── */}
      <section style={{ padding: "120px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "80px" }} className="gsap-fade-in-section">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#997b47", marginBottom: "16px" }}>
              Design Language & Form
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(32px, 5vw, 52px)", color: "#1a2213", marginBottom: "20px" }}>
              Our Design Inspiration
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#64748b", maxWidth: "800px", margin: "0 auto" }}>
              Swipe or scroll horizontally from left to right to see the design inspiration sketches.
            </p>
            <div style={{ width: "60px", height: "1px", background: "#c4a265", margin: "24px auto 0" }} />
          </div>

          {/* Horizontally Scrollable Cards Container */}
          <div style={{
            display: "flex",
            gap: "32px",
            overflowX: "auto",
            paddingBottom: "32px",
            scrollBehavior: "smooth",
            scrollbarWidth: "thin",
            WebkitOverflowScrolling: "touch"
          }}>
            {designInspirations.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  background: "#fbf9f6",
                  borderRadius: "24px",
                  padding: "32px",
                  border: "1px solid #f0e6e0",
                  width: "360px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                  height: "440px"
                }}
              >
                {/* Text Title & Description */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", color: "#1a2213", marginBottom: "8px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6, color: "#64748b" }}>
                    {item.desc}
                  </p>
                </div>

                {/* Graphic Image Area displaying the side-by-side design visual */}
                <div style={{
                  height: "220px",
                  position: "relative",
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.04)"
                }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "contain", padding: "12px" }}
                  />
                </div>

                {/* Labeling of components */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--font-body)", color: "#b4a79c", fontWeight: 600 }}>
                  <span>{item.natureLabel.toUpperCase()}</span>
                  <span>{item.garmentLabel.toUpperCase()}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guidelines box for image dimensions and resolution (as per user sketch warning note) */}
          <div className="gsap-fade-in-section" style={{
            background: "#f8fafc",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            padding: "32px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginTop: "40px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <HelpCircle size={18} color="#475569" />
                <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", color: "#1e293b", margin: 0 }}>
                  Garment & Sketch Upload Specs
                </h4>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6, color: "#64748b", margin: 0 }}>
                Please provide design sketches in a square format to match the morphing panels properly. Make sure all images have transparency.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "12px", fontFamily: "var(--font-body)", color: "#475569" }}>
                🎯 <strong>Sketch Dimensions:</strong> 400 &times; 400px (1:1 Ratio) transparent PNGs.
              </div>
              <div style={{ fontSize: "12px", fontFamily: "var(--font-body)", color: "#475569" }}>
                📸 <strong>Garment Resolution:</strong> Min 1500 &times; 1500px, 300 DPI, sRGB color palette.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TILE 5: FABRIC BOARD (UNIFORM 3-COLUMN GRID) ── */}
      <section style={{ padding: "120px 24px", background: "#f8f5f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <div className="gsap-fade-in-section" style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#997b47", marginBottom: "16px" }}>
              Material Innovation
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(32px, 5vw, 52px)", color: "#1a2213" }}>
              Fabric Board
            </h2>
            <div style={{ width: "60px", height: "1px", background: "#c4a265", margin: "20px auto 0" }} />
          </div>

          {/* Symmetrical 3-Card Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
            marginBottom: "64px"
          }}>
            {fabricBoards.map((fabric) => (
              <motion.div
                key={fabric.id}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.04)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  height: "560px"
                }}
              >
                {/* Visual Image Area (Uniform Height) */}
                <div style={{
                  position: "relative",
                  height: "260px",
                  width: "100%",
                  overflow: "hidden",
                  background: fabric.colorTheme
                }}>
                  <Image
                    src={fabric.image}
                    alt={fabric.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)"
                  }} />
                </div>

                {/* Text Detail Area (Uniform Padding) */}
                <div style={{
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  background: "#fff"
                }}>
                  <div>
                    <span style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#997b47", fontWeight: 600, display: "block", marginBottom: "12px" }}>
                      {fabric.subtitle}
                    </span>
                    
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "#1a2213", marginBottom: "16px" }}>
                      {fabric.title}
                    </h3>

                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.8, color: "#475569", margin: 0 }}>
                      {fabric.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guidelines box for image dimensions and resolution (as per user sketch warning note) */}
          <div className="gsap-fade-in-section" style={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid #e8efe4",
            padding: "32px 40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            boxShadow: "0 10px 30px rgba(65,84,47,0.02)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <HelpCircle size={18} color="#41542f" />
                <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", color: "#1a2213", margin: 0 }}>
                  Macro-Texture Upload Guidelines
                </h4>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", lineHeight: 1.6, color: "#64748b", margin: 0 }}>
                Please provide detailed fabric swatch images. Ensure the textures are captured clearly with micro detailing to reflect quality on high-density devices.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
              <div style={{ fontSize: "12px", fontFamily: "var(--font-body)", color: "#475569" }}>
                🎯 <strong>Fabric Dimensions:</strong> 1000 &times; 750px (4:3 Ratio) or 1000 &times; 1000px square.
              </div>
              <div style={{ fontSize: "12px", fontFamily: "var(--font-body)", color: "#475569" }}>
                📸 <strong>Resolution Specs:</strong> Min 300 DPI, lossless raw texture formats.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TILE 7: ARTISAN CRAFTSMANSHIP — SINGLE IMAGE SLIDER ── */}
      <section style={{ padding: "120px 24px", background: "#f7ece6" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          <div className="gsap-fade-in-section" style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#997b47", marginBottom: "16px" }}>
              Our Handloom Legacy
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(32px, 5vw, 52px)", color: "#1a2213", marginBottom: "8px" }}>
              Artisan Craftsmanship
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#64748b", maxWidth: "600px", margin: "0 auto 24px" }}>
              Meet the artisans whose hands bring the Evolve collection to life.
            </p>
            <div style={{ width: "60px", height: "1px", background: "#c4a265", margin: "0 auto" }} />
          </div>

          {/* Single Image Slider */}
          <div style={{
            position: "relative",
            width: "100%",
            borderRadius: "24px",
            overflow: "hidden",
            background: "#fff",
            border: "1px solid #e8efe4",
            boxShadow: "0 20px 50px rgba(65,84,47,0.08)"
          }}>
            {/* Image Container */}
            <div style={{ position: "relative", width: "100%", height: "500px", overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeArtisan}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Image
                    src={artisanSlides[activeArtisan].image}
                    alt={artisanSlides[activeArtisan].artisanName}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,34,19,0.9) 0%, rgba(26,34,19,0.2) 40%, transparent 70%)" }} />
                </motion.div>
              </AnimatePresence>

              {/* Text overlay on image */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px", zIndex: 3 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeArtisan}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <span style={{
                      display: "inline-block",
                      background: "rgba(196,162,101,0.25)",
                      border: "1px solid rgba(196,162,101,0.5)",
                      color: "#c4a265",
                      padding: "8px 20px",
                      borderRadius: "30px",
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      marginBottom: "16px"
                    }}>
                      {artisanSlides[activeArtisan].title}
                    </span>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(28px, 4vw, 36px)", color: "#fff", marginBottom: "6px" }}>
                      {artisanSlides[activeArtisan].artisanName}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
                      {artisanSlides[activeArtisan].location}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", maxWidth: "600px" }}>
                      {artisanSlides[activeArtisan].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Controls bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "#fff" }}>
              {/* Dots */}
              <div style={{ display: "flex", gap: "10px" }}>
                {artisanSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveArtisan(idx)}
                    style={{
                      width: idx === activeArtisan ? "32px" : "10px",
                      height: "10px",
                      borderRadius: "5px",
                      border: "none",
                      background: idx === activeArtisan ? "#41542f" : "#d1d5db",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                  />
                ))}
              </div>

              {/* Counter */}
              <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#94a3b8", letterSpacing: "0.05em" }}>
                {String(activeArtisan + 1).padStart(2, "0")} / {String(artisanSlides.length).padStart(2, "0")}
              </span>

              {/* Arrows */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={prevArtisan}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1F4A3D"; e.currentTarget.style.borderColor = "#1F4A3D"; e.currentTarget.querySelector("svg").style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.querySelector("svg").style.color = "#1a2213"; }}
                >
                  <ChevronLeft size={18} color="#1a2213" />
                </button>
                <button
                  onClick={nextArtisan}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1F4A3D"; e.currentTarget.style.borderColor = "#1F4A3D"; e.currentTarget.querySelector("svg").style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.querySelector("svg").style.color = "#1a2213"; }}
                >
                  <ChevronRight size={18} color="#1a2213" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar below slider */}
          <div style={{ marginTop: "64px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
              {[
                { label: "Handloom Preservation", value: "100%", icon: <Hand size={20} color="#41542f" /> },
                { label: "Fair Wage Premium", value: "100%", icon: <Check size={20} color="#41542f" /> },
                { label: "Timeless Silhouettes", value: "100%", icon: <Sparkles size={20} color="#41542f" /> },
                { label: "Sustainable Garments", value: "100%", icon: <Leaf size={20} color="#41542f" /> }
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #e8efe4" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e8efe4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {stat.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: "22px", color: "#1a2213", margin: 0, lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#64748b", margin: 0 }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL SCROLL: THE PROCESS ── */}
      <section ref={processContainerRef} style={{ background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", justifyEvent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ padding: "80px 24px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#997b47", marginBottom: "12px" }}>
              The Process
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(32px, 5vw, 52px)", color: "#1a2213", marginBottom: "8px" }}>
              Transformation Through Design
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#64748b" }}>
              Scroll down to travel through each stage of the Evolve Collection in chronological order.
            </p>
          </div>
        </div>

        {/* Horizontal Timeline Container */}
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div
            ref={processScrollRef}
            style={{
              display: "flex",
              gap: "48px",
              paddingLeft: "max(24px, calc((100vw - 1200px) / 2))",
              paddingRight: "100px",
              height: "360px",
              alignItems: "center"
            }}
          >
            {processSteps.map((step, i) => {
              const images = [
                "/assets/evolve/blue_nawab.png",
                "/assets/evolve/autumn_leaf.png",
                "/assets/evolve/blue_nawab.png",
                "/assets/evolve/artisan_weaving.png",
                "/assets/evolve/artisan_weaving.png",
                "/assets/evolve/artisan_weaving.png",
                "/assets/evolve/artisan_weaving.png",
                "/assets/evolve/autumn_leaf.png",
                "/assets/evolve/autumn_leaf.png",
                "/assets/evolve/autumn_leaf.png",
                "/assets/evolve/artisan_weaving.png",
                "/assets/evolve/blue_nawab.png"
              ];

              return (
                <div
                  key={i}
                  className="process-step-card"
                  style={{
                    flexShrink: 0,
                    width: "320px",
                    height: "360px",
                    background: "#fdfbfa",
                    border: "1px solid #f0e6e0",
                    borderRadius: "24px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.02)",
                    position: "relative"
                  }}
                >
                  {/* Connecting Line Decoration */}
                  {i < processSteps.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        right: "-48px",
                        top: "50%",
                        width: "48px",
                        height: "2px",
                        background: "dashed #e2d5cc",
                        borderTop: "2px dashed #d9c8bc",
                        zIndex: -1
                      }}
                    />
                  )}

                  {/* Top Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#41542f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}>{i + 1}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-body)", color: "#997b47", letterSpacing: "0.1em", fontWeight: 600 }}>
                      STAGE {i + 1}
                    </span>
                  </div>

                  {/* Centered Large Image Area */}
                  <div style={{
                    height: "160px",
                    position: "relative",
                    width: "100%",
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.03)",
                    marginTop: "12px",
                    marginBottom: "12px"
                  }}>
                    <Image
                      src={images[i]}
                      alt={step.step}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", color: "#1a2213", marginBottom: "4px" }}>
                      {step.step}
                    </h4>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#64748b", lineHeight: 1.4, margin: 0 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "120px 24px", background: "#1F4A3D", textAlign: "center", position: "relative" }}>
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="gsap-fade-in-section"
        >
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(32px, 5vw, 48px)", color: "#fff", marginBottom: "16px" }}>
            The Evolve Collection
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "48px" }}>
            Explore our garments shaped by organic metamorphosis
          </p>
          <div>
            <Link
              href="/collections/evolve#evolve-products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#1F4A3D",
                background: "#fff",
                padding: "18px 44px",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: 600,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Shop Evolve <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
