"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { productsApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";

const SERIF = "var(--font-heading), 'Cormorant Garamond', serif";
const SANS = "var(--font-body), 'Inter', sans-serif";
const GOLD = "#997b47";

const forces = [
  {
    name: "Empathy",
    tagline: "Feel deeply, live compassionately.",
    desc: "Wrap yourself in compassion that is embedded in each stage. Cultivate a deep respect for people and the planet.",
    icon: "/assets/E.K.A.M/empathysmallicon.jpg",
    bg: "#EFE8F6",
    border: "#DECBEE",
    accent: "#7C5FAA",
  },
  {
    name: "Karma",
    tagline: "Every action creates ripples.",
    desc: "Every thread every choice has a consequence. Our clothing embodies the reality you want to create.",
    icon: "/assets/E.K.A.M/karmasmallicon.jpg",
    bg: "#E3EDFB",
    border: "#C9DDF2",
    accent: "#4A7FB5",
  },
  {
    name: "Ahimsa",
    tagline: "Non-violence in thought and action.",
    desc: "Wear the T-shirts that are crafted with compassion, care and commitment to harm none.",
    icon: "/assets/E.K.A.M/ahimsasmallicon.jpg",
    bg: "#F7EFD6",
    border: "#E8DCB2",
    accent: "#9A8635",
  },
  {
    name: "Moksha",
    tagline: "Liberation through conscious living.",
    desc: "Freedom from fast fashion, finding peace through mindful choices and authentic self expression.",
    icon: "/assets/E.K.A.M/mokshasmallicon.jpg",
    bg: "#FBE1D4",
    border: "#F2CAB5",
    accent: "#CE6E38",
  },
];

const products = [
  { name: "Empathy Tee", category: "Empathy Philosophy", slug: "empathy-tee", image: "/assets/E.K.A.M/EMPATHY_web.jpg", accent: "#7C5FAA" },
  { name: "Karma Tee", category: "Karma Philosophy", slug: "karma-tee", image: "/assets/E.K.A.M/KARMA_web.jpg", accent: "#4A7FB5" },
  { name: "Ahimsa Tee", category: "Ahimsa Philosophy", slug: "ahimsa-tee", image: "/assets/E.K.A.M/AHIMSA_web.jpg", accent: "#9A8635" },
  { name: "Moksha Tee", category: "Moksha Philosophy", slug: "moksha-tee", image: "/assets/E.K.A.M/MOKSHA_web.jpg", accent: "#CE6E38" },
];

const insights = [
  {
    title: "Ancient Philosophy",
    lines: ["Ancient", "Philosophy"],
    image: "/assets/collections/E.K.A.M/ekam_main.png",
    body: "Empathy, Karma, Ahimsa, and Moksha - four pillars of conscious living that have guided humanity for millennia. These aren't just concepts; they're ways of being that transform how we interact with ourselves, others, and the world.",
  },
  {
    title: "Reimagined Through Design",
    lines: ["Reimagined", "Through Design"],
    image: "/assets/E.K.A.M/reimagined_design_web.jpg",
    body: "Our design team translates these profound concepts into visual language - minimalist graphics that speak to the soul, colors that evoke emotion, and typography that honors tradition while embracing modernity.",
  },
  {
    title: "Crafted Sustainably",
    lines: ["Crafted", "Sustainably"],
    image: "/assets/E.K.A.M/crafted_sustainably_web.jpg",
    body: "Every thread tells a story of responsibility. From organic cotton fields to fair-trade workshops, each E.K.A.M piece is created with respect for people and planet - because true philosophy extends to how we make, not just what we make.",
  },
  {
    title: "Worn as Modern Lifestyle",
    lines: ["Worn as", "Modern Lifestyle"],
image: "/assets/E.K.A.M/worn_lifestyle_web_v2.jpg",
    body: "The final transformation: philosophy becomes personal. When you wear E.K.A.M, you're not just making a fashion statement - you're declaring your commitment to conscious living and inviting others to join the conversation.",
  },
];

