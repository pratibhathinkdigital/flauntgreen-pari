"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NewsletterSection from "@/components/sections/NewsletterSection";
import { journalApi } from "@/services/api";
import { getImageUrl } from "@/lib/axios";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    journalApi.getAll({ type: "blog" })
      .then((res) => {
        const data = res.data?.data || res.data;
        setBlogs(Array.isArray(data) ? data : []);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#1C2A3A] flex flex-col">
      {/* Hero */}
      <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
        <Image
          src="/assets/journal/Blogs_Tab.JPG"
          alt="Blogs Hero"
          fill
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center pt-16">
          <h1
            className="text-white text-[40px] sm:text-[56px] md:text-[72px] uppercase tracking-widest font-bold drop-shadow-lg"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            Blogs
          </h1>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto w-full px-6 py-20 lg:py-32">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#9C8148] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#5C6578] text-sm">Loading posts…</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#5C6578]">No blog posts yet.</p>
            <p className="text-sm text-[#5C6578] mt-2">Check back soon for new stories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/journal/blogs/${blog.slug}`}
                className="group flex flex-col h-full rounded-2xl border border-[#EBE7E0] bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F5EDE7]">
                  {blog.image_url ? (
                    <Image
                      src={blog.image_url}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F5EDE7]">
                      <span className="text-[#9C8148] text-4xl font-heading">FG</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-6 md:p-7">
                  <span className="text-[var(--gold)] text-[11px] tracking-[0.25em] uppercase font-semibold mb-3">
                    {formatDate(blog.published_at)}
                  </span>
                  <h2
                    className="text-[22px] sm:text-[26px] leading-snug text-[#1C2A3A] mb-4 line-clamp-2 min-h-[60px] sm:min-h-[72px] font-bold group-hover:text-[var(--gold)] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
                  >
                    {blog.title}
                  </h2>
                  <p className="text-[#5C6578] text-[15px] leading-relaxed font-light line-clamp-3 min-h-[70px]">
                    {blog.excerpt}
                  </p>
                  <div className="mt-auto pt-6 inline-flex items-center text-[13px] uppercase tracking-widest text-[#1C2A3A] font-medium group-hover:text-[var(--gold)] transition-colors duration-300">
                    Read Article <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <NewsletterSection />
    </div>
  );
}
