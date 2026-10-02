"use client";

import Image from "next/image";

const instagramPosts = [
  {
    image: "/assets/instagram/instapost1.jpg",
    url: "https://www.instagram.com/p/DXyVUddkdce/",
  },
  {
    image: "/assets/instagram/instapost2.jpg",
    url: "https://www.instagram.com/p/DXgTxhXkaST/",
  },
  {
    image: "/assets/instagram/instapost3.jpg",
    url: "https://www.instagram.com/p/DXOQgVFCgAw/",
  },
  {
    image: "/assets/instagram/instapost4.jpg",
    url: "https://www.instagram.com/p/DWx70OAikTU/",
  },
  {
    image: "/assets/instagram/instapost5.jpg",
    url: "https://www.instagram.com/p/DW23qcECtuu/",
  },
];

export default function InstagramFeed() {
  return (
    <section className="py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-16">
          <h2
            className="font-sans font-bold leading-tight mb-4"
            style={{
              fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 4.5vw, 56px)",
              color: "#1C2A3A",
            }}
          >
            Follow Our Journey
          </h2>
          <p
            className="text-center mb-16"
            style={{
              fontSize: "20px",
              color: "var(--gold)",
              lineHeight: "1.4",
            }}
          >
            Join our growing community of conscious fashion lovers.
          </p>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-6xl mx-auto">
          {instagramPosts.map((post) => (
            <a
              key={post.url}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-ivory block"
            >
              <Image
                src={post.image}
                alt="Instagram post"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/40 transition-all duration-300 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