export default function EkamPage() {
  const [ekamProducts, setEkamProducts] = useState(products.map(p => ({ ...p, price: 1999 })));

  useEffect(() => {
    productsApi.getAll({ collection: "ekam" }).then((res) => {
      if (res.data && res.data.length > 0) {
        const accents = {
          "empathy-tee": "#7C5FAA",
          "karma-tee": "#4A7FB5",
          "ahimsa-tee": "#9A8635",
          "moksha-tee": "#CE6E38",
        };
        const mapped = res.data.map((p) => {
          const imgUrl = getImageUrl(p.primary_image?.image_url || p.images?.[0]?.image_url, "/assets/E.K.A.M/EP_hero.jpg");
          return {
            name: p.name,
            category: p.category?.name || "Philosophy",
            slug: p.slug,
            image: imgUrl,
            accent: accents[p.slug] || "#997b47",
            price: Number(p.price) || 1999,
          };
        });
        setEkamProducts(mapped);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="ekam-page">
      <Header />

      <section
        style={{
          position: "relative",
          width: "100%",
          height: "min(56.25vw, calc(100vh - 110px))",
          minHeight: "360px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/assets/E.K.A.M/EP_hero.jpg"
          alt="E.K.A.M. collection hero"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)" }} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
            }}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              letterSpacing: "0.05em",
            }}
          >
            {"E.K.A.M".split("").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 46, filter: "blur(8px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "clamp(52px, 13vw, 160px)",
                  color: "#F5F1E8",
                  lineHeight: 1,
                  textShadow: "0 6px 44px rgba(0,0,0,0.5)",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "min(240px, 40vw)",
              height: "1px",
              background: "#c4a265",
              margin: "22px 0",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-body), 'Inter', sans-serif",
              fontSize: "clamp(11px, 1.6vw, 14px)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(245,241,232,0.9)",
              fontWeight: 500,
            }}
          >
            The Elements of Conscious Living
          </motion.p>
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "48px",
            zIndex: 3,
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="#"
            style={{
              fontFamily: "var(--font-body), 'Inter', sans-serif",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#F5F1E8",
              background: "#8C7A4E",
              padding: "14px 30px",
              borderRadius: 0,
              textDecoration: "none",
              fontWeight: 500,
              whiteSpace: "nowrap",
              transition: "background 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#7A6A3E"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#8C7A4E"; }}
          >
            Discover E.K.A.M.
          </a>
          <a
            href="#philosophy-collection"
            style={{
              fontFamily: "var(--font-body), 'Inter', sans-serif",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#F5F1E8",
              background: "#8C7A4E",
              padding: "14px 30px",
              borderRadius: 0,
              textDecoration: "none",
              fontWeight: 500,
              whiteSpace: "nowrap",
              transition: "background 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#7A6A3E"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#8C7A4E"; }}
          >
            Explore the Collection
          </a>
        </div>
      </section>

      <style>{`
        .ekam-page .journey { padding: 80px 7vw 100px; overflow: hidden; }
        .ekam-page .journey .timeline { position: relative; max-width: 1200px; margin: auto; }
        .ekam-page .journey .timeline::before { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: #d9d4ca; transform: translateX(-50%); }
        .ekam-page .journey .chapter { position: relative; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 70px 0; }
        .ekam-page .journey .chapter:nth-child(even) { direction: rtl; }
        .ekam-page .journey .chapter:nth-child(even) > * { direction: ltr; }
        .ekam-page .journey .chapter-content { width: min(420px, 85%); position: relative; z-index: 2; }
        .ekam-page .journey .chapter:nth-child(odd) .chapter-content { justify-self: end; margin-right: 105px; }
        .ekam-page .journey .chapter:nth-child(even) .chapter-content { justify-self: start; margin-left: 105px; }
        .ekam-page .journey .chapter-media { width: min(420px, 85%); height: 520px; position: relative; z-index: 2; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.06); border: 8px solid #ffffff; border-radius: 2px; }
        .ekam-page .journey .chapter:nth-child(odd) .chapter-media { justify-self: start; margin-left: 105px; }
        .ekam-page .journey .chapter:nth-child(even) .chapter-media { justify-self: end; margin-right: 105px; }
        .ekam-page .journey .chapter-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
        .ekam-page .journey .chapter:hover .chapter-media img { transform: scale(1.05); }
        .ekam-page .journey .chapter h3 { margin: 0 0 20px; font-family: var(--font-heading), 'Cormorant Garamond', serif; font-size: clamp(35px, 4vw, 58px); line-height: 0.92; font-weight: 500; letter-spacing: -0.025em; color: #171717; }
        .ekam-page .journey .chapter p { margin: 0; max-width: 360px; color: #716d66; font-family: var(--font-body), 'Inter', sans-serif; font-size: 15px; line-height: 1.75; font-weight: 400; }
        .ekam-page .journey .marker { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 46px; height: 46px; border: 1px solid #d9d4ca; border-radius: 50%; background: #fcfaf7; display: grid; place-items: center; z-index: 3; }
        .ekam-page .journey .marker::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #9d8354; }
        @media (max-width: 900px) { .ekam-page .journey .chapter-media { height: 380px; margin-top: 30px; } }
        @media (max-width: 760px) {
          .ekam-page .journey { padding: 60px 6vw 80px; }
          .ekam-page .journey .timeline::before { left: 18px; }
          .ekam-page .journey .chapter, .ekam-page .journey .chapter:nth-child(even) { direction: ltr; display: flex; flex-direction: column; min-height: auto; padding: 60px 0 60px 55px; }
          .ekam-page .journey .chapter:nth-child(even) > * { direction: ltr; }
          .ekam-page .journey .chapter-content, .ekam-page .journey .chapter:nth-child(odd) .chapter-content, .ekam-page .journey .chapter:nth-child(even) .chapter-content, .ekam-page .journey .chapter-media, .ekam-page .journey .chapter:nth-child(odd) .chapter-media, .ekam-page .journey .chapter:nth-child(even) .chapter-media { width: 100%; margin: 0; justify-self: auto; }
          .ekam-page .journey .chapter-media { height: 320px; margin-top: 25px; }
          .ekam-page .journey .marker { left: 18px; width: 38px; height: 38px; }
          .ekam-page .journey .chapter h3 { font-size: 43px; }
        }

        /* ===== E.K.A.M. brand section — hang tag & copy, scoped under .cl- ===== */
        .cl-section{--cl-cream:#f5ede2;--cl-gold:#9c7a45;--cl-ink:#1c1a17;--cl-slate:#505a68;--cl-sage:#dde8d8;--cl-tag:#172a20;--cl-stitch:rgba(211,181,125,.6);box-sizing:border-box;position:relative;overflow:hidden;background:var(--cl-cream);color:var(--cl-ink);padding:clamp(40px,7vw,96px) clamp(20px,5vw,72px);border-bottom:5px solid var(--cl-sage);display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(28px,5vw,80px);align-items:center;font-family:var(--font-cabin),"Cabin","Gill Sans","Gill Sans MT",Calibri,sans-serif;line-height:1.5}
        .cl-section *,.cl-section *::before,.cl-section *::after{box-sizing:border-box}
        .cl-title{font-family:var(--font-heading),"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(2.1rem,4.6vw,3.6rem);line-height:1.14;margin:0 0 1.1rem;color:var(--cl-ink)}
        .cl-title em{display:block;font-style:normal;font-weight:600;color:var(--cl-gold)}
        .cl-lead{margin:0 0 1.8rem;color:var(--cl-slate);font-size:1.05rem;line-height:1.8;max-width:56ch}
        .cl-btn{display:inline-block;padding:.9rem 1.7rem;border:1.5px solid var(--cl-ink);border-radius:3px;background:var(--cl-ink);color:var(--cl-cream);font:500 .95rem/1 var(--font-cabin),"Cabin",sans-serif;letter-spacing:.03em;text-decoration:none;cursor:pointer;transition:background .2s,color .2s}
        .cl-btn:hover{background:transparent;color:var(--cl-ink)}
        .cl-btn:focus-visible{outline:2px solid var(--cl-gold);outline-offset:3px}
        .cl-tagwrap{position:relative;width:min(320px,100%);margin:clamp(56px,7vw,76px) auto 0;transform:rotate(-4deg);filter:drop-shadow(0 14px 16px rgba(60,40,10,.24))}
        .cl-string{position:absolute;left:calc(50% - 10px);top:-74px;width:130px;height:90px;overflow:visible;pointer-events:none}
        .cl-tag{position:relative;min-height:400px;display:grid;place-items:center;padding:64px 34px 40px;color:var(--cl-gold);background-color:var(--cl-tag);background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.035) 0 2px,transparent 2px 5px),repeating-linear-gradient(-45deg,rgba(0,0,0,.14) 0 1px,transparent 1px 4px);clip-path:polygon(18% 0,82% 0,100% 8%,100% 100%,0 100%,0 8%)}
        .cl-tag::before{content:"";position:absolute;inset:12px;border:1.5px dashed var(--cl-stitch);pointer-events:none;clip-path:polygon(18% 0,82% 0,100% 7%,100% 100%,0 100%,0 7%)}
        .cl-hole{position:absolute;top:18px;left:50%;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:var(--cl-cream);box-shadow:inset 0 1px 3px rgba(0,0,0,.35);z-index:2}
        .cl-logo{width:100%;display:grid;place-items:center}
        .cl-logo img,.cl-logo svg{display:block;width:100%;max-width:210px;height:auto}
        @media (max-width:860px){.cl-section{grid-template-columns:1fr}.cl-tagwrap{margin-bottom:.5rem}}
      `}</style>

      <section className="journey" style={{ background: "#FCFAF7" }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto 40px", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: "clamp(36px, 5vw, 54px)",
              color: "#1a1a1a",
              marginBottom: "20px",
              lineHeight: 1.15,
            }}
          >
            The Journey of Consciousness
          </h1>
          <p
            style={{
              fontFamily: SANS,
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#6b7280",
              maxWidth: "720px",
              margin: "0 auto",
            }}
          >
            From ancient philosophy to modern lifestyle, discover how timeless wisdom transforms into wearable consciousness.
          </p>
        </div>

        <div className="timeline">
          {insights.map((insight) => (
            <article className="chapter" key={insight.title}>
              <div className="chapter-content">
                <h3>
                  {insight.lines[0]}
                  <br />
                  {insight.lines[1]}
                </h3>
                <p>{insight.body}</p>
              </div>
              <div className="chapter-media">
                <Image
                  src={insight.image}
                  alt={insight.title}
                  fill
                  sizes="(max-width: 760px) 100vw, 420px"
                />
              </div>
              <div className="marker" />
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: "#ffffff", padding: "104px 24px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto 64px", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "#1a1a1a",
              marginBottom: "18px",
              lineHeight: 1.15,
            }}
          >
            Four Forces. One Conscious Collection.
          </h2>
          <p style={{ fontFamily: SANS, fontSize: "16px", lineHeight: 1.7, color: "#6b7280", maxWidth: "640px", margin: "0 auto" }}>
            Ancient wisdom meets modern consciousness. Each design embodies a fundamental principle for mindful living, crafted with sustainable materials and ethical practices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          {forces.map((force) => (
            <div
              key={force.name}
              className="flex flex-col"
              style={{ background: force.bg, border: `1px solid ${force.border}`, borderRadius: "12px", padding: "34px 30px 38px", minHeight: "350px", textAlign: "left" }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  marginBottom: "20px",
                  borderRadius: "10px",
                  background: "#ffffff",
                  border: `1px solid ${force.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={force.icon}
                  alt={`${force.name} icon`}
                  width={34}
                  height={34}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: "21px", color: force.accent, margin: "0 0 6px" }}>
                {force.name}
              </h3>
              <p style={{ fontFamily: SANS, fontWeight: 500, fontSize: "15px", color: force.accent, opacity: 0.85, margin: "0 0 12px" }}>
                {force.tagline}
              </p>
              <p style={{ fontFamily: SANS, fontSize: "14px", lineHeight: 1.7, color: "#4b5563", margin: 0 }}>
                {force.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#FAF8F4", padding: "110px 24px" }}>
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "64px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 360px", maxWidth: "440px" }}>
            <h2
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: "clamp(32px, 4vw, 44px)",
                color: "#1a1a1a",
                marginBottom: "22px",
                lineHeight: 1.15,
              }}
            >
              Crafted with Consciousness
            </h2>
            <p style={{ fontFamily: SANS, fontSize: "16px", lineHeight: 1.8, color: "#5b6673" }}>
              Every E.K.A.M piece is crafted with ethically sourced organic cotton, azo-free dyes, and eco-thread embroidery. Our commitment goes beyond fashion - it&rsquo;s about creating garments that honor both the wearer and the planet.
            </p>
          </div>
          <div style={{ flex: "1 1 680px", minWidth: "340px" }}>
            <Image
              src="/assets/E.K.A.M/ekam_discover_collection.jpg"
              alt="Crafted with Consciousness"
              width={1360}
              height={680}
              style={{ width: "100%", height: "auto", borderRadius: "12px", display: "block" }}
            />
          </div>
        </div>
        <div style={{ maxWidth: "1240px", margin: "60px auto 0" }}>
          <div style={{ borderTop: "1px solid #e6dccd" }} />
        </div>
      </section>

      <section id="philosophy-collection" style={{ background: "#ffffff", padding: "104px 24px", scrollMarginTop: "110px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto 68px", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: "clamp(32px, 4vw, 48px)",
              color: "#1a1a1a",
              marginBottom: "18px",
              lineHeight: 1.15,
            }}
          >
            The Philosophy Collection
          </h2>
          <p style={{ fontFamily: SANS, fontSize: "16px", lineHeight: 1.7, color: "#6b7280", maxWidth: "600px", margin: "0 auto" }}>
            Limited edition designs around timeless values. Each piece is a statement of conscious living.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          {ekamProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}?path=collections/ekam`}
              className="block group"
            >
              <div>
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "3/4", borderRadius: "16px", background: "#EAF1FA", border: "1px solid rgba(74,127,181,0.12)" }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div style={{ padding: "16px 4px 0" }}>
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: product.accent,
                      fontWeight: 600,
                      margin: "0 0 6px",
                    }}
                  >
                    {product.category}
                  </p>
                  <p style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "20px", color: "#1a1a1a", margin: "0 0 4px" }}>
                    {product.name}
                  </p>
                  <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: "15px", color: GOLD, margin: 0 }}>
                    ₹{Number(product.price).toLocaleString("en-IN")}.00/-
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cl-section" aria-label="Our philosophy">
        <div className="cl-tagwrap">
          <svg className="cl-string" viewBox="0 0 130 90" aria-hidden="true">
            <path d="M10 84 C 4 60, 40 52, 62 44 S 104 22, 118 6" fill="none" stroke="#b89a62" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="10" cy="84" r="6" fill="none" stroke="#b89a62" strokeWidth="2.2" />
          </svg>
          <div className="cl-tag">
            <span className="cl-hole" />
            <div className="cl-logo">
              <Image
                src="/assets/FGLOGONEW.png"
                alt="Flaunt Green"
                width={420}
                height={165}
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="cl-title">
            This is more than a tee.<em>This is conscious living.</em>
          </h2>
          <p className="cl-lead">
            Join a community of conscious individuals who believe that what we wear should reflect who we are and what we stand for. Limited quantities. Unlimited impact.
          </p>
          <Link className="cl-btn" href="/collections/ekam#philosophy-collection">
            Shop the collection
          </Link>
        </div>
      </section>

      <NewsletterSection />

      <Footer />
    </div>
  );
}