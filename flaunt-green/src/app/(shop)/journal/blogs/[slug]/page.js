"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";
import NewsletterSection from "@/components/sections/NewsletterSection";
import ReadProgressBar from "@/components/sections/ReadProgressBar";
import { journalApi } from "@/services/api";

const headingFont = { fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" };

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getReadingTime(content) {
  if (!content) return 2;
  const plainText = content.replace(/<[^>]*>/g, " ");
  const words = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    journalApi
      .getOne(slug)
      .then(async (res) => {
        const data = res.data?.data || res.data;
        if (!data) {
          setNotFound(true);
          return;
        }
        setBlog(data);
        return journalApi.getAll({ type: data.type });
      })
      .then((res) => {
        if (!res) return;
        const all = res.data?.data || res.data;
        if (Array.isArray(all)) {
          setRelated(all.filter((b) => b.slug !== slug).slice(0, 2));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center py-24">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#9C8148] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5C6578] text-sm">Loading article…</p>
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
        <div>
          <h1 className="text-3xl font-bold text-[#1C2A3A] mb-4" style={headingFont}>
            Article Not Found
          </h1>
          <p className="text-[#5C6578] mb-8">This article may have been moved or removed.</p>
          <Link
            href="/journal/blogs"
            className="inline-flex items-center gap-2 border border-[#1C2A3A] px-6 py-3 text-sm uppercase tracking-widest text-[#1C2A3A] hover:bg-[#1C2A3A] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isHtml = /<\/?[a-z][\s\S]*>/i.test(blog.content || "");
  const paragraphs = !isHtml && blog.content ? blog.content.split("\n\n").filter(Boolean) : [];
  const minutes = getReadingTime(blog.content);
  const backHref = blog.type === "social-outreach" ? "/journal/social-outreach" : "/journal/blogs";

  return (
    <article className="flex min-h-screen flex-col bg-white text-[var(--ink)]">
      <ReadProgressBar />

      {/* Back Link */}
      <div className="w-full">
        <div className="mx-auto max-w-[1120px] px-6">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 pt-10 pb-14 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)] transition-colors duration-200 hover:text-[var(--gold)]"
          >
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Journal
          </Link>
        </div>
      </div>

      {/* Hero cream band */}
      <section className="bg-[var(--cream)]">
        <div className="mx-auto max-w-[1120px] px-6 pt-14 pb-12 text-center md:pt-20 md:pb-16">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[var(--gold)] opacity-40" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold)]">
              The Flaunt Green Journal
            </span>
            <span className="h-px w-12 bg-[var(--gold)] opacity-40" />
          </div>

          <h1
            className="mt-7 max-w-[1120px] font-medium text-[34px] leading-[1.15] text-[var(--ink)] md:text-[56px]"
            style={headingFont}
          >
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 max-w-[1120px] text-[20px] italic leading-relaxed text-[var(--muted)]" style={headingFont}>
              {blog.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] text-[var(--muted)]">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={14} />
              {formatDate(blog.published_at)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={14} />
              {minutes} min read
            </span>
            <span className="rounded-full border border-[var(--gold)] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold)] capitalize">
              {blog.type === "social-outreach" ? "Social Outreach" : "Blog"}
            </span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1120px] px-6">
          {blog.image_url && (
            <div className="relative mt-12 aspect-[16/9] w-full md:mt-16">
              <Image
                src={blog.image_url}
                alt={blog.title}
                fill
                priority
                sizes="(min-width: 1120px) 1120px, 100vw"
                className="rounded-[12px] object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="pt-12 pb-8 md:pt-16">
            {/* Rich HTML Content from Summernote */}
            {isHtml ? (
              <div
                className="editorial-blog-body text-[17px] font-light leading-[1.85] text-[var(--body)] md:text-[18px]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              /* Plain text fallback */
              <div className="space-y-6">
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={`text-[17px] font-light leading-[1.85] text-[var(--body)] md:text-[18px] ${
                      i === 0
                        ? "first-letter:float-left first-letter:mt-1 first-letter:pr-2 first-letter:font-heading first-letter:leading-[0.8] first-letter:text-[64px] first-letter:text-[var(--gold)]"
                        : ""
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Separate Dedicated Pull Quote (shown only if provided explicitly) */}
            {blog.quote && blog.quote.trim() && (
              <aside className="my-16 rounded-r-[12px] border-l-4 border-[var(--gold)] bg-[var(--sage-pale)] p-8 md:p-10 shadow-sm">
                <span className="block select-none text-[48px] leading-none text-[var(--gold)]">“</span>
                <p className="mt-2 text-[22px] md:text-[26px] italic leading-[1.55] text-[var(--ink)]" style={headingFont}>
                  {blog.quote}
                </p>
                <footer className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold)]">
                  {blog.quote_author ? `— ${blog.quote_author}` : "— The Flaunt Green Journal"}
                </footer>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* More from the Journal */}
      {related.length > 0 && (
        <section className="bg-[var(--cream)] py-20 md:py-24">
          <div className="mx-auto max-w-[1120px] px-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-[var(--gold)] opacity-40" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold)]">
                  Continue Reading
                </span>
                <span className="h-px w-12 bg-[var(--gold)] opacity-40" />
              </div>
              <h2 className="mt-5 font-medium text-[32px] leading-[1.15] text-[var(--ink)] md:text-[40px]" style={headingFont}>
                More from the Journal
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {related.map((b) => (
                <Link
                  key={b.slug}
                  href={`/journal/blogs/${b.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[12px] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5EDE7]">
                    {b.image_url ? (
                      <Image
                        src={b.image_url}
                        alt={b.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#9C8148] text-3xl font-heading">FG</span>
                      </div>
                    )}
                  </div>
                  <div className="p-7">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--gold)]">
                      {formatDate(b.published_at)}
                    </span>
                    <h3
                      className="mt-3 font-medium text-[22px] leading-[1.3] text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--gold)]"
                      style={headingFont}
                    >
                      {b.title}
                    </h3>
                    <span className="mt-5 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--gold)]">
                      Read Article
                      <ArrowRight size={14} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                href="/journal/blogs"
                className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--ink)] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--ink)] transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--cream)]"
              >
                Read All Articles
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <NewsletterSection />

      {/* Editorial styling for Summernote generated blog content */}
      <style jsx global>{`
        .editorial-blog-body h1,
        .editorial-blog-body h2,
        .editorial-blog-body h3,
        .editorial-blog-body h4,
        .editorial-blog-body h5,
        .editorial-blog-body h6 {
          font-family: var(--font-heading), 'Cormorant Garamond', serif;
          color: var(--ink);
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.25;
        }
        .editorial-blog-body h1 { font-size: 2.25rem; }
        .editorial-blog-body h2 { font-size: 1.875rem; border-bottom: 1px solid #f1ece4; padding-bottom: 0.5rem; }
        .editorial-blog-body h3 { font-size: 1.5rem; }
        .editorial-blog-body h4 { font-size: 1.25rem; }
        .editorial-blog-body p {
          margin-bottom: 1.5rem;
          line-height: 1.85;
        }
        .editorial-blog-body ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .editorial-blog-body ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .editorial-blog-body li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        .editorial-blog-body a {
          color: #9C8148;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s;
        }
        .editorial-blog-body a:hover {
          opacity: 0.8;
        }
        .editorial-blog-body blockquote {
          border-left: 4px solid #9C8148;
          background-color: var(--sage-pale);
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: var(--ink);
        }
        .editorial-blog-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.75rem 0;
          font-size: 0.95rem;
        }
        .editorial-blog-body th,
        .editorial-blog-body td {
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          text-align: left;
        }
        .editorial-blog-body th {
          background-color: #f8fafc;
          font-weight: 600;
        }
        .editorial-blog-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem auto;
          display: block;
        }
        .editorial-blog-body hr {
          border: 0;
          border-top: 1px solid #e5e7eb;
          margin: 2.5rem 0;
        }
      `}</style>
    </article>
  );
}