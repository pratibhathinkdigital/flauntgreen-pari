import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Coming Soon",
  description:
    "This page is coming soon. Flaunt Green — sustainable luxury fashion crafted with purpose.",
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="relative flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(65,84,47,0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 85% 100%, rgba(153,123,71,0.10), transparent 60%)",
          }}
        />

        <div className="relative container-site py-20 md:py-28 text-center">
          <div className="mx-auto mb-10 flex justify-center">
            <Image
              src="/assets/FGLOGONEW.png"
              alt="Flaunt Green"
              width={200}
              height={80}
              className="w-auto h-auto opacity-80"
              priority
            />
          </div>

          <p className="font-heading text-2xl md:text-3xl mb-4" style={{ color: "var(--gold)" }}>
            Coming Soon
          </p>

          <h1 className="font-heading text-5xl md:text-7xl font-semibold leading-tight mb-6 text-text-primary">
            Something Beautiful
            <br />
            Is Being Woven
          </h1>

          <p className="mx-auto max-w-xl text-text-secondary text-lg md:text-xl leading-relaxed">
            We&apos;re putting the finishing touches on this experience.
            Keep exploring in the meantime — sustainable fashion awaits.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn-gold">
              Back to Home
            </Link>
            <Link href="/dog_togs" className="btn-gold-outline">
              Explore Dog Togs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
