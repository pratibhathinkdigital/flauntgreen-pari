import Image from "next/image";
import NewsletterSection from "@/components/sections/NewsletterSection";

export const metadata = {
  title: "Slow Fashion Guide | Flaunt Green",
  description:
    "A Roadmap to Slow Fashion Living: Reimagining Our Relationship with Clothing — six conscious steps from the Flaunt Green team.",
};

const steps = [
  {
    number: "01",
    label: "STEP 1",
    title: "Awareness",
    subtitle: "Begin by Observing Your Current Relationship with Clothing",
    icon: "/assets/Sustainability/slow-fashion-guide/ICONS/AWARENESS.svg",
    intro:
      "Open your wardrobe and ask: What do I actually wear repeatedly? What do I buy and never use? Why did I buy it — need, impulse, or identity?",
    pull: "Slow fashion begins when clothing stops being a reaction and becomes a conscious decision.",
    story: {
      name: "Manasee",
      role: "Co-Founder",
      content: [
        "With her background in geotechnical and environmental engineering from the United States, Manasee's journey into sustainability began through a systems-thinking lens. Trained to understand the relationship between people, resources, and the environment, she viewed sustainability not merely as an environmental challenge, but as a question of how we design and consume.",
        "The turning point came upon her return to India. Having once been a consumer of fast fashion herself, she began to recognize a growing disconnect between modern consumption patterns and the traditionally lived values of everyday India. A culture that once embodied sustainable living — metal tiffin carriers, handloomed and khadi textiles, canvas shopping bags, glass milk bottles, and deeply embedded garment mending traditions — was increasingly moving toward disposable fashion and overconsumption.",
        "What began as a personal reflection soon evolved into a deeper purpose. Sustainability was no longer just a concept; it was the catalyst which founded Flaunt Green.",
        "At the heart of the brand is the belief that responsible fashion should never require a compromise on style. Flaunt Green reimagines India's rich textile heritage through globally relevant silhouettes, creating garments that are versatile yet timeless. By bringing together thoughtfully sourced materials, enduring designs, and conscious craftsmanship, the brand seeks to inspire a more mindful relationship with fashion — one rooted in quality, longevity, and purpose.",
      ],
    },
  },
  {
    number: "02",
    label: "STEP 2",
    title: "Unlearning",
    subtitle: "Shift the Question: From 'What's Trending?' to 'What's Made Right?'",
    icon: "/assets/Sustainability/slow-fashion-guide/ICONS/UNLEARNING.svg",
    intro: null,
    pull:
      "Slow fashion prioritizes natural and breathable fabrics, handloom and artisanal textiles, ethical production, and longevity over volume. Less is the new more — buy better quality less often.",
    story: {
      name: "Siddhi",
      role: "Fashion Designer",
      content: [
        "Siddhi's journey into slow fashion is rooted in a deep process of unlearning and transformation. Coming from direct exposure to the fast fashion industry, she initially worked within systems driven by speed, high-volume output, and rapid trend cycles — where designs were often dictated by deadlines and seasonal demands rather than longevity or purpose.",
        "Her shift began with questioning this pace itself, why fashion needed to be immediate, and whether creativity could exist without urgency. This led her to gradually unlearn speed as a default value in design.",
        "She then began detaching from trend dependence, moving away from designing for what is 'in' toward building her own design language centered on relevance beyond seasons.",
        "The most significant change was rejecting disposable design thinking. Instead of creating for short-term consumption, she now focuses on garments that evolve, endure, and remain meaningful over time.",
        "Her transition marks a clear shift: from designing for volume to designing for longevity, where clothing is built to live beyond trends and time.",
      ],
    },
  },
  {
    number: "03",
    label: "STEP 3",
    title: "Relearning",
    subtitle: '"What is this garment worth?"',
    icon: "/assets/Sustainability/slow-fashion-guide/ICONS/RELEARNING.svg",
    intro:
      "Redefine quality beyond price by valuing craftsmanship, durability, responsible sourcing, and the lasting impact a product creates over time.",
    pull:
      "Slow fashion encourages you to learn fabric types, observe stitching, durability, and finishing, understand cost-per-wear instead of cost-per-item, and to prioritize longevity over transient trends.",
    story: {
      name: "Meen",
      role: "Creative Director",
      content: [
        "Meen approaches clothing as a long-term, evolving relationship rather than a consumable product. His philosophy is rooted in the belief that garments are not meant for short cycles of use, but for extended lifespans shaped by wear, care, and time.",
        "He consistently wears clothing until it naturally reaches the end of its lifecycle, and often beyond — through creative renewal, resisting the idea of premature replacement. Instead of discarding, he actively engages in repairing and mending garments, treating maintenance as an essential part of their existence.",
        "His wardrobe also reflects a strong inclination toward vintage clothing, which he collects and preserves as a continuation of fashion history rather than as seasonal items.",
        "For Meen, value is not defined by novelty but by endurance and emotional continuity. As he puts it — 'A garment is not finished when it fades; it is finished when it can no longer be continued.'",
      ],
    },
  },
  {
    number: "04",
    label: "STEP 4",
    title: "Repair",
    subtitle: '"Nothing is finished too soon"',
    icon: "/assets/Sustainability/slow-fashion-guide/ICONS/REPAIR.svg",
    intro:
      "Slow fashion encourages you to repair what's broken, honour resources and extend their life. Before anything is discarded, ask if it can be mended, restyled, or repurposed?",
    pull:
      "Across India, this was once instinctive. Clothes were stitched, patched, re-dyed, and passed down. This culture of care is not new — it is simply dormant.",
    story: {
      name: "Meen & Kushal",
      role: "Creative Team",
      content: [
        "Meen believes that repair is not about holding on to the past; it is about respecting the journey a garment has already taken. Every stitch, patch, and alteration extends a story that would otherwise be cut short. When we mend our clothes, we are not fixing imperfections but preserving value, memory, and craftsmanship.",
        "Kushal thinks that the most sustainable purchase is often the one you never have to make. Repair allows us to extract the full value from the resources, labour, and skill already invested in a garment. Extending the life of what we own is one of the simplest and most powerful acts of conscious consumption.",
      ],
    },
  },
  {
    number: "05",
    label: "STEP 5",
    title: "Letting Go",
    subtitle: "Building a Wardrobe with Intention",
    icon: "/assets/Sustainability/slow-fashion-guide/ICONS/LETTING GO.svg",
    intro: null,
    pull:
      "Owning fast fashion is not a mistake; discarding it carelessly is. A slow wardrobe is not built by replacing everything at once. It begins by valuing what already exists in your closet and intentionally choosing what to make space for next.",
    story: {
      name: "Kushal",
      role: "Sustainability Lead",
      content: [
        "Kushal views clothing not as isolated choices but as part of an intentional framework of consumption. His philosophy challenges unnecessary accumulation and promotes conscious decision-making in everyday dressing. He strongly advocates for self-made clothing and the use of heritage and handloom fabrics, emphasizing craftsmanship, durability, and cultural continuity.",
        "At the core of Kushal's approach is the belief that clothing should justify its existence through meaningful and repeated use. By embracing minimal, highly intentional shopping, he focuses only on garments that serve a lasting purpose and integrate naturally into everyday life.",
        "\"Clothing earns its value not when it is bought, but when it is repeatedly lived in.\"",
      ],
    },
  },
  {
    number: "06",
    label: "STEP 6",
    title: "Identity Shift",
    subtitle: '"I don\'t consume fashion. I practice it."',
    icon: "/assets/Sustainability/slow-fashion-guide/ICONS/IDENTITY SHIFT.svg",
    intro:
      "Fashion will no longer be something you buy; but a conscious expression of your values, choices, and way of life. Every piece you wear will reflect a commitment to quality, purpose, and mindful consumption.",
    pull:
      "Integrating slow fashion into your lifestyle will encourage you to buy less but better. Repairs become instinctive, not a chore. Clothing becomes an expression that detaches your identity from trend cycles.",
    story: {
      name: "The Team",
      role: "Flaunt Green",
      content: [
        "Manasee has learnt that sustainability is not a checklist of actions; it is a mindset that shapes everyday decisions. The moment we begin questioning how and why we consume, we stop being passive consumers and become active participants in creating a more responsible future.",
        "Meen believes that personal style is not built through constant replacement. It emerges through years of wearing, caring for, and living in garments that become part of your story. Fashion becomes truly meaningful when it reflects a life lived, and no trends are followed.",
        "Siddhi shares that the biggest shift in her journey was realizing that good design should outlast a season. Slow fashion taught her that creativity is not about producing more — it is about creating with intention, responsibility, and respect for the people who will wear it.",
        "Kushal says that a conscious wardrobe is not defined by how much it contains, but by how well every piece serves its purpose. When we buy less, use more, and choose thoughtfully, clothing becomes a reflection of values rather than consumption.",
      ],
    },
  },
];

