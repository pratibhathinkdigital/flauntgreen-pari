"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, Heart } from "lucide-react";
import SearchModal from "@/components/ui/SearchModal";
import AnnouncementBar from "@/components/sections/AnnouncementBar";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const shopColumns = [
  {
    heading: "Her",
    headingHref: "/her",
    links: [
      { label: "Topwear", href: "/her/topwear" },
      { label: "Bottomwear", href: "/her/bottomwear" },
      { label: "Dresses", href: "/her/dresses" },
      { label: "Outerwear", href: "/her/outerwear" },
      { label: "Accessories", href: "/her/accessories" },
    ],
  },
  {
    heading: "Him",
    headingHref: "/him",
    links: [
      { label: "Topwear", href: "/him/topwear" },
      { label: "Bottomwear", href: "/him/bottomwear" },
      { label: "Outerwear", href: "/him/outerwear" },
      { label: "Accessories", href: "/him/accessories" },
    ],
  },
  {
    heading: "Collections",
    headingHref: "/collections",
    links: [
      { label: "Evolve", href: "/collections/evolve" },
      { label: "E.K.A.M.", href: "/collections/ekam" },
      { label: "Pristine", href: "/collections/pristine" },
    ],
  },
  {
    heading: "Dog Togs",
    headingHref: "/dog_togs",
    links: [
      { label: "Festive", href: "/dog_togs/festive-wear" },
      { label: "Pawsails", href: "/dog_togs/pawsails" },
    ],
  },
];

const collectionLinks = [
  { label: "Evolve", href: "/collections/evolve" },
  { label: "E.K.A.M.", href: "/collections/ekam" },
  { label: "Pristine", href: "/collections/pristine" },
];

const dogTogsLinks = [
  { label: "Festive", href: "/dog_togs/festive-wear" },
  { label: "Pawsails", href: "/dog_togs/pawsails" },
];

const sustainabilityLinks = [
  { label: "Slow Fashion Guide", href: "/slow-fashion-guide" },
  { label: "Our Materials", href: "/our-materials" },
  { label: "FG Impact", href: "/fg-impact" },
];

const ourStoryLinks = [
  { label: "About Us", href: "/our-story#about-us" },
  { label: "Our Mission", href: "/our-story#our-mission" },
  { label: "Core Values", href: "/our-story#core-values" },
  { label: "Team", href: "/our-story#our-team" },
];

const journalLinks = [
  { label: "Blogs", href: "/journal/blogs" },
  { label: "Social Outreach", href: "/journal/social-outreach" },
];

