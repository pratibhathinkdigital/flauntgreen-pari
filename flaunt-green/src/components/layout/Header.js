"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X, User, ChevronDown, Heart } from "lucide-react";
import SearchModal from "@/components/ui/SearchModal";
import AnnouncementBar from "@/components/sections/AnnouncementBar";
import { categoriesApi } from "@/services/api";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";


const collectionLinks = [
  { label: "Evolve", href: "/collections/evolve" },
  { label: "E.K.A.M.", href: "/collections/ekam" },
  { label: "Pristine", href: "/collections/pristine" },
];

const dogTogsLinks = [
  { label: "Festive ", href: "/dog_togs/festive-wear" },
  { label: "Pawsails", href: "/dog_togs/pawsails" },
];

const sustainabilityLinks = [
  { label: "Slow Fashion Guide", href: "/slow-fashion-guide" },
  { label: "Our Materials", href: "/our-materials" },
  { label: "FG Impact", href: "/coming-soon" },
];

const ourStoryLinks = [
  /* COMMING SOON — original: { label: "About Us", href: "/about" } */
  { label: "About Us", href: "/coming-soon" },
  /* COMMING SOON — original: { label: "Core Values", href: "/core-values" } */
  { label: "Core Values", href: "/coming-soon" },
  /* COMMING SOON — original: { label: "Brand Philosophy", href: "/brand-philosophy" } */
  { label: "Brand Philosophy", href: "/coming-soon" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [shopColumns, setShopColumns] = useState([]);
  const [mounted, setMounted] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();
  const isAuth = mounted && isAuthenticated();
  const wishlistItems = useWishlistStore((s) => s.items);
  const totalWishlistCount = isAuth ? wishlistItems.length : 0;
  const totalCartCount = isAuth ? cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0) : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories from API and build the Shop dropdown columns
  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      const categories = res.data || [];
      // Group by section
      const grouped = {};
      categories.forEach((cat) => {
        const section = cat.section?.toLowerCase() || "other";
        if (!grouped[section]) grouped[section] = [];
        grouped[section].push(cat);
      });
      const SECTION_ORDER = ["her", "him", "dog-togs", "dog_togs"];
      const SECTION_LABELS = {
        her: "Her", him: "Him", "dog-togs": "Dog Togs", "dog_togs": "Dog Togs"
      };
      const SECTION_HREFS = {
        her: "/her/", him: "/him/",
        "dog-togs": "/dog_togs/", "dog_togs": "/dog_togs/"
      };

      const getCategoryHref = (sec, cat) => {
        const catClean = cat.name.toLowerCase().trim().replace(/\s+/g, '-');
        if (sec === 'her') return `/her/${catClean}/`;
        if (sec === 'him') return `/him/${catClean}/`;
        if (sec === 'dog-togs' || sec === 'dog_togs') {
          if (catClean.includes('pawsail')) return '/dog_togs/pawsails/';
          if (catClean.includes('festive')) return '/dog_togs/festive-wear/';
          return `/dog_togs/`;
        }
        return `/shop?category=${cat.slug}`;
      };

      const cols = [];
      // First add sections in preferred order
      SECTION_ORDER.forEach((sec) => {
        if (grouped[sec] && !cols.find((c) => c.sectionKey === sec)) {
          cols.push({
            sectionKey: sec,
            heading: SECTION_LABELS[sec] || sec,
            headingHref: SECTION_HREFS[sec] || `/shop?section=${sec}`,
            links: grouped[sec].map((cat) => ({
              label: cat.name,
              href: getCategoryHref(sec, cat),
            })),
          });
        }
      });
      // Then add any remaining sections not in preferred order
      Object.entries(grouped).forEach(([sec, cats]) => {
        if (!cols.find((c) => c.sectionKey === sec) && sec !== 'unisex') {
          cols.push({
            sectionKey: sec,
            heading: sec.charAt(0).toUpperCase() + sec.slice(1),
            headingHref: SECTION_HREFS[sec] || `/shop?section=${sec}`,
            links: cats.map((cat) => ({
              label: cat.name,
              href: getCategoryHref(sec, cat),
            })),
          });
        }
      });

      // Default fallback if categories not yet loaded from DB
      if (cols.length === 0) {
        setShopColumns([
          {
            sectionKey: "her",
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
            sectionKey: "him",
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
            sectionKey: "dog-togs",
            heading: "Dog Togs",
            headingHref: "/dog_togs",
            links: [
              { label: "Festive Wear", href: "/dog_togs/festive-wear" },
              { label: "Pawsails", href: "/dog_togs/pawsails" },
            ],
          },
        ]);
      } else {
        setShopColumns(cols);
      }
    }).catch(() => {
      setShopColumns([
        {
          sectionKey: "her",
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
          sectionKey: "him",
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
          sectionKey: "dog-togs",
          heading: "Dog Togs",
          headingHref: "/dog_togs",
          links: [
            { label: "Festive Wear", href: "/dog_togs/festive-wear" },
            { label: "Pawsails", href: "/dog_togs/pawsails" },
          ],
        },
      ]);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <div className="relative py-2 px-24">
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
                {/* COMMING SOON — original: <Link href="/sustainability"> */}
                <Link href="">
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

              {/* Journal — No Dropdown */}
              <li className="nav-item">
                <Link href="/journal">Journal</Link>
              </li>

              {/* Our Story — Simple Dropdown */}
              <li className="nav-item has-dropdown">
                {/* COMMING SOON — original: <Link href="/our-story"> */}
                <Link href="/coming-soon">
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

              {/* Contact — No Dropdown */}
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

              {/* Wishlist Link with live badge counter */}
              <Link
                href="/wishlist"
                className="btn-icon btn-ghost relative group"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 text-[#A8823F] transition-colors group-hover:text-rose-600" />
                {mounted && totalWishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                    {totalWishlistCount > 99 ? "99+" : totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link with live badge counter */}
              <Link href="/cart" className="btn-icon btn-ghost relative group" aria-label="Bag">
                <ShoppingBag className="w-5 h-5 text-[#A8823F]" />
                {mounted && totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#41542f] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                    {totalCartCount > 99 ? "99+" : totalCartCount}
                  </span>
                )}
              </Link>

              {/* Account Link with Name under Profile Icon */}
              {mounted && isAuth && user ? (
                <div className="relative group/user">
                  <Link
                    href="/account"
                    className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded-lg hover:bg-slate-50 transition-colors text-center"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5 text-[#A8823F]" />
                    <span className="text-[10px] font-medium text-text-primary max-w-[65px] truncate leading-tight mt-0.5">
                      {user.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                  </Link>

                  {/* Dropdown Menu on hover */}
                  <div className="absolute right-0 top-full pt-1 hidden group-hover/user:block z-50">
                    <div className="w-48 bg-white rounded-2xl shadow-soft-xl border border-slate-100 p-2 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/account" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#41542f] transition-colors">
                          My Account
                        </Link>
                        <Link href="/account/orders" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#41542f] transition-colors">
                          My Orders
                        </Link>
                        <Link href="/account/wishlist" className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#41542f] transition-colors">
                          My Wishlist
                        </Link>
                        {user.role === "admin" && (
                          <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#41542f] font-semibold hover:bg-[#41542f]/10 transition-colors">
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            toast.success("Logged out successfully");
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded-lg hover:bg-slate-50 transition-colors text-center"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 text-[#A8823F]" />
                  <span className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">
                    Login
                  </span>
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
          <div className="lg:hidden border-t border-slate-100 bg-white overflow-y-auto max-h-[calc(100vh-80px)]">
            <nav className="container-site py-4 flex flex-col gap-1">
              {/* Shop */}
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-base font-medium text-text-primary hover:text-[var(--gold)]">Shop</Link>

              {/* Collection */}
              <Link href="/collections" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-base font-medium text-text-primary hover:text-[var(--gold)]">Collection</Link>

              {/* Dog Togs — Accordion */}
              <div className="border-b border-slate-100">
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === "dog-togs" ? null : "dog-togs")}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-text-primary hover:text-[var(--gold)]"
                >
                  Dog Togs
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAccordion === "dog-togs" ? "rotate-180" : ""}`} />
                </button>
                {mobileAccordion === "dog-togs" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col gap-1.5">
                    {dogTogsLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
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
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === "sustainability" ? null : "sustainability")}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-text-primary hover:text-[var(--gold)]"
                >
                  Sustainability
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAccordion === "sustainability" ? "rotate-180" : ""}`} />
                </button>
                {mobileAccordion === "sustainability" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col gap-1.5">
                    {sustainabilityLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-text-secondary hover:text-[var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* Journal — No Dropdown */}
              <Link href="/journal" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-base font-medium text-text-primary hover:text-[var(--gold)]">Journal</Link>

              {/* Our Story — Accordion */}
              <div className="border-b border-slate-100">
                <button
                  onClick={() => setMobileAccordion(mobileAccordion === "our-story" ? null : "our-story")}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-text-primary hover:text-[var(--gold)]"
                >
                  Our Story
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAccordion === "our-story" ? "rotate-180" : ""}`} />
                </button>
                {mobileAccordion === "our-story" && (
                  <div className="px-4 pb-4 pl-6 flex flex-col gap-1.5">
                    {ourStoryLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-text-secondary hover:text-[var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {mounted && isAuth && user ? (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="px-4 py-2.5 bg-slate-50 rounded-xl">
                    <p className="font-semibold text-sm text-slate-800">Hi, {user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                    My Account
                  </Link>
                  <Link href="/account/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                    My Orders
                  </Link>
                  <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
                    My Wishlist
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-xl text-sm font-semibold text-[#41542f] hover:bg-[#41542f]/10">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      toast.success("Logged out successfully");
                    }}
                    className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary mt-4 w-full">Sign In</Link>
              )}
            </nav>
          </div>
        )}
      </header>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[100px]" />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
