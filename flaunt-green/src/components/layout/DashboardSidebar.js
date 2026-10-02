"use client";

import Link    from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Heart, MapPin, Settings, LogOut
} from "lucide-react";

const navItems = [
  { label: "Dashboard",   href: "/account",            icon: LayoutDashboard },
  { label: "My Orders",   href: "/account/orders",     icon: ShoppingBag },
  { label: "Wishlist",    href: "/account/wishlist",   icon: Heart },
  { label: "Addresses",   href: "/account/addresses",  icon: MapPin },
  { label: "Settings",    href: "/account/profile",    icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-60 shrink-0">
      <div className="card p-4 sticky top-28">
        <nav className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-gradient-to-r from-[#0c2c6d] to-[#164bb5] text-white shadow-soft font-semibold"
                    : "text-text-secondary hover:bg-slate-50 hover:text-[#0c2c6d]"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}

          <button className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 mt-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </nav>
      </div>
    </aside>
  );
}
