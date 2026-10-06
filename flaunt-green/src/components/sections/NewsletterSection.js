"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast.success("You're subscribed!");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-[80px] px-6 text-center" style={{ backgroundColor: "#1d2a3b" }}>
      <div className="max-w-[820px] mx-auto">
<h2
  className="font-sans font-bold leading-tight mb-5"
  style={{
    fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
    fontSize: "clamp(32px, 4vw, 50px)",
    color: "#F5F1E8",
  }}
>
  Join Our Green Journey
</h2>
        <p
          className="mx-auto mb-10 leading-relaxed"
          style={{
            fontSize: "19px",
            color: "#C7D0DC",
            maxWidth: "650px",
          }}
        >
          Be the first to discover new collections, meet our featured artisans,
          and get exclusive access to limited-edition sustainable pieces.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row" style={{ border: "1px solid rgba(245, 241, 232, 0.35)" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-4 text-sm focus:outline-none"
            style={{ backgroundColor: "#24334a", color: "#F5F1E8" }}
            id="newsletter-email-input"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 text-sm font-normal shrink-0 bg-[var(--gold)] text-[#F5F1E8] transition-all duration-[250ms] hover:bg-[#8F7328]"
            id="newsletter-submit-btn"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#F5F1E8] border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
