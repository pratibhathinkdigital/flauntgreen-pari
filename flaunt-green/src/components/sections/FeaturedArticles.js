import { featuredBlogs } from "@/lib/content";

const articles = [
  {
    id: 1,
    image: "/assets/img-1544568100-847a948585b9.jpg",
  },
  {
    id: 2,
    image: "/assets/img-1555680202-c86f0e12f086.jpg",
  },
  {
    id: 3,
    image: "/assets/img-1485968579580-b6d095142e6e.jpg",
  },
];

export default function FeaturedArticles() {
  return (
    <section
      className="py-[80px]"
      style={{ backgroundColor: "#F5E9E4" }}
    >
      <div className="container-site">
        <h2
          className="text-center mb-14 font-sans font-bold leading-tight"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 3.5vw, 44px)",
            color: "#1C2A3A",
          }}
        >
          {featuredBlogs.heading}
        </h2>
        <p
          className="text-center mb-14"
          style={{ fontSize: "16px", color: "#5C584D", lineHeight: "1.6" }}
        >
          Please join us as we document our journey on the path from unlearning to relearning.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[44px] max-w-5xl mx-auto">
          {articles.map((article, i) => (
            <div key={article.id} className="flex flex-col">
              <div className="relative w-full" style={{ aspectRatio: "3 / 2" }}>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${article.image})`,
                    filter: "grayscale(100%)",
                  }}
                />
              </div>
              <p
                className="text-center mt-4 leading-relaxed"
                style={{
                  color: "#1C2A3A",
                  fontSize: "16px",
                }}
              >
                {featuredBlogs.posts[i].excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
