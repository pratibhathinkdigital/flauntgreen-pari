import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us | Flaunt Green",
  description:
    "Get in touch with Flaunt Green. Visit our studio, send us an email, or reach out on WhatsApp.",
};

const contactDetails = [
  {
    icon: MapPin,
    label: "Visit Us",
    lines: [
      "9 & 10, ADI House (Ground Floor),",
      "Vijay Manjrekar Rd, Chandrakant Dhuru Wadi,",
      "Dadar West, Mumbai,",
      "Maharashtra 400028",
    ],
  },
  {
    icon: Mail,
    label: "Email Us",
    lines: ["support@flauntgreen.in"],
    href: "mailto:support@flauntgreen.in",
  },
  {
    icon: Phone,
    label: "Call Us",
    lines: ["+91-7710030888"],
    href: "tel:+917710030888",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    lines: ["+91-7710030888"],
    href: "https://wa.me/917710030888",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* ── Header ── */}
      <div className="border-b border-ivory-dark">
        <div className="container-site py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-4">
            Get in Touch
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-midnight leading-tight mb-4">
            Contact Us
          </h1>
          <p className="text-text-secondary text-base max-w-lg">
            We&apos;d love to hear from you. Whether you have a question about our
            collections, sustainability practices, or just want to say hello.
          </p>
        </div>
      </div>

      <div className="container-site py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* ── Contact Details ── */}
          <div className="space-y-10">
            {contactDetails.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-full border-2 border-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-midnight mb-2">
                      {item.label}
                    </h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-text-secondary hover:text-brand-500 transition-colors text-sm leading-relaxed block"
                      >
                        {item.lines[0]}
                      </a>
                    ) : (
                      item.lines.map((line, i) => (
                        <p key={i} className="text-text-secondary text-sm leading-relaxed">
                          {line}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Contact Form ── */}
          <div>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-ivory-dark bg-white px-5 py-3.5 text-sm text-text-primary focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-ivory-dark bg-white px-5 py-3.5 text-sm text-text-primary focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-ivory-dark bg-white px-5 py-3.5 text-sm text-text-primary focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted block mb-2">
                  Message
                </label>
                <textarea
                  className="w-full border border-ivory-dark bg-white px-5 py-3.5 text-sm text-text-primary focus:outline-none focus:border-brand-500 transition-colors min-h-[160px]"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="button"
                className="w-full bg-brand-500 text-ivory px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-brand-600 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Note ── */}
      <div className="border-t border-ivory-dark">
        <div className="container-site py-8 text-center">
          <p className="text-xs text-text-muted">
            For international orders, please email us at{" "}
            <a href="mailto:support@flauntgreen.in" className="text-brand-500 hover:underline">
              support@flauntgreen.in
            </a>{" "}
            or WhatsApp us at{" "}
            <a href="https://wa.me/917710030888" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
              +91-7710030888
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
