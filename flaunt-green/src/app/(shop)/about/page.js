import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, Leaf, Globe, Sprout, Droplet, Shield } from "lucide-react";

export const metadata = {
  title: "About Us | Flaunt Green",
  description: "Green Initiative & Sustainability Solutions (GISS) — the story behind Flaunt Green, our team, values, and process.",
};

const features = [
  { icon: Scissors, title: "Handloom Fabric",       desc: "We source only organic, natural fibers from certified sustainable farms. Every material choice is made with the planet's wellbeing in mind." },
  { icon: Leaf,     title: "Biodegradable Fabrics",  desc: "Every purchase supports sustainable livelihoods and contributes to a more equitable and environmentally conscious fashion industry." },
  { icon: Globe,    title: "Global Silhouettes",     desc: "Our designs transcend seasonal trends, focusing on classic silhouettes and versatile pieces that grow more beautiful with time." },
  { icon: Sprout,   title: "Sustainable Trims",      desc: "We thoughtfully select trims that meet eco-friendly standards, reducing waste and supporting long-term sustainability." },
  { icon: Droplet,  title: "Azo Free Dyes",          desc: "Our products use AZO-free dyes to ensure safety for people and the planet while preserving vibrant colors." },
  { icon: Shield,   title: "Khadi Fabric",           desc: "We work directly with skilled craftspeople, ensuring fair wages and helping preserve traditional techniques for future generations." },
];

