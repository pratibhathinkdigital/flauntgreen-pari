export const metadata = {
  title: "Our Story | Flaunt Green",
  description: "Discover the story behind Flaunt Green — a sustainable luxury fashion label born from a commitment to conscious craftsmanship.",
};

export default function OurStoryPage() {
  return (
    <>
      <section className="relative py-32 bg-midnight text-ivory overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-[12rem] font-heading font-black text-white/5 select-none">FG</div>
          <div className="absolute bottom-10 left-10 text-[8rem] font-heading font-black text-white/5 select-none">&</div>
        </div>
        <div className="container-site relative z-10 text-center max-w-4xl">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-6">Our Story</span>
          <h1 className="font-heading font-bold text-5xl md:text-7xl leading-tight mb-6">
            Luxury fashion that<br />
            <span className="italic font-normal">tells a sustainability story</span>
          </h1>
          <p className="text-ivory/70 text-lg max-w-2xl mx-auto leading-relaxed">
            At Flaunt Green, the environmental challenges shaping our future
            inspire every collection we create.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-4">Brand Introduction</span>
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-text-primary mb-8">
                Sustainably Crafted<br />
                <span className="text-brand-500">Timeless Fashion</span>
              </h2>
            </div>
            <div className="space-y-5 text-text-secondary leading-relaxed">
              <p>
                We cultivate conscious dialogue and elevate awareness through thoughtfully crafted pieces,
                where uncompromised comfort meets refined design and the finest quality fabrics.
              </p>
              <p>
                Born as the sustainable fashion vertical of Green Initiatives & Sustainable Solutions (GISS),
                we offer timeless, versatile, and globally appealing silhouettes using eco-friendly fabrics,
                sustainable trims, and eco-conscious processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-ivory">
        <div className="container-site max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-4">Brand Inspiration</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-text-primary mb-6">
              The Peacock
            </h2>
            <p className="text-text-secondary text-lg max-w-3xl mx-auto">
              India&apos;s national bird serves as the soul of our brand &mdash; a timeless symbol of beauty,
              pride, artistry, and cultural heritage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { trait: "Elegance", desc: "The peacock&apos;s graceful form inspires our commitment to refined, timeless design." },
              { trait: "Individuality", desc: "Just as every feather is unique, each piece we create carries its own distinct character." },
              { trait: "Heritage", desc: "Rooted in Indian craftsmanship, our collections honour centuries of artistic tradition." },
            ].map((item) => (
              <div key={item.trait} className="text-center p-8 border border-brand-100 rounded-2xl bg-white">
                <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-white font-heading font-bold text-xl">{item.trait[0]}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-text-primary mb-3">{item.trait}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-midnight text-ivory">
        <div className="container-site max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-4">Founder&apos;s Note</span>
          </div>
          <blockquote className="text-center">
            <p className="font-heading text-2xl md:text-3xl leading-relaxed mb-8 text-ivory/90">
              &ldquo;Sustainable fashion must go beyond fabric choices &mdash; it demands a fundamental shift
              in how we value and consume clothing. True style embraces responsibility without compromise.&rdquo;
            </p>
            <cite className="not-italic">
              <span className="text-gold font-bold text-lg block">Manasee</span>
              <span className="text-ivory/50 text-sm">Founder, Flaunt Green</span>
            </cite>
          </blockquote>
          <div className="mt-16 pt-12 border-t border-white/10 text-center max-w-2xl mx-auto">
            <p className="text-ivory/70 leading-relaxed">
              Launching Flaunt Green as the sustainable fashion arm of GISS was a personal commitment to
              bridge a critical gap &mdash; offering consistent aesthetics, globally appealing silhouettes, and
              a credible, ethical alternative to fast fashion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-site max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-4">Our Mission</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-text-primary mb-6">
              Design With Purpose
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { value: "Sustainability", desc: "Promoting sustainability principles in our fabrics, designs, and garment construction processes." },
              { value: "Comfort", desc: "Crisp, functional designs that enhance the wearer&apos;s confidence and poise." },
              { value: "Creativity", desc: "Pushing the boundaries of fashion through sustainable fabrics and Indian handloom techniques." },
              { value: "Slow Fashion", desc: "Mindful creation over mass production &mdash; embracing quality and intention in every piece." },
              { value: "Ethical Practices", desc: "Ensuring dignity, fairness, and transparency for every hand that creates our garments." },
              { value: "Inclusivity", desc: "Celebrating individuality across generations, designing for every stage of self-expression." },
            ].map((item) => (
              <div key={item.value} className="p-8 border border-slate-100 rounded-2xl hover:shadow-soft-lg transition-shadow duration-300">
                <h3 className="font-heading font-bold text-lg text-text-primary mb-3">{item.value}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-6 bg-brand-500 text-center">
        <p className="text-white text-sm uppercase tracking-[0.3em] font-medium">
          Sustainably Crafted &middot; Timeless Fashion
        </p>
      </div>
    </>
  );
}