function Chevron({ className = "" }) {
  return (
    <svg
      className={className}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Stop the page behind the drawer from scrolling on touch */
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);
  const toggleAccordion = (id) =>
    setMobileAccordion((current) => (current === id ? null : id));

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300`}>
        <AnnouncementBar />
        <header
          className={`w-full transition-all duration-300 ${scrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-slate-100"
            : "bg-white border-b border-slate-100"
            }`}
        >
        <div className="relative py-2 px-4 sm:px-6 lg:px-24">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/assets/FGLOGONEW.png"
                alt="Flaunt Green"
                width={160}
                height={62}
                className="w-auto h-auto translate-y-[2px]"
                style={{ maxWidth: "clamp(120px, 20vw, 160px)" }}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Shop — Mega Dropdown */}
              <li className="nav-item has-dropdown">
                <Link href="/shop">
                  Shop
                  <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="mega-dropdown">
                  {shopColumns.map((col) => (
                    <div className="dropdown-column" key={col.heading}>
                      <Link href={col.headingHref} className="dropdown-heading">
                        {col.heading}
                      </Link>
                      <ul>
                        {col.links.map((link) => (
                          <li key={link.label}>
<Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>

              {/* Collection — Simple Dropdown */}
              <li className="nav-item has-dropdown">
                <Link href="/collections">
                  Collections
                  <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="simple-dropdown">
                  <ul>
                    {collectionLinks.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Dog Togs — Simple Dropdown */}
              <li className="nav-item has-dropdown">
                <Link href="/dog_togs">
                  Dog Togs
                  <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="simple-dropdown">
                  <ul>
                    {dogTogsLinks.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Sustainability — Dropdown */}
              <li className="nav-item has-dropdown">
                <Link href="/sustainability">
                  Sustainability
                  <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="simple-dropdown">
                  <ul>
                    {sustainabilityLinks.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Journal — Simple Dropdown */}
              <li className="nav-item has-dropdown">
                <Link href="/journal">
                  Journal
                  <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="simple-dropdown">
                  <ul>
                    {journalLinks.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Our Story — Simple Dropdown */}
              <li className="nav-item has-dropdown">
                <Link href="/our-story">
                  Our Story
                  <svg className="dropdown-icon" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="simple-dropdown">
                  <ul>
                    {ourStoryLinks.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Contact */}
              <li className="nav-item">
                <Link href="/contact">Contact</Link>
              </li>
            </nav>

            {/* Actions — Search, Bag, User */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-icon btn-ghost"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-[#A8823F]" />
              </button>

              {/* Wishlist Link */}
              <Link href="/wishlist" className="btn-icon btn-ghost relative hidden md:inline-flex" aria-label="Wishlist">
                <Heart className="w-5 h-5 text-[#A8823F]" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#A8823F] text-[10px] font-bold text-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link href="/cart" className="btn-icon btn-ghost relative" aria-label="Bag">
                <ShoppingBag className="w-5 h-5 text-[#A8823F]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#A8823F] text-[10px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              {user ? (
                <div className="group relative">
                  <Link href="/account" className="btn-icon btn-ghost" aria-label="Account">
                    <User className="w-5 h-5 text-[#A8823F]" />
                  </Link>
                  <div className="absolute right-0 top-full mt-2 hidden w-40 rounded-xl bg-white p-2 shadow-soft group-hover:block border border-slate-100">
                    <div className="px-3 py-2 text-xs text-slate-500 font-medium border-b border-slate-100 mb-1">
                      Hi, {user.name.split(" ")[0]}
                    </div>
                    <Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-[#1C2A3A] hover:bg-slate-50 transition-colors">
                      My Account
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="btn-icon btn-ghost" aria-label="Account">
                  <User className="w-5 h-5 text-[#A8823F]" />
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-icon btn-ghost lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5 text-[#A8823F]" /> : <Menu className="w-5 h-5 text-[#A8823F]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white overflow-y-auto overscroll-contain max-h-[calc(100dvh-124px)]">
            <nav className="container-site py-4 flex flex-col gap-1">
              {/* Shop - full category tree, mirrors the desktop mega dropdown */}
              <div className="border-b border-slate-100">
                <div className="flex items-center">
                  <Link
                    href="/shop"
                    onClick={closeMobile}
                    className="flex-1 px-4 py-3.5 text-base font-medium text-text-primary"
                  >
                    Shop
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("shop")}
                    className="flex items-center justify-center px-4 py-3.5 text-text-secondary"
                    aria-expanded={mobileAccordion === "shop"}
                    aria-label="Toggle Shop submenu"
                  >
                    <Chevron
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileAccordion === "shop" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {mobileAccordion === "shop" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col">
                    {shopColumns.map((col) => (
                      <div key={col.heading} className="mb-3 last:mb-0">
                        <Link
                          href={col.headingHref}
                          onClick={closeMobile}
                          className="block py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]"
                        >
                          {col.heading}
                        </Link>
                        <div className="flex flex-col">
                          {col.links.map((link) => (
                            <Link
                              key={link.label}
                              href={link.href}
                              onClick={closeMobile}
                              className="py-2 text-sm text-text-secondary"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Collections - Accordion */}
              <div className="border-b border-slate-100">
                <div className="flex items-center">
                  <Link
                    href="/collections"
                    onClick={closeMobile}
                    className="flex-1 px-4 py-3.5 text-base font-medium text-text-primary"
                  >
                    Collections
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("collections")}
                    className="flex items-center justify-center px-4 py-3.5 text-text-secondary"
                    aria-expanded={mobileAccordion === "collections"}
                    aria-label="Toggle Collections submenu"
                  >
                    <Chevron
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileAccordion === "collections" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {mobileAccordion === "collections" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col">
                    {collectionLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeMobile}
                        className="py-2 text-sm text-text-secondary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Dog Togs — Accordion */}
              <div className="border-b border-slate-100">
                <div className="flex items-center">
                  <Link
                    href="/dog_togs"
                    onClick={closeMobile}
                    className="flex-1 px-4 py-3.5 text-base font-medium text-text-primary"
                  >
                    Dog Togs
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("dog-togs")}
                    className="flex items-center justify-center px-4 py-3.5 text-text-secondary"
                    aria-expanded={mobileAccordion === "dog-togs"}
                    aria-label="Toggle Dog Togs submenu"
                  >
                    <Chevron
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileAccordion === "dog-togs" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {mobileAccordion === "dog-togs" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col">
                    {dogTogsLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeMobile}
                        className="text-sm text-text-secondary hover:text-[var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sustainability — Accordion */}
              <div className="border-b border-slate-100">
                <div className="flex items-center">
                  <Link
                    href="/sustainability"
                    onClick={closeMobile}
                    className="flex-1 px-4 py-3.5 text-base font-medium text-text-primary"
                  >
                    Sustainability
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("sustainability")}
                    className="flex items-center justify-center px-4 py-3.5 text-text-secondary"
                    aria-expanded={mobileAccordion === "sustainability"}
                    aria-label="Toggle Sustainability submenu"
                  >
                    <Chevron
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileAccordion === "sustainability" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {mobileAccordion === "sustainability" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col">
                    {sustainabilityLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeMobile}
                        className="text-sm text-text-secondary hover:text-[var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* Journal — Accordion */}
              <div className="border-b border-slate-100">
                <div className="flex items-center">
                  <Link
                    href="/journal"
                    onClick={closeMobile}
                    className="flex-1 px-4 py-3.5 text-base font-medium text-text-primary"
                  >
                    Journal
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("journal")}
                    className="flex items-center justify-center px-4 py-3.5 text-text-secondary"
                    aria-expanded={mobileAccordion === "journal"}
                    aria-label="Toggle Journal submenu"
                  >
                    <Chevron
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileAccordion === "journal" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {mobileAccordion === "journal" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col">
                    {journalLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeMobile}
                        className="text-sm text-text-secondary hover:text-[var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Our Story — Accordion */}
              <div className="border-b border-slate-100">
                <div className="flex items-center">
                  <Link
                    href="/our-story"
                    onClick={closeMobile}
                    className="flex-1 px-4 py-3.5 text-base font-medium text-text-primary"
                  >
                    Our Story
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleAccordion("our-story")}
                    className="flex items-center justify-center px-4 py-3.5 text-text-secondary"
                    aria-expanded={mobileAccordion === "our-story"}
                    aria-label="Toggle Our Story submenu"
                  >
                    <Chevron
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileAccordion === "our-story" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {mobileAccordion === "our-story" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col">
                    {ourStoryLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeMobile}
                        className="text-sm text-text-secondary hover:text-[var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact — Mobile */}
              <div className="border-b border-slate-100">
                <Link
                  href="/contact"
                  onClick={closeMobile}
                  className="block px-4 py-3.5 text-base font-medium text-text-primary"
                >
                  Contact
                </Link>
              </div>

              {user ? (
                <div className="mt-4 flex flex-col gap-2">
                  <div className="text-sm font-medium text-slate-500 text-center">
                    Hi, {user.name.split(" ")[0]}
                  </div>
                  <Link href="/account" onClick={closeMobile} className="btn-primary w-full text-center">
                    My Account
                  </Link>
                  <button onClick={() => { handleLogout(); closeMobile(); }} className="w-full py-2.5 text-red-600 font-medium bg-red-50 rounded-lg">
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={closeMobile} className="btn-primary mt-4 w-full text-center">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[90px] sm:h-[104px] lg:h-[100px]" />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
