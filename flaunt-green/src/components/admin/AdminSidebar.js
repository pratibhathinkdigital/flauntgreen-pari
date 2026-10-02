"use client";

import Link    from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings,
  BarChart2, Megaphone, ChevronLeft, Star, BookOpen, MessageSquare, MessageSquareQuote, Search
} from "lucide-react";

const navItems = [
  { label: "Overview",     href: "/admin",             icon: LayoutDashboard },
  { label: "Categories",   href: "/admin/categories",  icon: Tag },
  { label: "Collections",  href: "/admin/collections", icon: Tag },
  { label: "Products",     href: "/admin/products",    icon: Package },
  { label: "Reviews",      href: "/admin/reviews",     icon: Star },
  { label: "Testimonials", href: "/admin/testimonials",icon: MessageSquareQuote },
  { label: "Orders",       href: "/admin/orders",      icon: ShoppingCart },
  { label: "Customers",    href: "/admin/customers",   icon: Users },
  { label: "Journal",      href: "/admin/journal",     icon: BookOpen },
  { label: "Enquiries",    href: "/admin/enquiries",   icon: MessageSquare },
  { label: "Analytics",    href: "/admin/analytics",   icon: BarChart2 },
  { label: "Marketing",    href: "/admin/marketing",   icon: Megaphone },
  { label: "SEO Settings", href: "/admin/seo",         icon: Search },
  { label: "Settings",     href: "/admin/settings",    icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-60 bg-[#061538] text-slate-200 border-r border-[#0e275d] flex lg:flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#0e275d] flex items-center justify-between gap-3">
        <span className="font-heading font-bold text-lg text-white whitespace-nowrap">
          Flaunt<span className="text-[#5993e5]">Green</span>
          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1a51bb]/20 text-[#8fb6f0] border border-[#1a51bb]/30">Admin</span>
        </span>
        <Link href="/" className="lg:hidden text-xs text-slate-300 hover:text-white whitespace-nowrap">
          ← Store
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-x-1 lg:space-x-0 lg:space-y-1 overflow-x-auto flex lg:flex-col">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 whitespace-nowrap
                ${active
                  ? "bg-gradient-to-r from-[#0c2c6d] to-[#164bb5] text-white shadow-soft font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="p-3 border-t border-[#0e275d] hidden lg:block">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
