"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  Package,
  Leaf,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { addressesApi, ordersApi } from "@/services/api";

const STATUS_CONFIG = {
  placed:     { label: "Order Placed",   color: "bg-blue-100 text-blue-700",     icon: Package },
  processing: { label: "Processing",     color: "bg-amber-100 text-amber-700",   icon: Clock },
  shipped:    { label: "Shipped",        color: "bg-indigo-100 text-indigo-700", icon: Truck },
  delivered:  { label: "Delivered",      color: "bg-emerald-100 text-emerald-700",icon: CheckCircle },
  cancelled:  { label: "Cancelled",      color: "bg-red-100 text-red-600",       icon: RotateCcw },
};

function OrderStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export default function AccountDashboardClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, token } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [orders, setOrders] = useState([]);
  const [addressCount, setAddressCount] = useState(0);

  const fetchData = async () => {
    try {
      const [ordersRes, addrRes] = await Promise.all([
        ordersApi.getMyOrders(),
        addressesApi.getAll()
      ]);
      const mappedOrders = ordersRes.data.map(o => ({
        id: o.order_number || o.id,
        date: new Date(o.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
        status: o.status,
        total: parseFloat(o.total),
        items: (o.items || []).map(i => ({
          name: i.name,
          size: i.size || 'ONE',
          color: i.color || 'N/A',
          image: i.image || "/assets/placeholder.jpg"
        }))
      }));
      setOrders(mappedOrders);
      setAddressCount(addrRes.data?.length || 0);
    } catch (err) {
      console.error("AccountDashboard error:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user) {
      router.replace("/login?redirect=/account");
      return;
    }
    fetchData();
  }, [mounted, token, user, router]);

  if (!mounted || !token || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0c2c6d] animate-spin" />
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Guest";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "G";

  const quickLinks = [
    { label: "My Orders",   href: "/account/orders",    icon: ShoppingBag, count: orders.length,  desc: "Track & manage" },
    { label: "Wishlist",    href: "/account/wishlist",  icon: Heart,        count: wishlistItems.length, desc: "Saved pieces" },
    { label: "Addresses",   href: "/account/addresses", icon: MapPin,       count: addressCount,                desc: "Shipping addresses" },
    { label: "Settings",    href: "/account/profile",   icon: Settings,     count: null,                desc: "Profile & password" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#061538] via-[#0a2560] to-[#164bb5] p-6 sm:p-8 text-white shadow-soft">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold text-white ring-2 ring-white/30">
            {initials}
          </div>
          <div>
            <p className="text-sm text-white/70 mb-0.5">Welcome back,</p>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
            >
              {firstName}! 🌿
            </h1>
            <p className="text-xs text-white/60 mt-1">
              {user?.email || "Conscious shopper at Flaunt Green"}
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20">
            <Leaf className="w-4 h-4 text-[#c2e1b7]" />
            <span className="text-xs text-white/80 font-medium">Conscious Member</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",   value: orders.length,     unit: "orders" },
          { label: "Wishlist Items", value: wishlistItems.length,   unit: "saved" },
          { label: "Delivered",      value: orders.filter(o => o.status === "delivered").length, unit: "received" },
          { label: "Saved Addresses",value: addressCount,                      unit: "locations" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-soft-sm">
            <p className="text-2xl font-bold text-[#141b28]">{stat.value}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2
          className="text-lg font-bold text-[#141b28] mb-4"
          style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
        >
          My Account
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map(({ label, href, icon: Icon, count, desc }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-soft-sm hover:shadow-soft hover:border-[#997b47]/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#f7ece6] flex items-center justify-center group-hover:bg-[#997b47]/10 transition-colors">
                  <Icon className="w-5 h-5 text-[#997b47]" />
                </div>
                {count !== null && (
                  <span className="text-xs font-bold text-[#997b47] bg-[#997b47]/10 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#141b28]">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-[#141b28]"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            Recent Orders
          </h2>
          <Link
            href="/account/orders"
            className="text-xs text-[#997b47] hover:underline font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-4 sm:p-5 hover:shadow-soft transition-all duration-200"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 relative rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <Image
                      src={order.items[0]?.image || "/assets/placeholder.jpg"}
                      alt={order.items[0]?.name || "Product"}
                      fill
                      className="object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-[#997b47]">#{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm font-semibold text-[#141b28]">
                      {order.items[0]?.name}
                      {order.items.length > 1 && (
                        <span className="text-xs text-slate-400 ml-1">+{order.items.length - 1} more</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Ordered on {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#141b28]">
                    ₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <Link
                    href={`/account/orders`}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-sm text-slate-500 bg-white p-5 rounded-2xl border border-slate-100 text-center">
              You haven't placed any orders yet.
            </p>
          )}
        </div>
      </div>

      {/* Sustainability Card */}
      <div className="bg-[#f7ece6] rounded-2xl p-6 border border-[#ecd1cb]">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-4 h-4 text-[#41542f]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#41542f]">Your Impact</span>
        </div>
        <p
          className="text-[#141b28] font-semibold mb-1"
          style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "20px" }}
        >
          Every stitch tells a conscious story.
        </p>
        <p className="text-xs text-[#475569]">
          By choosing Flaunt Green, you&apos;ve supported sustainable fashion, organic textiles, and responsible production. Thank you for making a difference.
        </p>
      </div>
    </div>
  );
}
