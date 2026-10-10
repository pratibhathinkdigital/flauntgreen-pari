"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

const imagePathPrefix = "/assets/pristine/Disover Pristine/";
const imagesVideosPrefix = "/assets/pristine/Disover Pristine/IMAGES_VIDEOS/";

export default function DiscoverPristinePage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      <Header />

      {/* Hero Section - TILE 1.PNG with Pristine geometric logo */}
      <section className="relative w-full" style={{ minHeight: '60vh' }}>
        {/* Background Image */}
        <img
          src={`${imagesVideosPrefix}TILE 1.PNG`}
          alt="Pristine - Hindu Kush Himalayan landscape"
          className="w-full object-cover"
          style={{ maxHeight: '70vh', minHeight: '380px', objectPosition: 'center 40%' }}
        />

        {/* Geometric Logo Overlay - centered on image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center" style={{ width: '320px', height: '320px' }}>

            {/* SVG Triangle + accent lines */}
            <svg
              viewBox="0 0 320 320"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Large outlined triangle */}
              <polygon
                points="160,18 305,290 15,290"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeOpacity="0.85"
              />
              {/* Small filled triangle at top */}
              <polygon
                points="160,10 178,42 142,42"
                fill="white"
                fillOpacity="0.9"
              />
              {/* Copper/terracotta accent — left angled line */}
              <line x1="15" y1="290" x2="100" y2="230" stroke="#b87c5a" strokeWidth="1.8" strokeOpacity="0.9" />
              {/* Copper/terracotta accent — bottom horizontal line segment */}
              <line x1="100" y1="290" x2="200" y2="290" stroke="#b87c5a" strokeWidth="1.8" strokeOpacity="0.9" />
            </svg>

            {/* Cursive "Pristine" text */}
            <span
              className="relative z-10 text-white select-none"
              style={{
                fontFamily: "var(--font-playwrite-au-vic), cursive",
                fontSize: 'clamp(2.8rem, 7vw, 4.5rem)',
                fontWeight: 400,
                letterSpacing: '0.02em',
                textShadow: '0 2px 12px rgba(0,0,0,0.35)',
                lineHeight: 1,
                marginTop: '10px',
              }}
            >
              Pristine
            </span>
          </div>
        </div>
      </section>

      {/* Page 2 Text - below hero on white background */}
      <section className="py-16 px-4 md:px-12 w-full text-center space-y-5">
        <p className="text-base md:text-lg font-light leading-relaxed text-gray-800">
          The pristine Hindu Kush Himalayan (HKH) ranges stretch over 3,500 kilometres, occupy over 4.2 million square kilometres across eight countries, and hold the largest volume of ice outside the polar regions.
        </p>
        <p className="text-base md:text-lg font-light leading-relaxed text-gray-800">
          These natural reserves of freshwater deed 12 river basins, including 10 major transboundary river systems, and sustain 240 million people within its mountains and 1.65 billion on the expansive plains downstream through agriculture.
        </p>
        <p className="text-base md:text-lg font-light leading-relaxed text-gray-800">
          Hosting the world's highest peaks, its altitudes still sustain four global biodiversity hotspots. Within its changing elevations, frozen peaks descend into forests, grasslands, wetlands and river valleys, creating a remarkable concentration of ecological diversity. The diversity is not only ecological - generations of communities have developed distinct cultures, knowledge systems, architecture, agriculture, and clothing in response to the landscapes they inhabit.
        </p>
        <p className="text-base md:text-lg font-light leading-relaxed font-medium text-gray-900 mt-4">
          Glaciers are more than frozen water - they are regulators of climate, guardians of ecosystems, and silent protectors of the communities downstream.
        </p>
      </section>

      {/* Page 3 - ADAPTATION AS A WAY OF LIFE */}
      <section className="w-full bg-white">
        {/* Full-width TILE 2.PNG image */}
        <img
          src={`${imagesVideosPrefix}TILE 2.PNG`}
          alt="Adaptation as a way of life - Himalayan landscape"
          className="w-full object-cover"
          style={{ maxHeight: '45vh', minHeight: '220px', objectPosition: 'center 60%' }}
        />

        {/* Heading + Text below image on white */}
        <div className="py-10 px-4 md:px-12 w-full text-center space-y-4">
          <h2 className="font-sans font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#1C2A3A",
            }}>
            ADAPTATION AS A WAY OF LIFE
          </h2>
          <p className="text-base font-light leading-relaxed text-gray-800">
            Life at extreme altitude demands an intimate understanding of climate, terrain and the optimal use of available resources.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            Here, adaptation is not an abstract idea; it is embedded in everyday living.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            Traditional clothing responds to the environment through layering, insulation, protection and freedom of movement. Forms are shaped not merely by aesthetics but by purpose — conserving warmth, accommodating movement and responding to rapidly changing conditions.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            The same intelligence can be seen in approaches to managing scarce natural resources - like ice stupas, transforming winter water into towering frozen reservoirs, storing it as ice so that it can gradually melt and provide water during the warmer growing season.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800 pt-2">
            It is a landscape where limitation has continually encouraged invention.<br />
            Protection becomes design.<br />
            Scarcity encourages resourcefulness.<br />
            Extreme conditions demand adaptability.
          </p>
        </div>
      </section>

      {/* Page 4 - A LANDSCAPE IN TRANSITION */}
      <section className="w-full bg-white">
        {/* Top image — upper crop of TILE 3.PNG (snowy mountain peaks) */}
        <img
          src={`${imagesVideosPrefix}TILE 3.PNG`}
          alt="A Landscape in Transition - Himalayan peaks"
          className="w-full object-cover"
          style={{ maxHeight: '25vh', minHeight: '180px', objectPosition: 'center top' }}
        />

        {/* Heading + Text sandwiched between image halves */}
        <div className="py-10 px-4 md:px-12 w-full text-center space-y-4">
          <h2 className="font-sans font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#1C2A3A",
            }}>
            A LANDSCAPE IN TRANSITION
          </h2>
          <p className="text-base font-light leading-relaxed text-gray-800">
            Yet the very element that defines the Third Pole — its ice — is increasingly vulnerable.<br />
            The cryosphere, encompassing glaciers, snow and permafrost, is changing rapidly.<br />
            Up to 80% of the current glacier volume could be lost by 2100 on their current trajectories
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            The transformation of this frozen landscape is more than a visual change. It has implications for ecosystems, water systems and the physical, economical, mental, and psychological well-being of the communities whose lives have evolved around the seasonal rhythms of snow and ice.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            The Third Pole therefore exists within a compelling duality: monumental yet fragile, ancient yet changing, seemingly pristine yet profoundly vulnerable.<br />
            It is within these contrasts that the story of Pristine begins.
          </p>
        </div>

        {/* Bottom image — lower crop of TILE 3.PNG (monastery on rocks) */}
        <img
          src={`${imagesVideosPrefix}TILE 3.PNG`}
          alt="A Landscape in Transition - Himalayan monastery"
          className="w-full object-cover"
          style={{ maxHeight: '38vh', minHeight: '180px', objectPosition: 'center bottom' }}
        />
      </section>

      {/* Page 5: TILE 3 - Environmental Threats */}
      <section className="py-24 bg-[#fbfbfb] px-4 md:px-8 text-center">
        <div className="w-full space-y-12">
          <h2 className="font-sans font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#1C2A3A",
            }}>
            Environmental Threats Facing the Third Pole
          </h2>
          <p className="text-lg font-light leading-relaxed w-full px-4 md:px-12">
            The HKH regions is facing existential threat due to drastic climatic changes causing - glaciers to melt, increased temperatures, deforestation and loss of biodiversity, and water scarcity.<br />
            These eventually lead to water shortages, floods, and damage to ecosystems and local communities.
          </p>

          <div className="py-12 w-full grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
            {[
              { src: "1.png", label: "MELTING GLACIERS" },
              { src: "2.png", label: "GLOBAL WARMING" },
              { src: "3.png", label: "BIODIVERSITY LOSS" },
              { src: "4.png", label: "WATER SCARCITY" },
            ].map((icon) => (
              <div key={icon.src} className="flex flex-col items-center">
                <img
                  src={`${imagePathPrefix}discover pristine icons/${icon.src}`}
                  alt={icon.label}
                  className="w-full max-w-[220px] aspect-square object-contain"
                />
                <p className="mt-5 text-base md:text-lg font-medium tracking-wide" style={{ color: "#1C2A3A" }}>
                  {icon.label}
                </p>
              </div>
            ))}
          </div>

          <h3 className="font-sans font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#1C2A3A",
            }}>
            Why Pristine Matters
          </h3>
          <p className="text-lg font-light leading-relaxed w-full text-justify md:text-center px-4 md:px-12">
            The Pristine Collection is our response—quiet yet urgent. Drawing inspiration from the indigenous clothing of the HKH region and its melting glaciers, the collection stands as a witness, refusing to romanticise loss and instead calling for care, accountability, and better choices. Each silhouette, texture, and tone reflects purity under threat, balance disrupted, and natural landscapes asking to be seen, respected, and protected.
          </p>
          <p className="text-lg font-light leading-relaxed w-full text-justify md:text-center px-4 md:px-12">
            In a world driven by excess, Pristine stands for the eternal. In an industry known for exploitation, it stands for responsibility. Crafted through conscious processes and slow fashion principles, this collection is a reminder that what we wear carries consequence - and seeks to highlight the urgent need for long-term solutions to the environmental challenges we face.
          </p>
        </div>
      </section>

      {/* Page 6: TILE 4 - Colour & Fabric Story */}
      <section className="py-24 px-4 md:px-12 text-center w-full bg-white">
        <h2 className="font-sans font-bold leading-tight mb-16"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            color: "#1C2A3A",
          }}>
          Colour & Fabric Story
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/1.png.png`} alt="Marigold Orange" className="w-full h-auto object-cover" />
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/2.png.png`} alt="Khadi Cream" className="w-full h-auto object-cover" />
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/3.png.png`} alt="Mountian Brown" className="w-full h-auto object-cover" />
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/4.png.png`} alt="Glacial White" className="w-full h-auto object-cover" />
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/5.png.png`} alt="Flycatcher Blue" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Page 7: TILE 2 - THE COLLECTION (Images) */}
      <section className="py-24 bg-[#fafafa] px-4 md:px-8 text-center space-y-12">
        <div className="w-full space-y-8 px-4 md:px-12">
          <h2 className="font-sans font-bold leading-tight mb-10"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "#1C2A3A",
            }}>
            THE COLLECTION
          </h2>
          <p className="text-lg font-light leading-relaxed">
            Pristine translates the landscape, ingenuity and functional intelligence of the Third Pole into contemporary workwear.<br />
            Rather than reproducing the mountains literally, the collection interprets their visual language and adaptive principles through form, construction and movement.
          </p>
          <p className="text-lg font-light leading-relaxed">
            Glacial formations inspire sculpted silhouettes and structured volumes.<br />
            Fractured ice emerges through angular cuts, geometric paneling and precise lines.<br />
            Snow-covered expanses inform a restrained and elemental palette.<br />
            Mountain layering is reinterpreted through garments designed to build upon one another.<br />
            Adaptive clothing traditions inspire functionality, protection and ease of movement.
          </p>
          <p className="text-lg font-light leading-relaxed font-medium pt-4">
            These references create a dialogue between structure and fluidity, restraint and expression, protection and freedom.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-4 md:px-12 pt-12">
          <div className="flex flex-col items-center group">
            <div className="w-full shadow-sm relative">
              <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/1.jpg`} alt="Pheran Sleeve Detail" className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
            </div>
            
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-full shadow-sm relative">
              <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/3.jpg`} alt="Receeding Glaciers" className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
            </div>
            
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-full shadow-sm relative">
              <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/2.jpg`} alt="Mountain Triangle-shape" className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
            </div>
            
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-full shadow-sm relative">
              <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/4.jpg`} alt="Ice Stupas" className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* Page 8: Mindful Material Choices */}
      <section className="w-full bg-white">
        {/* Top image — upper crop of TILE 1.PNG (mountain peaks & blue sky) */}
        <img
          src={`${imagesVideosPrefix}TILE 7.PNG`}
          alt="Mindful Material Choices - Himalayan peaks"
          className="w-full object-cover"
          style={{ maxHeight: '40vh', minHeight: '200px', objectPosition: 'center top' }}
        />

        {/* Text on white — left-aligned, full width */}
        <div className="py-10 px-4 md:px-12 w-full space-y-4">
          <p className="text-base font-light leading-relaxed text-gray-800">
            Pristine is grounded in mindful material choices that respect both ecosystems and craft. The collection is crafted using Khadi - handspun and handwoven through India's khadi ecosystem, the fabric supports artisan livelihoods while keeping the process slow, traceable, and rooted in tradition. Ecovero and Modal, a low-impact fiber derived from responsibly sourced wood pulp, are produced with significantly reduced water consumption and emissions compared to conventional viscose.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            Every detail is chosen with the same intention.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            YKK recycled zippers reduce dependence on virgin plastic while maintaining durability and performance.<br />
            Corozo and coconut shell buttons, made from natural agricultural by-products, replace synthetic alternatives and are fully biodegradable. Construction is completed using COATS recycled eco-threads, created from post-consumer waste, ensuring strength without compromise.
          </p>
          <p className="text-base font-light leading-relaxed text-gray-800">
            Together, these choices reflect Pristine's commitment to materials that minimise environmental impact, honour human skill, and extend the life of each garment.<br />
            Sustainability here is not an add-on—it is embedded into the fabric, trims, and systems that bring every piece to life.
          </p>
        </div>

        {/* Bottom image — lower crop of TILE 1.PNG (turquoise river + prayer flags) */}
        <img
          src={`${imagesVideosPrefix}TILE 7.PNG`}
          alt="Mindful Material Choices - Himalayan river and prayer flags"
          className="w-full object-cover"
          style={{ maxHeight: '40vh', minHeight: '200px', objectPosition: 'center bottom' }}
        />
      </section>

      {/* Page 9 */}
      <section className="py-32 flex flex-col items-center justify-center bg-gray-50 border-t border-gray-200">
        <div className="text-5xl md:text-7xl font-light tracking-wide font-serif mb-8 text-[#5a5a5a] opacity-30">
          Pristine
        </div>
        <h2 className="text-xl md:text-2xl tracking-widest uppercase font-medium text-gray-800">PRISTINE STATEMENT PIECE ??</h2>
        <div className="mt-16">
          <Link
            href="/collections/pristine"
            className="rounded-none inline-block text-center text-sm uppercase tracking-[3px] font-semibold px-[40px] py-[18px] bg-[#8C7A4E] text-[#F5F1E8] transition-all duration-[250ms] hover:bg-[#7A6A3E]"
          >
            Back to Pristine
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
