"use client";

import { useState } from "react";
import Image from "next/image";
import FeaturedArticles from "@/components/sections/FeaturedArticles";
import NewsletterSection from "@/components/sections/NewsletterSection";
import styles from "./page.module.css";

const materials = [
  {
    id: "organic-cotton",
    title: "ORGANIC HANDLOOMED COTTON",
    paragraphs: [
      "Our Organic Handloom Cotton brings together the purity of organically grown cotton and the enduring artistry of handloom weaving. Crafted on manually operated looms by skilled artisans, these fabrics often feature subtle textures and natural variations that lend each garment its own distinctive character.",
      "Unlike conventionally manufactured textiles, handloom weaving requires little to no electricity during the weaving process, helping reduce carbon emissions while celebrating traditional craftsmanship. Choosing handloom fabrics also supports artisan communities, preserves generations of weaving knowledge, discourages excess production while encouraging a more mindful approach to fashion.",
      "By sourcing organic cotton, we support farming practices that avoid the use of synthetic pesticides and fertilizers commonly used in conventional cotton cultivation. These methods can contribute to healthier soil ecosystems and promote more responsible agricultural practices.",
    ],
    image: "/images/organic-cotton.jpg",
    imageAlt: "Organic Handloomed Cotton Loom and Weaving",
  },
  {
    id: "hemp",
    title: "HEMP",
    paragraphs: [
      "Hemp is one of the world's oldest cultivated natural fibers, valued for its durability, breathability, and lower environmental impact compared to many conventional textile crops. Grown with relatively low water requirements and fewer agricultural inputs, hemp offers a thoughtful alternative for more responsible fashion.",
      "Hemp cultivation typically requires less water than conventional cotton farming and can thrive with minimal use of pesticides due to the plant's natural resilience. As one of the strongest natural textile fibers, hemp helps garments maintain their shape and quality over time, extending their usable life and encouraging more conscious consumption.",
      "Lightweight and breathable, hemp fabric promotes airflow and moisture management, making it particularly comfortable in warmer climates while remaining versatile throughout the year. Its unique fiber structure allows the fabric to soften beautifully with wear without compromising durability.",
      "Hemp is also a fast-growing crop that can mature within 3–4 months under suitable conditions. Because of its efficient growth cycle and relatively low resource requirements, hemp is widely regarded as one of the more resource-efficient natural fibers used in textile production. As a plant-based fiber, hemp is biodegradable under appropriate conditions, offering an alternative to synthetic materials that can persist in the environment for decades.",
      <span key="hemp-pawsails">
        For the Pawsails Collection, we use a thoughtfully developed blend of{" "}
        <strong className="font-semibold text-slate-900">55% hemp and 45% organic cotton</strong>, combining the strength and breathability of hemp with the softness and comfort of organic cotton.
      </span>,
    ],
    image: "/images/hemp-fabric.jpg",
    imageAlt: "Sustainable Hemp Plant and Linen Fabric",
  },
  {
    id: "khadi",
    title: "KHADI",
    paragraphs: [
      "Khadi is more than a fabric—it is a symbol of craftsmanship, self-reliance, and mindful living. Traditionally handspun (solar power is increasingly used in some places for spinning) and handwoven, khadi embodies the authenticity of human touch in every thread. The spinning and weaving processes require minimal electricity, making khadi a distinctive example of slow, artisanal textile production. Clean and decentralised solar energy is increasingly being introduced to mechanise spinning wheels and looms. This significantly reduces physical labor, increases daily yarn output, and raises artisans' wages while maintaining eco-friendly practices.",
      "Crafted through a thoughtful and labour-intensive process, khadi reflects a slower approach to fashion that values quality, longevity, and intention over mass production. We choose khadi for its breathable comfort, natural texture, and timeless elegance. Its lightweight structure promotes airflow, making it comfortable across seasons, while its unique character develops from the skilled hands that create it.",
      "Every metre of khadi helps sustain generations of artisans, preserving India's rich cultural heritage and celebrating centuries of textile knowledge. Across the country, weaving communities have cultivated distinctive techniques and traditions shaped by their local history, environment, and way of life. These regional expressions of craftsmanship give khadi its remarkable diversity, transforming each fabric into a reflection of place, heritage, and human skill.",
      "Because it is primarily handmade, khadi can have a lower environmental footprint than many industrially manufactured textiles. Made from natural fibres, khadi is biodegradable under appropriate conditions, offering an alternative to synthetic materials. Its beautifully imperfect weave - often a hallmark of authentic khadi combined with its enduring versatility and understated elegance, makes it a fabric designed to transcend trends and seasons.",
      "In our PRISTINE collection we have offered three different types of Khadi to showcase the versatility of this fabric.",
    ],
    image: "/images/khadi-spinning.jpg",
    imageAlt: "Traditional Khadi Hand Spinning Wheel Charkha",
  },
  {
    id: "ecovero",
    title: "ECOVERO™",
    paragraphs: [
      "ECOVERO™ is a premium viscose fiber derived from certified renewable wood sources and produced using more resource-efficient processes than conventional viscose. Combining exceptional softness, fluid drape, and breathable comfort, it offers the luxurious feel of traditional viscose with a lower environmental footprint.",
      "Naturally lightweight, absorbent, and moisture-managing, ECOVERO™ enhances everyday comfort while maintaining an elegant, fluid silhouette. Its silky texture and graceful movement make it especially suited to timeless garments designed for versatility across seasons.",
      "Certified to have up to 50% lower water impact and carbon emissions than conventional viscose according to standardized lifecycle assessments, ECOVERO™ supports more responsible material choices. Its wood-based cellulose origins provide traceability throughout the supply chain, while its plant-derived composition is biodegradable under appropriate conditions.",
      "At Pristine, we choose ECOVERO™ for its refined aesthetic, exceptional comfort, and thoughtful origins. The result is consciously crafted garments that bring together modern innovation, enduring style, and timeless sophistication.",
    ],
    image: "/images/ecovero-fabric.jpg",
    imageAlt: "ECOVERO Eco Viscose Fiber Fabric",
  },
  {
    id: "modal",
    title: "MODAL",
    paragraphs: [
      "Crafted from sustainably sourced beechwood pulp, Modal is a next-generation cellulosic fibre celebrated for its exceptional softness, breathability, and durability. Its silky texture and fluid drape offer everyday comfort, while its strength helps garments retain their shape and feel wear after wear.",
      "Compared to conventional fibres, Modal is produced using a more resource-efficient process, requiring less land and water than many natural fibre alternatives. The fibre is also highly absorbent, making it naturally comfortable across seasons and ideal for versatile wardrobes.",
      "At Flaunt Green, we choose Modal for its ability to combine luxury, functionality, and responsible sourcing. Derived from renewable beechwood cellulose, this plant-based fibre is exceptionally soft, breathable, and durable, offering a silky-smooth feel and elegant drape that enhances everyday comfort. Its excellent moisture management and long-lasting performance help garments retain their shape, colour, and softness over time. Produced through a more resource-efficient process than conventional rayon, Modal creates garments that feel good on the skin while contributing to a lower environmental impact—making it a versatile choice for conscious, year-round dressing.",
      <span key="modal-lenzing">
        The LENZING™ MODAL trademark is internationally registered by the Austrian company{" "}
        <a
          href="https://www.lenzing.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--gold)] transition-colors"
        >
          Lenzing AG
        </a>{" "}
        and identifies modal fibres produced to Lenzing's quality and sourcing standards. It conforms to proprietary manufacturing processes that enhance fibre strength, softness, and resource efficiency, while ensuring traceability from responsibly managed forests to finished fibre.
      </span>,
      "Our PRISTINE Collection offers Modal choices for everyday workwear comfort.",
    ],
    image: "/images/modal-fabric.jpg",
    imageAlt: "Sustainable Lenzing Modal Fabric",
  },
  {
    id: "viscose-orange",
    title: "VISCOSE ORANGE FABRIC",
    paragraphs: [
      "Orange Viscose reimagines waste as a resource, transforming cellulose extracted from discarded orange peels into a fabric of remarkable softness and elegance. By repurposing agricultural by-products, this innovative material embodies a thoughtful approach to modern textile design.",
      "Lightweight, breathable, and fluid in movement, Orange Viscose is prized for its silky touch and graceful drape. Its refined texture brings effortless comfort while offering the versatility required for everyday wear.",
      "Derived from plant-based cellulose, Orange Viscose belongs to a new generation of materials that combine natural origins with textile innovation. The fabric reflects our commitment to exploring responsible material alternatives without compromising on beauty, comfort, or craftsmanship.",
      "With its luxurious feel, understated sophistication, and innovative origins, Orange Viscose represents a future-facing approach to fashion—where thoughtful design and conscious material choices come together.",
      "In EVOLVE, we have juxtaposed the fluid elegance of Orange Viscose fabric with the structured handwoven fabrics to create a balance of movement, texture, and craftsmanship.",
    ],
    image: "/images/ecovero-fabric.jpg",
    imageAlt: "Orange Viscose Sustainable Fabric",
  },
];

