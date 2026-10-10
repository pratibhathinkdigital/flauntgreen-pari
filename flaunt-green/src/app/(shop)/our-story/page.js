import Image from "next/image";
import OurStoryVideoHero from "@/components/sections/OurStoryVideoHero";
import ManaseePhotoLoop from "@/components/sections/ManaseePhotoLoop";
import NewsletterSection from "@/components/sections/NewsletterSection";

export const metadata = {
  title: "Our Story | Flaunt Green",
  description: "Discover the story behind Flaunt Green — a sustainable luxury fashion label born from a commitment to conscious craftsmanship.",
};

export default function OurStoryPage() {
  return (
    <>
      <OurStoryVideoHero />

      

      <section id="our-mission" className="bg-white py-2 px-4 md:px-8 lg:px-12">
        <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-center">
          <div className="w-full max-w-[1200px]">
            <Image
              src="/assets/Our Story/ourmission.png"
              alt="Our Mission"
              width={1400}
              height={642}
              className="w-full h-auto object-contain block"
              priority
            />
          </div>
        </div>
      </section>

      <section id="core-values" className="bg-white pt-20 md:pt-32 pb-12 md:pb-20 px-4 md:px-8 lg:px-12">
        <h2
          className="font-sans font-bold leading-tight mb-12 text-center"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 4.5vw, 56px)",
            color: "#1C2A3A",
          }}
        >
          Core Values
        </h2>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            
            {/* Item 1 */}
            <div className="flex flex-col text-center">
              <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] mx-auto mb-6 flex justify-center items-center">
                <Image
                  src="/assets/Our Story/CONSCIOUS CREATIVITY.png"
                  alt="Conscious Creativity"
                  width={240}
                  height={240}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <h3 
                className="mb-3 font-bold uppercase tracking-wide"
                style={{
                  fontSize: "24px",
                  color: "#1C2A3A",
                  fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                }}
              >
                CONSCIOUS CREATIVITY
              </h3>
              <p 
                className="leading-relaxed"
                style={{
                  fontSize: "16px",
                  color: "#1C2A3A",
                  fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif",
                }}
              >
                As a fashion brand, we primarily seek to offer credible alternatives to conventional fashion. Our silhouettes are thoughtfully created to reflect our design inspirations without compromising on functionality, timelessness, and versatility - in line with sustainability principles.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col text-center">
              <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] mx-auto mb-6 flex justify-center items-center">
                <Image
                  src="/assets/Our Story/ETHICAL PRACTICES.png"
                  alt="Ethical Practices"
                  width={240}
                  height={240}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <h3 
                className="mb-3 font-bold uppercase tracking-wide"
                style={{
                  fontSize: "24px",
                  color: "#1C2A3A",
                  fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                }}
              >
                ETHICAL PRACTICES
              </h3>
              <p 
                className="leading-relaxed"
                style={{
                  fontSize: "16px",
                  color: "#1C2A3A",
                  fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif",
                }}
              >
                We champion fair wages and rural handloom clusters, while working with local units to sustain urban artisan livelihoods. Through these partnerships, we foster social empowerment, preserve traditional craftsmanship, and reinforce the cultural identifiers that define India&apos;s rich textile heritage.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col text-center">
              <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] mx-auto mb-6 flex justify-center items-center">
                <Image
                  src="/assets/Our Story/INTENTIONAL CURIOSITY.png"
                  alt="Intentional Curiosity"
                  width={240}
                  height={240}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <h3 
                className="mb-3 font-bold uppercase tracking-wide"
                style={{
                  fontSize: "24px",
                  color: "#1C2A3A",
                  fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                }}
              >
                INTENTIONAL CURIOSITY
              </h3>
              <p 
                className="leading-relaxed"
                style={{
                  fontSize: "16px",
                  color: "#1C2A3A",
                  fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif",
                }}
              >
                Intentional Curiosity drives us to question, explore and evolve with purpose. We intend to invest in research and innovation to develop novel, practical, and sustainable fashion articles. We also partner with weavers&apos; clusters to contemporarise traditional handloom techniques.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="our-team" className="bg-[#FAF8F5] py-20 md:py-28 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <h2
            className="font-sans font-bold leading-tight text-center mb-16"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              color: "#1C2A3A",
            }}
          >
            Our Team
          </h2>

          <div className="flex flex-col gap-20 md:gap-32">
            {/* Manasee (Image Left) */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <ManaseePhotoLoop
                  caption={
                    <p className="mt-4 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: "#1C2A3A" }}>
                      From Manasee&apos;s Desk
                    </p>
                  }
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", color: "#1C2A3A" }}>
                  Manasee Paranjape Ambhaikar
                </h3>
                <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-6">
                  Co-Founder, Green Initiatives &amp; Sustainable Solutions
                </h4>
                <div className="text-[#1C2A3A] leading-relaxed space-y-4" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif" }}>
                  <p>
                    Manasee holds a Master&apos;s degree in Civil Engineering from the University of Akron, Ohio, and built her career in geotechnical and environmental engineering in Southern California. Her industry experience reinforced her belief that sustainability must become part of everyday choices. Sharing this vision with her brother, she co-founded Green Initiatives &amp; Sustainable Solutions (GISS), under the aegis of EVPL. Flaunt Green, its sustainable fashion arm, was born from her commitment to offer a credible, ethical alternative to fast fashion through refined aesthetics and globally relevant silhouettes.
                  </p>
                  <p className="italic font-medium text-lg border-l-4 border-gray-300 pl-4 my-6">
                    &quot;Sustainable fashion must go beyond fabric choices-it demands a fundamental shift in how we value and consume clothing. True style embraces responsibility without compromise.&quot;
                  </p>
                  <p>
                    Her philosophy extends to her beloved Beagle, Waffles-EVPL&apos;s cherished comfort companion and discerning ambassador for Dog Togs, Flaunt Green&apos;s sustainable line for furry friends. Drawing on her technical background, Manasee leads with clarity and collaboration, fostering open dialogue, thoughtful debate, and a culture where ideas and individuals are empowered to evolve.
                  </p>
                </div>
              </div>
            </div>

            {/* Meen (Image Right) */}
            <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <Image src="/assets/Our Story/meen.jpg" alt="Meeneshwer Madhu (Meen)" width={800} height={1000} className="w-full h-auto max-h-[600px] object-cover" />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", color: "#1C2A3A" }}>
                  Meeneshwer Madhu (Meen)
                </h3>
                <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-6">CREATIVE DIRECTOR, FLAUNT GREEN</h4>
                <p className="text-[#1C2A3A] leading-relaxed text-lg" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif" }}>
                  An inveterate student of fashion, Meen identified his sense of purpose early on - to bring fashion to the world. Easy to spot dressed in his signature style, his hobby is antiquing for vintage fashion. Meen has imbibed the values of Flaunt Green and imbued our designs with a unique aesthetics that are a signature of Flaunt Green - versatility and timelessness. The team trusts him to go the extra mile and find solutions to keep our silhouettes sustainable without compromising on the style quotient.
                </p>
              </div>
            </div>

            {/* Kushal (Image Left) */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <Image src="/assets/Our Story/kushal.PNG" alt="Kushal Pillai" width={800} height={1000} className="w-full h-auto max-h-[600px] object-cover" />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", color: "#1C2A3A" }}>
                  Kushal Pillai
                </h3>
                <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-6">FASHION CONSULTANT, FLAUNT GREEN</h4>
                <p className="text-[#1C2A3A] leading-relaxed text-lg" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif" }}>
                  Kushal is our in-house style monitor. He has traversed an unlikely path from genetic engineering to fashion design. Yes we know! &amp; appreciate this cerebral bent to our designs. A stickler for precision Kushal insists on being hands on for all our pattern making. The team relies on his impeccable fashion sense to style our garments. He is a treasure trove of ideas for our PR team and ensures a cohesive presentation for social media. Needless to say his au courant sense of style often extends to critiquing the team and we love him for it!
                </p>
              </div>
            </div>

            {/* Siddhi (Image Right) */}
            <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <Image src="/assets/Our Story/siddhi.PNG" alt="Siddhi Tambaskar" width={800} height={1000} className="w-full h-auto max-h-[600px] object-cover" />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", color: "#1C2A3A" }}>
                  Siddhi Tambaskar
                </h3>
                <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-6">FASHION DESIGNER, FLAUNT GREEN</h4>
                <p className="text-[#1C2A3A] leading-relaxed text-lg" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif" }}>
                  Designer extraordinaire, meet Siddhi our irrepressible bundle of energy and the sole GenZ member of our team. This dame had the courage to give up on her computer engineering degree course and pursue her true calling of being a fashion designer. Channeling her innate creativity with an eye on the finished product she does not hesitate to chide each member until we meet her exacting high standards!
                </p>
              </div>
            </div>

            {/* Waffles (Image Left) */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <Image src="/assets/Our Story/waffles.png" alt="Waffles" width={800} height={1000} className="w-full h-auto max-h-[600px] object-cover" />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", color: "#1C2A3A" }}>
                  Waffles
                </h3>
                <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-6">THE BOSS, EVPL</h4>
                <p className="text-[#1C2A3A] leading-relaxed text-lg" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif" }}>
                  The undisputed king of the entire EVPL castle, Waffles rules his devoted subjects with an iron fist and a benign heart! Waffles has a penchant for yoga poses and cozy naps. The team is attuned to his every need and fulfills his every whim and command. He even got us to venture into an unknown territory and extend our core value of sustainability to a petswear line, Dog Togs! We hope you will value the completely eco-friendly designs specially curated for him and his furry friends as much as we did making them!
                </p>
              </div>
            </div>

            {/* Aniruddha (Image Right) */}
            <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <Image src="/assets/Our Story/aniruddha.JPG" alt="Aniruddha Kumar Yadav" width={800} height={1000} className="w-full h-auto max-h-[600px] object-cover object-top" />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", color: "#1C2A3A" }}>
                  Aniruddha Kumar Yadav
                </h3>
                <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-6">PATTERN MASTER, FLAUNT GREEN</h4>
                <p className="text-[#1C2A3A] leading-relaxed text-lg" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif" }}>
                  With decades of experience in pattern making and garment construction, Aniruddha brings a masterful understanding of cut, proportion, and form to Flaunt Green. As our Pattern Master, he translates creative ideas into precise, thoughtfully constructed silhouettes, guided by an intuitive understanding of fabric and fit. His craftsmanship and technical expertise have been instrumental in establishing Flaunt Green&apos;s in-house sampling unit, enabling closer collaboration between design and construction and allowing ideas to be explored, refined, and brought to life under one roof.
                </p>
              </div>
            </div>

            {/* Support Team (Image Left) */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <Image src="/assets/Our Story/support.JPG" alt="Support Team" width={800} height={1000} className="w-full h-auto max-h-[600px] object-cover" />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col">
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", color: "#1C2A3A" }}>
                 SUPPORT TEAM,
                </h3>
                <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-6"> GREEN INITIATIVES & SUSTAINABLE SOLUTIONS</h4>
                <p className="text-[#1C2A3A] leading-relaxed text-lg mt-4" style={{ fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, var(--font-sans), system-ui, sans-serif" }}>
                  These people are the veritable cogs that keep GISS running like a well-oiled machine. Whether its running errands, maintaining registers or keeping the pantry operations green they are always available with a ready smile and a can do attitude!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}