"use client";

import Image from "next/image";

const features = [
  {
    id: 1,
    icon: "/assets/dogtogs/PNG/Asset 4.png",
    label: "Breathable\n NaturalFabrics",
  },
  {
    id: 2,
    icon: "/assets/dogtogs/PNG/Asset 3.png",
    label: "Unrestricted \nMovement",
  },
  {
    id: 3,
    icon: "/assets/dogtogs/PNG/Asset 2.png",
    label: "No Synthetic\nFasteners",
  },
  {
    id: 4,
    icon: "/assets/dogtogs/PNG/Asset 1.png",
    label: "Azo-Free\nDyes",
  },
];

export default function DogTogsFeatures() {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        paddingTop: "30px",
        paddingBottom: "30px",
        paddingLeft: "clamp(20px, 6vw, 60px)",
        paddingRight: "clamp(20px, 6vw, 60px)",
      }}
    >
      <div className="dogtogs-features-grid">
        {features.map((f) => (
          <div key={f.id} className="dogtogs-feature-item">
            <div className="dogtogs-feature-icon">
              <Image
                src={f.icon}
                alt={f.label}
                fill
                sizes="80px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="dogtogs-feature-label">{f.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        .dogtogs-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dogtogs-feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .dogtogs-feature-icon {
          position: relative;
          width: 76px;
          height: 76px;
          margin-bottom: 18px;
        }
        .dogtogs-feature-label {
          font-family: 'Gill Sans', 'Gill Sans MT', Calibri, sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: #333333;
          margin: 0;
          max-width: 180px;
          white-space: pre-line;
        }
        @media (max-width: 1023px) {
          .dogtogs-features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px 32px;
          }
        }
        @media (max-width: 639px) {
          .dogtogs-features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 36px 24px;
          }
        }
      `}</style>
    </section>
  );
}