const trimsList = [
  {
    id: "corozo",
    title: "COROZO BUTTONS",
    tagline: "Vegetable Ivory from Tagua Palm Seeds",
    paragraphs: [
      "Thoughtful design extends beyond fabric to every detail of a garment. Our Corozo buttons are crafted from the dense inner seed (endosperm) of the tagua palm fruit, a renewable natural resource harvested without felling the trees themselves. Often referred to as “vegetable ivory,” corozo is prized for its hardness, durability, natural beauty, and refined finish.",
      "Each corozo button possesses a distinctive organic grain and texture, ensuring that no two are exactly alike. This natural variation lends character and authenticity to every garment while reflecting the beauty of nature's craftsmanship.",
      "We choose corozo as a more considered alternative to conventional plastic trims. Naturally dense and durable, it is designed to withstand everyday wear while maintaining its appearance over time. Corozo also absorbs dyes exceptionally well, allowing rich, nuanced colours with lasting depth and vibrancy.",
      "Elegant, enduring, and thoughtfully sourced, corozo buttons embody our commitment to responsible craftsmanship and timeless design. As a plant-based material, corozo is biodegradable under appropriate conditions, offering an alternative to petroleum-derived synthetic trims.",
      "It’s the use of thoughtful trims like corozo buttons in each of our garments that celebrates quality, longevity, and conscious design.",
    ],
  },
  {
    id: "coconut",
    title: "COCONUT BUTTONS",
    tagline: "Repurposed Agricultural By-product",
    paragraphs: [
      "Exploring yet another aspect of sustainability we experimented with coconut buttons - crafted from discarded coconut shells that would otherwise become agricultural waste.",
      "Made from a renewable natural resource, coconut buttons offer a durable and biodegradable alternative to conventional plastic buttons derived from fossil fuels. Each button carries its own unique grain, texture, and tonal variation, celebrating the beauty of natural materials while adding character to every garment.",
      "The use of coconut shell buttons supports a more resource-conscious approach to design by giving new purpose to an existing by-product and reducing reliance on virgin synthetic materials. Lightweight yet durable, they are designed to withstand everyday wear while complementing the timeless aesthetic of thoughtfully crafted clothing.",
      "By choosing coconut buttons, we embrace a philosophy that values natural materials, mindful craftsmanship, and attention to detail—proving that even the smallest components can contribute to a more responsible fashion future.",
    ],
  },
  {
    id: "coats-threads",
    title: "RECYCLED COATS® THREADS",
    tagline: "High-Performance Recycled Sewing Threads",
    paragraphs: [
      "At Flaunt Green, thoughtful design extends beyond fabric to every stitch. That's why we use recycled sewing threads from Coats Group, a global leader in innovative and responsible textile solutions.",
      "Crafted using recycled polyester raw materials, these high-performance threads give new purpose to existing resources while maintaining the strength, durability, and reliability essential for garments designed to last. By incorporating recycled content, they help reduce dependence on virgin materials and support more circular approaches to textile manufacturing.",
      "Though often unseen, sewing threads are integral to the longevity and quality of a garment. We believe that every component matters—from the fabric and trims to the threads that bring each piece together. Choosing recycled threads reflects our commitment to thoughtful craftsmanship, responsible material choices, and attention to detail at every stage of creation.",
      "Because sustainability is not defined by a single material, but by the collective impact of many considered decisions, we strive to ensure that even the smallest elements contribute to a more conscious fashion ecosystem.",
    ],
  },
  {
    id: "ykk-zippers",
    title: "RECYCLED YKK® ZIPPERS",
    tagline: "Globally Recognized Recycled Fasteners",
    paragraphs: [
      "We believe thoughtful design extends to every detail, including the trims and closures that bring a garment to life. That's why we incorporate recycled zippers from YKK®, a globally recognised leader in high-quality fastening solutions.",
      "Made using recycled materials and engineered to the same exacting standards as conventional alternatives, these zippers combine durability, reliability, and performance with a more considered use of resources. By incorporating recycled content, they help reduce dependence on virgin materials while supporting more responsible manufacturing practices.",
      "Often overlooked, zippers play an important role in the longevity and functionality of a garment. We choose components that are designed to endure repeated wear and use, reflecting our commitment to quality craftsmanship and lasting design.",
    ],
  },
];