const team = [
  {
    name: "Siddhi",
    role: "Fashion Designer",
    img: "/assets/img-1534528741775-53994a69daeb.jpg",
    desc: "Designer extraordinaire, meet Siddhi our irrepressible bundle of energy and the sole GenZ member of our team. This dame had the courage to give up on her computer engineering degree course and pursue her true calling of being a fashion designer. Channeling her innate creativity with an eye on the finished product she does not hesitate to chide each member until we meet her exacting high standards!",
  },
  {
    name: "Kushal",
    role: "Fashion Consultant",
    img: "/assets/img-1506794778202-cad84cf45f1d.jpg",
    desc: "Kushal is our in-house style monitor. He has traversed an unlikely path from genetic engineering to fashion design. Yes we know! & appreciate this cerebral bent to our designs. A stickler for precision Kushal insists on being hands on for all our pattern making. The team relies on his impeccable fashion sense to style our garments.",
  },
  {
    name: "Meen",
    role: "Creative Director",
    img: "/assets/img-1507003211169-0a1dd7228f2d.jpg",
    desc: "An inveterate student of fashion, Meen identified his sense of purpose early on - to bring fashion to the world. Easy to spot dressed in his signature style, his hobby is antiquing for vintage fashion. Meen has imbibed the values of Flaunt Green and imbued our designs with a unique aesthetics that are a signature of Flaunt Green — versatility and timelessness.",
  },
  {
    name: "Mugdha",
    role: "Associate GISS",
    img: "/assets/img-1573496359142-b8d87734a5a2.jpg",
    desc: "This girl is our unflappable anchor in the riotous frenzied maelstrom of activity - that's everyday in the life of GISS! A trained environmentalist Mugdha values the creative space that GISS offers. The team values her meticulous planning and foresight. She routinely helps the team circumvent any potential pitfalls.",
  },
  {
    name: "Waffles",
    role: "The Boss",
    img: "/assets/img-1537151608804-ea9d1785730a.jpg",
    desc: "The undisputed king of the entire EVPL castle, Waffles rules his devoted subjects with an iron fist and a benign heart! Waffles has a penchant for yoga poses and cozy naps. He even got us to venture into an unknown territory and extend our core value of sustainability to a petswear line, Dog Togs!",
  },
  {
    name: "The Support",
    role: "Operations Team",
    img: "/assets/img-1556761175-5973dc0f32f7.jpg",
    desc: "These people are the veritable cogs that keep GISS running like a well-oiled machine. Whether its running errands, maintaining registers or keeping the pantry operations green they are always available with a ready smile and a can do attitude!",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── 1. HERO ─────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-end bg-black">
        <Image
          src="/assets/img-1469334031218-e382a71b716b.jpg"
          fill className="object-cover opacity-50" alt="Flaunt Green Hero" priority
        />
        {/* Gradient fade bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="relative z-10 container-site w-full pb-16 md:pb-24">
          {/* Small breadcrumb label */}
          <p className="text-white/50 uppercase tracking-[0.3em] text-xs mb-6 font-medium">
            Our Identity
          </p>
          <h1 className="font-heading font-bold text-white leading-[0.9] mb-8"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", letterSpacing: "-0.03em" }}>
            About<br />
            <em className="font-normal italic">Flaunt Green</em>
          </h1>
          <div className="w-16 h-[2px] bg-white/40" />
        </div>
      </section>

      {/* ── 2. BRAND INTRO ──────────────────────── */}
      <section id="brand-philosophy" className="py-24 md:py-36">
        <div className="container-site">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-12 md:gap-16 items-start">
            {/* Left label */}
            <div className="md:pt-2">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 block mb-4">Who We Are</span>
              <p className="font-heading text-2xl md:text-3xl font-semibold text-black leading-snug">
                Green Initiative &<br />Sustainability Solutions
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-[2px] bg-gray-100 self-stretch" />

            {/* Right content */}
            <div className="space-y-6 text-gray-600 text-base leading-relaxed">
              <p>
                Green Initiative & Sustainability Solutions (GISS), was birthed under the aegis of{" "}
                <strong className="text-black font-semibold">Eco Ventures Pvt. Ltd. (EVPL)</strong> to offer
                sustainable lifestyle solutions outside its core area of expertise.
              </p>
              <p>
                Flaunt Green is the sustainable fashion vertical of GISS. We aim to build Flaunt Green into a{" "}
                <strong className="text-black font-semibold">global sustainable fashion brand</strong> for the
                environmentally conscious customers.
              </p>
              <p>
                Our collections will push the boundaries of artistic excellence to create chic, versatile, and
                in-vogue silhouettes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MATERIALS ────────────────────────── */}
      <section className="bg-[#0a0a0a] py-24 md:py-32">
        <div className="container-site">
          <div className="mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 block mb-4">Our Craft</span>
            <h2 className="font-heading font-bold text-white"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
              Built Different.<br />
              <em className="font-normal italic text-white/60">By Design.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border border-white/10">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group p-8 lg:p-10 hover:bg-white/5 transition-colors duration-300 border-b border-white/10 last:border-b-0 md:border-b-0">
                  <div className="flex items-start gap-5">
                    <div className="mt-1 w-9 h-9 border border-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:border-white/50 transition-colors">
                      <Icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white text-xl mb-2">{f.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors">{f.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. CO-FOUNDER ───────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container-site">
          {/* Label Row */}
          <div className="flex items-center gap-6 mb-16">
            <div className="w-12 h-[2px] bg-black" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">Meet Our Co-Founder</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-100">
            {/* Image */}
            <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[600px] overflow-hidden bg-gray-100">
              <Image
                src="/assets/img-1573497019940-1c28c88b4f3e.jpg"
                fill className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                alt="Manasee Paranjape Ambhaikar"
              />
              {/* Name overlay at bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-heading text-2xl font-semibold">Manasee Paranjape Ambhaikar</p>
                <p className="text-white/60 text-sm mt-1">Co-Founder, GISS</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-10 lg:p-14 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  With a Master's degree in Civil Engineering from the US, and a career in geotechnical and
                  environmental engineering fields, Manasee was convinced of the need for sustainable practices
                  in everyday life.
                </p>
                <p>
                  Sharing this commitment and common vision with her brother,{" "}
                  <strong className="text-black">Aditya Paranjape, Managing Director of EVPL</strong>, she
                  co-founded Green Initiatives & Sustainable Solutions (GISS) to create practical and
                  forward-thinking solutions for practicing a sustainable lifestyle.
                </p>
                <p>
                  Flaunt Green – GISS's sustainable fashion arm, emerged from Manasee's personal mission to
                  offer a fashion quotient in sustainable clothing.
                </p>
              </div>

              {/* Pull Quote */}
              <div className="mt-10 pt-10 border-t border-gray-100">
                <blockquote className="font-heading text-2xl md:text-3xl font-bold text-black leading-snug mb-6"
                            style={{ letterSpacing: "-0.01em" }}>
                  "Sustainable fashion must go beyond fabric choices. True style embraces responsibility without compromise."
                </blockquote>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">— Manasee, Founder of Flaunt Green</p>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 text-sm text-gray-500 leading-relaxed">
                In her day-to-day leadership, Manasee draws on her technical expertise to bring structure, clarity,
                and purpose to GISS. She fosters a culture of open dialogue, collaborative problem-solving, and genuine
                empowerment — ensuring that each voice is heard and every idea has space to grow.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WAFFLES ──────────────────────────── */}
      <section className="bg-gray-50 py-24">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 items-center">
              {/* Round image */}
              <div className="mx-auto md:mx-0 w-44 h-44 rounded-full overflow-hidden border-4 border-black shrink-0">
                <Image
                  src="/assets/img-1537151608804-ea9d1785730a.jpg"
                  width={176} height={176} className="object-cover w-full h-full"
                  alt="Waffles the Beagle"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-heading font-bold text-3xl">Waffles</span>
                  <span className="text-xs bg-black text-white uppercase tracking-widest px-3 py-1 font-bold">Mascot 🐾</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">
                  Her philosophy of sustainability extends to all aspects of life - including her beloved beagle,{" "}
                  <strong className="text-black">Waffles</strong>. Waffles is the official stress buster for the EVPL
                  family and is always available for a friendly chin wag. As the proud mascot of{" "}
                  <strong className="text-black">Dog Togs</strong>, Flaunt Green's sustainable fashion line for our
                  furry friends, each garment is introduced only after it has earned his famously fastidious paw of
                  approval! 🐾
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TEAM ─────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container-site">
          {/* Header */}
          <div className="mb-20">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 block mb-4">The People</span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="font-heading font-bold text-black"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                Our Team
              </h2>
              <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                The Flaunt Green Team comprises talent from diverse backgrounds with a shared commitment to fashion.
                We ensure that our vendors are paid fair wages to promote a culture of eco friendly practices.
              </p>
            </div>
            <div className="w-full h-[1px] bg-gray-100 mt-12" />
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-gray-100">
            {team.map((member, i) => (
              <div key={i} className={`group border-b border-r border-gray-100 ${i % 3 === 2 ? "lg:border-r-0" : ""} ${i >= team.length - (team.length % 3 || 3) ? "border-b-0" : ""}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={member.img} fill
                    className="object-cover object-top grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700"
                    alt={member.name}
                  />
                  {/* Role chip */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-7">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-heading font-bold text-2xl text-black">{member.name}</h3>
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">{member.role}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CORE VALUES ──────────────────────── */}
      <section id="core-values" className="bg-black py-24 md:py-32">
        <div className="container-site">
          <div className="mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 block mb-4">What Drives Us</span>
            <h2 className="font-heading font-bold text-white" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}>
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { num: "01", title: "Sustainability", body: "We aim to bring value to our customers and vendors by promoting and practising sustainability principles in our fabrics, designs, and garment construction processes." },
              { num: "02", title: "Comfort",        body: "We believe that the mainstay of fashion is comfort and that our commitment to providing crisp and functional designs will enhance the wearers' confidence and poise." },
              { num: "03", title: "Creativity",     body: "We aim to create versatile silhouettes by pushing the boundaries of fashion through sustainable fabrics and Indian handloom techniques." },
            ].map((val) => (
              <div key={val.num} className="px-10 py-12 first:pl-0 last:pr-0 group">
                <div className="font-heading font-bold text-6xl text-white/10 mb-6 group-hover:text-white/20 transition-colors">
                  {val.num}
                </div>
                <h3 className="font-heading font-bold text-white text-3xl mb-4">{val.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{val.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. PROCESS ──────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container-site">
          <div className="mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 block mb-4">How We Work</span>
            <h2 className="font-heading font-bold text-black" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}>
              Our Process
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Connector line */}
            <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-[1px] bg-gray-200 z-0" />

            {[
              { step: "01", label: "Sustainable Sourcing", desc: "We carefully source sustainable fabric (natural or man-made) and sustainable trims with relevant certifications." },
              { step: "02", label: "Artisan Craftsmanship", desc: "We partner with skilled artisans who weave our stories through their traditional techniques." },
              { step: "03", label: "Quality Finishing",    desc: "Each and every garment undergoes thorough in-house quality checks to ensure a high quality product for our customers." },
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center md:text-left">
                {/* Number bubble */}
                <div className="w-12 h-12 rounded-full bg-black text-white font-heading font-bold text-lg flex items-center justify-center mb-6 mx-auto md:mx-0">
                  {step.step}
                </div>
                <h3 className="font-heading font-bold text-xl text-black mb-3">{step.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-32 px-6">
        {/* Big ghost text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-heading font-black text-white/[0.03]"
                style={{ fontSize: "clamp(8rem, 25vw, 22rem)", letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
            FLAUNT
          </span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-white/30 block mb-8">Be The Change</span>
          <h2 className="font-heading font-bold text-white mb-6 leading-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.03em" }}>
            Join Our Movement
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Every purchase you make is a vote for a more sustainable and equitable fashion industry.
            Together we can create a positive change... <em className="text-white/70 font-heading">one thread at a time.</em>
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all duration-300"
          >
            Shop Our Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
