"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

const imagePathPrefix = "/assets/pristine/Disover Pristine/";

export default function DiscoverPristinePage() {
  return (
    <div className="bg-white text-gray-900 font-sans">
      <Header />

      {/* Page 2 Text */}
      <section className="py-20 px-4 md:px-12 w-full text-center space-y-6 pt-32">
        <h1 className="text-4xl md:text-5xl font-light tracking-wide font-serif mb-10 text-[#5a5a5a]">
          <span className="opacity-50">Pristine</span>
        </h1>
        <p className="text-lg md:text-xl font-light leading-relaxed">
          The pristine Hindu Kush Himalayan (HKH) ranges stretch over 3,500 kilometres, occupy over 4.2 million square kilometres across eight countries, and hold the largest volume of ice outside the polar regions.
        </p>
        <p className="text-lg md:text-xl font-light leading-relaxed">
          These natural reserves of freshwater deed 12 river basins, including 10 major transboundary river systems, and sustain 240 million people within its mountains and 1.65 billion on the expansive plains downstream through agriculture.
        </p>
        <p className="text-lg md:text-xl font-light leading-relaxed">
          Hosting the world’s highest peaks, its altitudes still sustain four global biodiversity hotspots. Within its changing elevations, frozen peaks descend into forests, grasslands, wetlands and river valleys, creating a remarkable concentration of ecological diversity. The diversity is not only ecological - generations of communities have developed distinct cultures, knowledge systems, architecture, agriculture, and clothing in response to the landscapes they inhabit.
        </p>
        <p className="text-lg md:text-xl font-light leading-relaxed font-medium mt-8">
          Glaciers are more than frozen water - they are regulators of climate, guardians of ecosystems, and silent protectors of the communities downstream.
        </p>
      </section>

      {/* Page 3 Text */}
      <section className="py-24 bg-[#f5f5f5] px-4 md:px-8 text-center space-y-6">
        <div className="w-full space-y-8 px-4 md:px-12">
          <h2 className="text-2xl tracking-widest uppercase font-medium mb-10">ADAPTATION AS A WAY OF LIFE</h2>
          <p className="text-lg font-light leading-relaxed">
            Life at extreme altitude demands an intimate understanding of climate, terrain and the optimal use of available resources.
          </p>
          <p className="text-lg font-light leading-relaxed">
            Here, adaptation is not an abstract idea; it is embedded in everyday living.
          </p>
          <p className="text-lg font-light leading-relaxed">
            Traditional clothing responds to the environment through layering, insulation, protection and freedom of movement. Forms are shaped not merely by aesthetics but by purpose — conserving warmth, accommodating movement and responding to rapidly changing conditions.
          </p>
          <p className="text-lg font-light leading-relaxed">
            The same intelligence can be seen in approaches to managing scarce natural resources - like ice stupas, transforming winter water into towering frozen reservoirs, storing it as ice so that it can gradually melt and provide water during the warmer growing season.
          </p>
          <p className="text-lg font-light leading-relaxed pt-6">
            It is a landscape where limitation has continually encouraged invention.<br/>
            Protection becomes design.<br/>
            Scarcity encourages resourcefulness.<br/>
            Extreme conditions demand adaptability.
          </p>
        </div>
      </section>

      {/* Page 4 Text */}
      <section className="py-24 px-4 md:px-12 w-full text-center space-y-8">
        <h2 className="text-2xl tracking-widest uppercase font-medium mb-10">A LANDSCAPE IN TRANSITION</h2>
        <p className="text-lg font-light leading-relaxed">
          Yet the very element that defines the Third Pole — its ice — is increasingly vulnerable.<br/>
          The cryosphere, encompassing glaciers, snow and permafrost, is changing rapidly.<br/>
          Up to 80% of the current glacier volume could be lost by 2100 on their current trajectories
        </p>
        <p className="text-lg font-light leading-relaxed">
          The transformation of this frozen landscape is more than a visual change. It has implications for ecosystems, water systems and the physical, economical, mental, and psychological well-being of the communities whose lives have evolved around the seasonal rhythms of snow and ice.
        </p>
        <p className="text-lg font-light leading-relaxed font-medium pt-4">
          The Third Pole therefore exists within a compelling duality: monumental yet fragile, ancient yet changing, seemingly pristine yet profoundly vulnerable.<br/>
          It is within these contrasts that the story of Pristine begins.
        </p>
      </section>

      {/* Page 5: TILE 3 - Environmental Threats */}
      <section className="py-24 bg-[#fbfbfb] px-4 md:px-8 text-center">
        <div className="w-full space-y-12">
          <h2 className="text-3xl font-medium tracking-wide">Environmental Threats Facing the Third Pole</h2>
          <p className="text-lg font-light leading-relaxed w-full px-4 md:px-12">
            The HKH regions is facing existential threat due to drastic climatic changes causing - glaciers to melt, increased temperatures, deforestation and loss of biodiversity, and water scarcity.<br/>
            These eventually lead to water shortages, floods, and damage to ecosystems and local communities.
          </p>
          
          <div className="py-12 flex justify-center">
            <img 
              src={`${imagePathPrefix}TILE 3 Environmental Threats Facing the Third Pole-20261007T063711Z-1-001/TILE 3 Environmental Threats Facing the Third Pole/Environmental Threats.png`} 
              alt="Environmental Threats" 
              className="max-w-full h-auto w-[90%] md:w-3/4"
            />
          </div>

          <h3 className="text-2xl font-medium tracking-wide pt-8">Why Pristine Matters</h3>
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
        <h2 className="text-3xl font-serif text-[#a68a56] mb-16">Colour & Fabric Story</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/1.png.png`} alt="Marigold Orange" className="w-full h-auto object-cover"/>
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/2.png.png`} alt="Khadi Cream" className="w-full h-auto object-cover"/>
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/3.png.png`} alt="Mountian Brown" className="w-full h-auto object-cover"/>
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/4.png.png`} alt="Glacial White" className="w-full h-auto object-cover"/>
          </div>
          <div className="flex flex-col items-center">
            <img src={`${imagePathPrefix}TILE 4 Colour & Fabric Story-20261007T063723Z-1-001/TILE 4 Colour & Fabric Story/5.png.png`} alt="Flycatcher Blue" className="w-full h-auto object-cover"/>
          </div>
        </div>
      </section>

      {/* Page 7: TILE 2 - THE COLLECTION (Images) */}
      <section className="py-24 bg-[#fafafa] px-4 md:px-8 text-center space-y-12">
        <div className="w-full space-y-8 px-4 md:px-12">
          <h2 className="text-2xl tracking-widest uppercase font-medium mb-10">THE COLLECTION</h2>
          <p className="text-lg font-light leading-relaxed">
            Pristine translates the landscape, ingenuity and functional intelligence of the Third Pole into contemporary workwear.<br/>
            Rather than reproducing the mountains literally, the collection interprets their visual language and adaptive principles through form, construction and movement.
          </p>
          <p className="text-lg font-light leading-relaxed">
            Glacial formations inspire sculpted silhouettes and structured volumes.<br/>
            Fractured ice emerges through angular cuts, geometric paneling and precise lines.<br/>
            Snow-covered expanses inform a restrained and elemental palette.<br/>
            Mountain layering is reinterpreted through garments designed to build upon one another.<br/>
            Adaptive clothing traditions inspire functionality, protection and ease of movement.
          </p>
          <p className="text-lg font-light leading-relaxed font-medium pt-4">
            These references create a dialogue between structure and fluidity, restraint and expression, protection and freedom.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-4 md:px-12 pt-12">
          <div className="flex flex-col items-center group">
            <div className="w-full aspect-[4/5] overflow-hidden shadow-sm relative">
                <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/1.jpg`} alt="Pheran Sleeve Detail" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full bg-[#b59a58] text-white py-4 mt-0 text-sm tracking-wider uppercase font-medium shadow-md">Pheran Sleeve Detail</div>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-full aspect-[4/5] overflow-hidden shadow-sm relative">
                <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/2.jpg`} alt="Mountain Triangle-shape" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full bg-[#b59a58] text-white py-4 mt-0 text-sm tracking-wider uppercase font-medium shadow-md">Mountain Triangle-shape</div>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-full aspect-[4/5] overflow-hidden shadow-sm relative">
                <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/3.jpg`} alt="Receeding Glaciers" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full bg-[#b59a58] text-white py-4 mt-0 text-sm tracking-wider uppercase font-medium shadow-md">Receeding Glaciers</div>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-full aspect-[4/5] overflow-hidden shadow-sm relative">
                <img src={`${imagePathPrefix}TILE 2 Design Inspiration-20261007T063627Z-1-001/TILE 2 Design Inspiration/4.jpg`} alt="Ice Stupas" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="w-full bg-[#b59a58] text-white py-4 mt-0 text-sm tracking-wider uppercase font-medium shadow-md">Ice Stupas</div>
          </div>
        </div>
      </section>

      {/* Page 8: Mindful Material Choices */}
      <section className="py-24 px-4 md:px-12 w-full text-center space-y-8">
        <p className="text-lg font-light leading-relaxed">
          Pristine is grounded in mindful material choices that respect both ecosystems and craft. The collection is crafted using Khadi - handspun and handwoven through India's khadi ecosystem, the fabric supports artisan livelihoods while keeping the process slow, traceable, and rooted in tradition. Ecovero and Modal, a low-impact fiber derived from responsibly sourced wood pulp, are produced with significantly reduced water consumption and emissions compared to conventional viscose.
        </p>
        <p className="text-lg font-light leading-relaxed">
          Every detail is chosen with the same intention.
        </p>
        <p className="text-lg font-light leading-relaxed">
          YKK recycled zippers reduce dependence on virgin plastic while maintaining durability and performance.<br/>
          Corozo and coconut shell buttons, made from natural agricultural by-products, replace synthetic alternatives and are fully biodegradable. Construction is completed using COATS recycled eco-threads, created from post-consumer waste, ensuring strength without compromise.
        </p>
        <p className="text-lg font-light leading-relaxed font-medium pt-6">
          Together, these choices reflect Pristine's commitment to materials that minimise environmental impact, honour human skill, and extend the life of each garment.<br/>
          Sustainability here is not an add-on—it is embedded into the fabric, trims, and systems that bring every piece to life.
        </p>
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