const SPOOL_ART = (
  <svg
    className={styles.mtSpool}
    viewBox="0 0 120 150"
    width="120"
    height="150"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="14" y="6" width="92" height="16" rx="8" fill="#cbbfa4" />
    <rect x="14" y="128" width="92" height="16" rx="8" fill="#cbbfa4" />
    <rect x="28" y="22" width="64" height="106" fill="#b8965a" />
    {[32, 42, 52, 62, 72, 82, 92, 102, 112, 122].map((y) => (
      <line key={y} x1="28" y1={y} x2="92" y2={y} stroke="rgba(0,0,0,0.16)" strokeWidth="1" />
    ))}
  </svg>
);

const trimArt = {
  corozo: <div className={styles.mtButton} aria-hidden="true" />,
  coconut: <div className={`${styles.mtButton} ${styles.mtButtonCoconut}`} aria-hidden="true" />,
  "coats-threads": SPOOL_ART,
  "ykk-zippers": (
    <div className={styles.mtZip} aria-hidden="true">
      <span className={styles.mtZipSlider} />
    </div>
  ),
};

const TINT_SECTIONS = ["hemp", "ecovero"];
const BLUSH_SECTIONS = ["viscose-orange"];

export default function OurMaterialsPage() {
  const [activeTrimId, setActiveTrimId] = useState("corozo");

  const activeTrim = trimsList.find((t) => t.id === activeTrimId) || trimsList[0];

  return (
    <div className={styles.mtPage}>
      {/* Hero Section */}
      <section className={styles.mtHero}>
        <Image
          src="/images/our-materials-hero.jpg"
          alt="Our Materials - Handloom Cotton Threads"
          fill
          priority
          sizes="100vw"
          className={styles.mtHeroImage}
        />
        <div className={styles.mtHeroOverlay} />
        <div className={styles.mtHeroContent}>
          <h1 className={styles.mtHeroTitle}>OUR MATERIALS</h1>
          <p className={styles.mtHeroSub}>Rooted in nature, crafted with responsibility, and woven with intention.</p>
        </div>
      </section>

      {/* Main Materials Sections */}
      {materials.map((mat) => {
        const isReverse = TINT_SECTIONS.includes(mat.id) || BLUSH_SECTIONS.includes(mat.id);
        const isTint = TINT_SECTIONS.includes(mat.id);
        const isBlush = BLUSH_SECTIONS.includes(mat.id);
        const hasNote = mat.id !== "organic-cotton";
        const showRatio = mat.id === "hemp";

        const lead = mat.paragraphs[0];
        const body = hasNote ? mat.paragraphs.slice(1, -1) : mat.paragraphs.slice(1);
        const notePara = hasNote ? mat.paragraphs[mat.paragraphs.length - 1] : null;

        const sectionClass = [
          styles.mtSec,
          isTint ? styles.mtTint : "",
          isBlush ? styles.mtBlush : "",
          isReverse ? styles.mtRev : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <section key={mat.id} className={sectionClass} id={mat.id} aria-labelledby={`${mat.id}-t`}>
            <div className={styles.mtWrap}>
              <figure className={styles.mtFig}>
                <div className={styles.mtFrame}>
                  <div className={styles.mtImgBox}>
                    <Image
                      src={mat.image}
                      alt={mat.imageAlt}
                      fill
                      sizes="(min-width: 861px) 50vw, 100vw"
                    />
                  </div>
                </div>
              </figure>

              <div className={styles.mtTextCol}>
                <h2 className={styles.mtTitle} id={`${mat.id}-t`}>
                  {mat.title}
                </h2>
                <p className={styles.mtLead}>{lead}</p>
                <div className={styles.mtBody}>
                  {body.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
                {hasNote && (
                  <aside className={styles.mtNote}>
                    <p>{notePara}</p>
                    {showRatio && (
                      <div className={styles.mtRatio} aria-hidden="true">
                        <span className={styles.r1} style={{ width: "55%" }}>Hemp 55%</span>
                        <span className={styles.r2} style={{ width: "45%" }}>Organic cotton 45%</span>
                      </div>
                    )}
                  </aside>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Sustainable Trims Interactive Section */}
      <section className={styles.mtTrims}>
        <h2 className={styles.mtTrimTitle}>SUSTAINABLE TRIMS</h2>
        <p className={styles.mtTrimIntro}>
          Our belief in sustainability goes beyond sourcing eco-conscious fabrics. It extends to all the trims used in a garment as well.
        </p>

        <blockquote className={styles.mtQuote}>
          "From fabrics and trims to the finishing details, every element is selected with intention. By choosing thoughtfully sourced zippers, we take another step towards creating garments that embody durability, conscious design, and a more resource-aware approach to fashion."
        </blockquote>

        {/* Interactive Navigation Tabs */}
        <div className={styles.mtTabs} role="tablist" aria-label="Sustainable trims">
          {trimsList.map((trim) => {
            const isActive = trim.id === activeTrimId;
            return (
              <button
                key={trim.id}
                role="tab"
                id={`trim-tab-${trim.id}`}
                aria-selected={isActive}
                aria-controls="trim-panel"
                className={`${styles.mtTab} ${isActive ? styles.mtTabActive : ""}`}
                onClick={() => setActiveTrimId(trim.id)}
              >
                {trim.title}
              </button>
            );
          })}
        </div>

        {/* Display Card for Active Trim */}
        <div className={styles.mtPanel} role="tabpanel" id="trim-panel" aria-labelledby={`trim-tab-${activeTrim.id}`}>
          <div className={styles.mtArt}>{trimArt[activeTrim.id]}</div>
          <div className={styles.mtPanelContent}>
            <span className={styles.mtTag}>{activeTrim.tagline}</span>
            <h3 className={styles.mtTrimTitleSmall}>{activeTrim.title}</h3>
            <p className={styles.mtLead}>{activeTrim.paragraphs[0]}</p>
            <div className={styles.mtBody}>
              {activeTrim.paragraphs.slice(1).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <FeaturedArticles />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}