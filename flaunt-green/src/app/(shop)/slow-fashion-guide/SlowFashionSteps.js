"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./journey.css";

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
      cta: "Read More",
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
      cta: "Read More",
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
      cta: "Read More",
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
      cta: "Read More",
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
      cta: "Read More",
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
      cta: "Read More",
      content: [
        "Manasee has learnt that sustainability is not a checklist of actions; it is a mindset that shapes everyday decisions. The moment we begin questioning how and why we consume, we stop being passive consumers and become active participants in creating a more responsible future.",
        "Meen believes that personal style is not built through constant replacement. It emerges through years of wearing, caring for, and living in garments that become part of your story. Fashion becomes truly meaningful when it reflects a life lived, and no trends are followed.",
        "Siddhi shares that the biggest shift in her journey was realizing that good design should outlast a season. Slow fashion taught her that creativity is not about producing more — it is about creating with intention, responsibility, and respect for the people who will wear it.",
        "Kushal says that a conscious wardrobe is not defined by how much it contains, but by how well every piece serves its purpose. When we buy less, use more, and choose thoughtfully, clothing becomes a reflection of values rather than consumption.",
      ],
    },
  },
];

function previewOf(text, max = 188) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 90 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export default function SlowFashionSteps() {
  const [open, setOpen] = useState({});

  useEffect(() => {
    const J = document.querySelector('.fg-journey'),svg = J.querySelector('.fg-svg');
    svg.innerHTML = '<path class="base"/><path class="prog"/><circle class="walker" r="9"/>';
    const base = svg.querySelector('.base'),prog = svg.querySelector('.prog'),wk = svg.querySelector('.walker');
    let L = 0,pts = [];
    function build(){
      if(innerWidth<=720)return;
      const j = J.getBoundingClientRect();
      svg.setAttribute('viewBox',`0 0 ${j.width} ${J.offsetHeight}`);
      pts = [...J.querySelectorAll('.fg-badge')].map(b=>{const r = b.getBoundingClientRect();return[r.left-j.left+r.width/2,r.top-j.top+r.height/2]});
      let d = `M${pts[0][0]} ${pts[0][1]-70} L${pts[0][0]} ${pts[0][1]}`;
      for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],m=(a[1]+b[1])/2;d += ` C${a[0]} ${m} ${b[0]} ${m} ${b[0]} ${b[1]}`}
      base.setAttribute('d',d);prog.setAttribute('d',d);L = prog.getTotalLength();
      prog.style.strokeDasharray = L;update();
    }
    function update(){
      if(!L||innerWidth<=720)return;
      const j = J.getBoundingClientRect(),y = innerHeight*.45-j.top,top = pts[0][1]-70,end = pts[pts.length-1][1];
      const f = Math.min(1,Math.max(0,(y-top)/(end-top)));
      prog.style.strokeDashoffset = L*(1-f);
      const p = prog.getPointAtLength(L*f);wk.setAttribute('cx',p.x);wk.setAttribute('cy',p.y);
    }
    addEventListener('scroll',update,{passive:true});addEventListener('resize',build);
    addEventListener('load',build);document.fonts&&document.fonts.ready.then(build);
    new ResizeObserver(build).observe(J);
    J.querySelectorAll('img').forEach(i=>i.addEventListener('load',build));
    build();
  }, []);

  return (
    <div className="fg-journey">
      <svg className="fg-svg" aria-hidden="true" focusable="false" />

      {steps.map((step) => {
        const isOpen = Boolean(open[step.number]);
        const storyId = `fg-story-${step.number}`;
        const quote = step.intro || step.pull;
        const support = step.intro ? step.pull : null;
        return (
          <section key={step.number} className="fg-step" aria-labelledby={`fg-title-${step.number}`}>
            <div className="fg-row">
              <div className="fg-art">
                <div className="fg-badge">
                  <span
                    className="fg-icon"
                    role="img"
                    aria-label={`${step.title} icon`}
                    style={{ "--fg-icon": `url("${step.icon}")` }}
                  />
                </div>
              </div>

              <div className="fg-text">
                <h2 id={`fg-title-${step.number}`}>{step.title}</h2>
                <p className="fg-sub">{step.subtitle}</p>

                <blockquote className="fg-pull">{quote}</blockquote>

                {support && <p className="fg-italic">{support}</p>}

                <div className="fg-card">
                  <span className="fg-avatar" aria-hidden="true">
                    {step.story.name.charAt(0)}
                  </span>

                  <div className="fg-who">
                    <p className="fg-name">{step.story.name}</p>
                    <p className="fg-role">{step.story.role}</p>

                    {!isOpen && <p className="fg-copy">{previewOf(step.story.content[0])}</p>}

                    <button
                      type="button"
                      className="fg-more"
                      aria-expanded={isOpen}
                      aria-controls={storyId}
                      onClick={() =>
                        setOpen((prev) => ({ ...prev, [step.number]: !prev[step.number] }))
                      }
                    >
                      {isOpen ? "Close story" : step.story.cta}
                      <ChevronDown className="fg-chev" size={14} strokeWidth={2} />
                    </button>

                    <div className="fg-full" id={storyId} hidden={!isOpen}>
                      {step.story.content.map((para, idx) => (
                        <p className="fg-copy" key={idx}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