export default function SlowFashionGuidePage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C2A3A]">
      {/* ── Hero ── */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
        <Image
          src="/assets/Sustainability/slow-fashion-guide/SLOW_FASHION_GUIDE1.jpg"
          alt="Slow Fashion Guide Hero"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-16">
          <h1
            className="text-white text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] uppercase tracking-widest font-bold drop-shadow-lg leading-none mb-6"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            Slow Fashion
            <br />
            Guide
          </h1>
          <p className="text-white/85 text-[16px] sm:text-[18px] md:text-[20px] font-light tracking-wide max-w-2xl leading-relaxed">
            A Roadmap to Slow Fashion Living: Reimagining Our Relationship with Clothing
          </p>
        </div>
      </section>

      {/* ── Introduction ── */}
      <section className="max-w-[760px] mx-auto px-6 py-20 md:py-28 text-center">
        <p
          className="text-[20px] sm:text-[22px] md:text-[26px] text-[#1C2A3A] leading-[1.75] font-bold"
          style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
        >
          Slow fashion is not a trend — it is a recalibration. It is a return to clothing as craft, memory, and responsibility.
        </p>
        <div className="mt-8 h-[1px] w-24 bg-[var(--gold)] mx-auto" />
        <p className="mt-8 text-[16px] sm:text-[17px] text-[#5C6578] leading-[1.85] font-light">
          For those beginning this journey, it is not about discarding everything you own overnight, but about gradually rethinking how you consume, care for, and connect with what you wear. The following is our personal roadmap — not of rules, but of shifts — conscious, analytical, and ultimately empowering.
        </p>
      </section>

      {/* ── Roadmap Diagram ── */}
      <section className="w-full max-w-[1100px] mx-auto px-6 pb-20 md:pb-32">
        <div className="relative w-full">
          <Image
            src="/assets/Sustainability/slow-fashion-guide/ICONS/SLOW FASHION GUIDE MAP.svg"
            alt="Slow Fashion Guide Roadmap Diagram"
            width={1100}
            height={700}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="max-w-[1100px] mx-auto px-6 pb-24 md:pb-40 space-y-0">
        {steps.map((step, i) => (
          <article
            key={step.number}
            className="relative border-t border-[#E5E0D8] py-20 md:py-28 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20 items-start"
          >
            {/* Left column — step label + icon */}
            <div className="flex flex-col items-center md:items-start gap-8 md:sticky md:top-28">
              <div className="flex items-center gap-4">
                <span className="text-[var(--gold)] text-xs tracking-[0.3em] uppercase font-medium">
                  {step.label}
                </span>
                <span className="h-[1px] w-10 bg-[var(--gold)]" />
              </div>
              <div className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] relative">
                <Image
                  src={step.icon}
                  alt={`${step.title} icon`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right column — content */}
            <div className="space-y-8">
              <div>
                <h2
                  className="text-[30px] sm:text-[38px] md:text-[46px] font-bold uppercase tracking-wider text-[#1C2A3A] leading-[1.15] mb-3"
                  style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
                >
                  {step.title}
                </h2>
                <p className="text-[14px] sm:text-[15px] text-[var(--gold)] uppercase tracking-[0.15em] font-medium">
                  {step.subtitle}
                </p>
              </div>

              {step.intro && (
                <p className="text-[17px] sm:text-[18px] text-[#1C2A3A] leading-relaxed font-normal border-l-2 border-[var(--gold)] pl-6">
                  {step.intro}
                </p>
              )}

              <p className="text-[15px] sm:text-[16px] text-[#5C6578] leading-[1.85] font-light italic">
                {step.pull}
              </p>

              {/* Divider */}
              <div className="h-[1px] w-full bg-[#EBE7E0]" />

              {/* Story attribution */}
              <div>
                <div className="mb-6">
                  <span
                    className="text-[20px] sm:text-[22px] text-[#1C2A3A] font-normal"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
                  >
                    {step.story.name}
                  </span>
                  <span className="text-[#A39987] text-[13px] uppercase tracking-widest ml-3">
                    — {step.story.role}
                  </span>
                </div>
                <div className="space-y-5 text-[15px] sm:text-[16px] text-[#4A5568] leading-[1.85] font-light">
                  {step.story.content.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* ── Closing Statement ── */}
      <section className="bg-[#1C2A3A] py-20 md:py-28 px-6 text-center">
        <div className="max-w-[760px] mx-auto">
          <div className="h-[1px] w-16 bg-[var(--gold)] mx-auto mb-10" />
          <p
            className="text-white text-[22px] sm:text-[26px] md:text-[32px] font-light leading-[1.7] italic"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            "Slow fashion is not about owning fewer clothes; it is about building a deeper relationship with what we choose to wear. When awareness becomes habit and habit becomes identity, sustainability stops being an effort and becomes a way of life."
          </p>
          <p className="mt-8 text-[var(--gold)] text-sm uppercase tracking-[0.25em] font-medium">
            — Team Flaunt Green
          </p>
        </div>
      </section>

      {/* ── Feature Image ── */}
      <section className="w-full">
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] overflow-hidden">
          <Image
            src="/assets/Sustainability/slow-fashion-guide/SLOW_FASHION_GUIDE1.jpg"
            alt="Slow Fashion Guide Feature Image"
            fill
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSection />
    </div>
  );
}
