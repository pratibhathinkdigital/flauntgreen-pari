"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { settingsApi } from "@/services/api";

const footerLinks = [
  {
    heading: "Shop",
    links: [
      { label: "New Arrivals", href: "/new" },
      { label: "Collection", href: "/collections" },
      { label: "Dog Togs", href: "/dog-togs" },
      { label: "Shop All", href: "/shop" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "Journal", href: "/blog" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Return & Exchange Policy", href: "/returns" },
    ],
  },
];

export default function Footer() {
  const [settings, setSettings] = useState({
    support_email: "support@flauntgreen.in",
    support_phone: "+91 7710030888",
    store_address: "Mumbai, India",
  });

  useEffect(() => {
    settingsApi.getAll().then((res) => {
      if (res.data) setSettings(res.data);
    }).catch(console.error);
  }, []);

  const dynamicContactItems = [
    { icon: FaEnvelope, label: settings.support_email || "support@flauntgreen.in", href: `mailto:${settings.support_email}` },
    { icon: FaPhone, label: settings.support_phone || "+91 7710030888", href: `tel:${settings.support_phone}` },
    { icon: FaMapMarkerAlt, label: settings.store_address || "Mumbai, India", href: "/location" },
  ];

  const socials = [
    { icon: MessageCircle, href: "#", label: "WhatsApp" },
    { icon: Facebook, href: "https://www.facebook.com/share/1Yu472FNV1/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/flauntgreen/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/flauntgreen?igsh=NnRhcWdsNmlramFs&igsi=NnRhcWdsNmlramFs", label: "Instagram" },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "#F5EFE4" }}>
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/assets/footer_image.svg"
          alt=""
          fill
          className="object-cover object-bottom w-full h-full"
          priority
        />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 pt-12 pb-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-10 xl:gap-x-14 items-start">
          {/* Logo Block — spans 2 columns on xl */}
          <div className="col-span-2 md:col-span-3 xl:col-span-2 flex flex-col items-start text-left">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/FGLOGONEW.png"
                alt="Flaunt Green"
                width={200}
                height={78}
                className="w-auto h-auto"
                style={{ maxWidth: "200px" }}
                priority
              />
            </Link>
            <p className="mt-[18px] text-sm leading-relaxed" style={{ color: "#5C584D" }}>
              Sustainably Crafted. Timeless Fashion.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-[#9C8148] text-white transition-all duration-[250ms] hover:bg-[#8F7328] hover:scale-105"
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map(({ heading, links }) => (
            <div key={heading} className="col-span-1">
              <h3 className="text-base font-bold mb-[18px]" style={{ color: "#1C2A3A" }}>
                {heading}
              </h3>
              <ul className="flex flex-col gap-[16px]">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-[400] text-[#5C584D] transition-colors duration-[250ms] hover:text-[var(--gold)] focus-visible:text-[var(--gold)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="col-span-1 flex flex-col xl:items-end">
            <div className="w-fit text-left">
              <h3 className="text-base font-bold mb-[18px]" style={{ color: "#1C2A3A" }}>
                Contact
              </h3>
              <ul className="flex flex-col gap-[16px]">
                {dynamicContactItems.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 text-[14px] font-[400] text-[#5C584D] transition-colors duration-[250ms] hover:text-[var(--gold)] focus-visible:text-[var(--gold)]"
                    >
                      <Icon
                        size={16}
                        className="shrink-0"
                        style={{ transform: "scaleX(-1)" }}
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-4 xl:gap-x-14 border-t border-gray-300 mt-10 pt-5 items-center">
          <p className="col-span-2 md:col-span-2 xl:col-span-2 text-xs" style={{ color: "#8C8C8C" }}>
            &copy; 2026 Flaunt Green. All rights reserved.
          </p>
          <div className="hidden xl:block xl:col-span-3" />
          <p className="col-span-2 md:col-span-1 xl:col-span-1 text-left xl:text-right text-xs whitespace-nowrap" style={{ color: "#8C8C8C" }}>
            Crafted with care by <a href="https://thinkdigitalindia.in/" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">Think Digital</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
