export const metadata = {
  title: "Social Outreach | Journal | Flaunt Green",
  description: "Explore Flaunt Green's community partnerships, sustainable initiatives, and social outreach programs.",
};

export default function SocialOutreachPage() {
  return (
    <div className="bg-white min-h-screen text-[#1C2A3A]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* Tile 1 */}
        <section className="text-center">
          <h1
            className="mb-4 font-bold tracking-wide"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            SOCIAL OUTREACH
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto mb-10 leading-relaxed font-serif">
            From Sustainable Fabric to Social Impact - <br className="hidden md:block" />
            Flaunt Green's Outreach Program in the Bhartapada Zilla Parishad School, Vikramgad Taluka, Palghar District, Maharashtra.
          </p>
          <div className="w-full relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <img
              src="/assets/journal/social%20outreach/1st%20Tile/DSC00324.JPG"
              alt="Social Outreach at Bhartapada Zilla Parishad School"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Tile 2 */}
        <section>
          <h2
            className="text-center mb-10 font-bold"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 40px)" }}
          >
            A Hands-On Approach to Social Responsibility
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Video */}
            <div className="w-full h-full min-h-[300px] relative">
              <video
                src="/assets/journal/social%20outreach/2nd%20Tile/PAGE2VIDEO.mp4"
                className="w-full h-full object-cover rounded-sm shadow-sm"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>

            {/* Middle Text */}
            <div className="text-slate-700 text-sm md:text-[15px] leading-relaxed space-y-4">
              <p>
                At Flaunt Green, we strongly believe in a hands-on approach towards social outreach initiatives. For us, true outreach equals genuine involvement: understanding the lifestyle, requirements, and ambitions of a community to foster authentic long-term relationships that create real value versus actions for momentary spotlight. To ensure that our efforts remain thoughtful, practical, and impactful, we focus on initiatives that align with our philosophy of sustainability, mindful resource usage, and community support.
              </p>
              <p>
                This left us with some premium quality fabric in-house, with which we wanted to create a lasting impact and make a real difference. This led to our current social outreach program which involved repurposing all the leftover fabric into garments for primary school students. In co-ordination with Mr. Niranjan Aher who leads the NGO Alert Citizen Forum, we visited the Zilla Parishad School of Bharatadpada, in Vikramgad Taluka of Palghar district in Maharashtra. These students primarily hail from the Adivasi community that practices Warli art. Our initiative focussed on children from age groups of 9 to 12 years old.
              </p>
              <p>
                We used Modal and Hemp fabrics for their weather adaptability. While Hemp is known for its superior durability, UV protection, hypoallergenic and anti microbial properties; Modal is generally chosen for its exceptional softness, resilient fibers, high breathability, and moisture-wicking properties. This made the garments practical and comfortable for everyday wear.
              </p>
            </div>

            {/* Right Image */}
            <div className="w-full h-full min-h-[300px] relative">
              <img
                src="/assets/journal/social%20outreach/2nd%20Tile/IMG_0806.JPG"
                alt="Hands-On Approach"
                className="w-full h-full object-cover rounded-sm shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Tile 3 */}
        <section className="text-center">
          <h2
            className="mb-6 font-bold"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)" }}
          >
            Creating Meaningful Impact Through Conscious Fashion
          </h2>
          <p className="text-slate-700 text-sm md:text-base max-w-4xl mx-auto mb-12 leading-relaxed">
            At Flaunt Green, fashion transcends design and aesthetics; it serves as a powerful conduit for responsibility, awareness, and meaningful social impact. As a sustainable fashion brand, we believe that authentic sustainability extends far beyond fabrics and production processes. It must also cultivate enduring value for communities, artisans, and the environment alike. Our approach to social outreach is grounded in conscious action, long-term vision, and active participation. Rather than perceiving outreach as a fleeting campaign or a visibility-driven initiative, we regard social responsibility as a deeply personal commitment; one that is capable of fostering lasting and transformative impact.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] md:aspect-[3/2]">
              <img
                src="/assets/journal/social%20outreach/3rd%20Tile/PHOTO-2026-03-18-12-18-21%202.jpg"
                alt="Meaningful Impact 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] md:aspect-[3/2]">
              <img
                src="/assets/journal/social%20outreach/3rd%20Tile/PHOTO-2026-03-18-12-18-22%203.jpg"
                alt="Meaningful Impact 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Tile 4 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2
                className="mb-8 font-bold text-center md:text-left"
                style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)" }}
              >
                Supporting Conscious and Circular Fashion
              </h2>
              <div className="text-slate-700 text-base md:text-lg space-y-6 leading-relaxed">
                <p>
                  The fashion industry generates enormous amounts of textile waste every year. At Flaunt Green, we believe responsible fashion brands must actively look for ways to reduce waste and create circular systems wherever possible.
                </p>
                <p>
                  Our outreach initiative in Bhartapada Zilla Parishad school put this philosophy in practice by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Repurposing premium leftover fabrics to create utility</li>
                  <li>Extending the lifecycle of sustainable materials</li>
                  <li>Combining environmental responsibility with social contribution</li>
                </ul>
                <p>
                  This approach reflects our broader commitment toward slow fashion and ethical production, where every resource is valued thoughtfully and responsibly.
                </p>
              </div>
            </div>

            {/* Right Stacked Images */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[16/9]">
                <img
                  src="/assets/journal/social%20outreach/4th%20Tile/PHOTO-2026-03-18-12-18-21.jpg"
                  alt="Conscious Fashion 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative aspect-[16/9]">
                <img
                  src="/assets/journal/social%20outreach/4th%20Tile/PHOTO-2026-03-18-12-18-22.jpg"
                  alt="Conscious Fashion 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tile 5 */}
        <section className="text-center">
          <h2
            className="text-lg md:text-2xl font-serif max-w-4xl mx-auto mb-12 leading-relaxed text-[#1C2A3A]"
          >
            At Flaunt Green we believe that sustainability should actively benefit people in need, and personally participating in the outreach process, highlighted the profound impact of every small action.
          </h2>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto md:min-h-[400px]">
              <img
                src="/assets/journal/social%20outreach/5th%20Tile/PHOTO-2026-03-18-12-20-47.jpg"
                alt="Community Outreach"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto md:min-h-[400px]">
              <img
                src="/assets/journal/social%20outreach/5th%20Tile/PHOTO-2026-03-18-12-20-47%202.jpg"
                alt="Community Outreach 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Tile 6 */}
        <section className="text-center pb-12">
          <h2
            className="mb-4 font-bold"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "clamp(28px, 3.5vw, 40px)" }}
          >
            Beyond Fashion...
          </h2>
          <p className="text-slate-700 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-serif">
            Flaunt Green continues working toward a future where fashion becomes a force for long-term positive change.
          </p>
          <div className="w-full relative aspect-[16/9] md:aspect-[21/9]">
            {/* Using HEIC might not render in all browsers. Included as requested, but standard practice is to convert to JPG. */}
            <img
              src="/assets/journal/social%20outreach/6th%20Tile/IMG_1537%202.jpg"
              alt="Beyond Fashion Team"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

      </div>
    </div>
  );
}
