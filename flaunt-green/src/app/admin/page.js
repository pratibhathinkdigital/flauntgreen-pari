"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Users, Package, TrendingUp, ArrowUpRight,
  Clock, CheckCircle, Truck, RotateCcw, Star, RefreshCw, AlertCircle,
  Sparkles, Layers, ArrowRight, CheckCircle2, ChevronRight
} from "lucide-react";
import { adminApi } from "@/services/api";

const STATUS_CFG = {
  placed:     { label: "Placed",      cls: "bg-blue-50 text-blue-700 border border-blue-200/60",      icon: Package },
  pending:    { label: "Pending",     cls: "bg-amber-50 text-amber-700 border border-amber-200/60",    icon: Clock },
  processing: { label: "Processing",  cls: "bg-amber-50 text-amber-700 border border-amber-200/60",    icon: Clock },
  shipped:    { label: "Shipped",     cls: "bg-indigo-50 text-indigo-700 border border-indigo-200/60",  icon: Truck },
  delivered:  { label: "Delivered",   cls: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",icon: CheckCircle },
  completed:  { label: "Completed",   cls: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",icon: CheckCircle },
  cancelled:  { label: "Cancelled",   cls: "bg-rose-50 text-rose-700 border border-rose-200/60",        icon: RotateCcw },
};

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("just now");

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getDashboardStats();
      setData(res.data);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError("Unable to load latest stats from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = data?.stats || {
    total_revenue: 0,
    total_orders: 0,
    active_customers: 0,
    products: 0,
    pending_returns: 0
  };

  const statusCounts = data?.status_counts || {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  const statCards = [
    {
      label: "Gross Revenue",
      value: `₹${Math.round(stats.total_revenue || 0).toLocaleString("en-IN")}`,
      sub: "Verified completed orders",
      icon: TrendingUp,
      gradient: "from-[#0a2560] to-[#164bb5]",
      badge: "Sales",
    },
    {
      label: "Total Orders",
      value: String(stats.total_orders || 0),
      sub: "Customer purchases",
      icon: ShoppingBag,
      gradient: "from-[#c5a365] to-[#dfc385]",
      badge: "Volume",
    },
    {
      label: "Active Customers",
      value: String(stats.active_customers || 0),
      sub: "Registered client accounts",
      icon: Users,
      gradient: "from-[#061538] to-[#0e2d6b]",
      badge: "Audience",
    },
    {
      label: "Live Catalog",
      value: String(stats.products || 0),
      sub: "Garments in store",
      icon: Package,
      gradient: "from-[#164bb5] to-[#2e73dc]",
      badge: "Inventory",
    },
  ];

  const recentOrders = data?.recent_orders || [];
  const topProducts = data?.top_products || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2560] via-[#0d2f78] to-[#061538] text-white p-6 sm:p-8 shadow-soft">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-semibold text-amber-200 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Flaunt Green Management Suite</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Atelier &amp; Store Overview
            </h1>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Real-time telemetry, sustainable orders fulfilment, product metrics, and customer satisfaction.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2.5 rounded-2xl">
              <Clock className="w-3.5 h-3.5 text-amber-200" />
              <span>Updated: {lastUpdated}</span>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#061538] bg-white hover:bg-amber-50 rounded-2xl shadow-soft transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#0a2560] ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Error alert if failed */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
          <button onClick={fetchStats} className="underline font-bold ml-auto">Retry</button>
        </div>
      )}

      {/* Pending returns notification banner if any */}
      {stats.pending_returns > 0 && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-3xl px-6 py-3.5 text-xs text-amber-900 shadow-soft-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <RotateCcw className="w-4 h-4" />
            </div>
            <span>You have <strong>{stats.pending_returns}</strong> pending customer return request(s) waiting for inspection.</span>
          </div>
          <Link
            href="/admin/returns"
            className="font-bold text-[#41542f] hover:underline flex items-center gap-1 shrink-0"
          >
            Review Returns <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-3xl border border-slate-100 shadow-soft-sm p-5 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} text-white flex items-center justify-center shadow-soft-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                  {s.badge}
                </span>
              </div>
              {loading ? (
                <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-md my-1" />
              ) : (
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">{s.value}</p>
              )}
              <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">{s.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Fulfilment Pipeline Pills */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-soft-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0a2560]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Fulfilment Pipeline</h2>
          </div>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#997b47] hover:underline flex items-center gap-1">
            Orders Manager <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { label: "Pending", count: statusCounts.pending, color: "text-amber-700 bg-amber-50 border-amber-200/70" },
            { label: "Processing", count: statusCounts.processing, color: "text-blue-700 bg-blue-50 border-blue-200/70" },
            { label: "Shipped", count: statusCounts.shipped, color: "text-indigo-700 bg-indigo-50 border-indigo-200/70" },
            { label: "Delivered", count: statusCounts.delivered, color: "text-emerald-700 bg-emerald-50 border-emerald-200/70" },
            { label: "Cancelled", count: statusCounts.cancelled, color: "text-rose-700 bg-rose-50 border-rose-200/70" },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-3 rounded-2xl border text-center transition-transform hover:scale-[1.02] ${item.color}`}
            >
              <p className="text-xl font-bold font-heading">{item.count}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-[#FAF8F5]/80 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Customer Orders</h2>
              <p className="text-[11px] text-slate-400">Latest orders placed across the store</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#997b47] hover:underline font-bold flex items-center gap-1"
            >
              All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-10 text-center text-xs text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0a2560]" />
                Loading recent orders...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">No orders placed yet.</div>
            ) : (
              recentOrders.map((o) => {
                const statusKey = String(o.status || "placed").toLowerCase();
                const cfg = STATUS_CFG[statusKey] || STATUS_CFG.placed;
                const Icon = cfg.icon;
                const initialLetter = (o.customer || "C")[0].toUpperCase();
                return (
                  <div
                    key={o.id}
                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-amber-50 text-[#997b47] font-bold text-xs flex items-center justify-center border border-amber-200/60 shrink-0">
                        {initialLetter}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0a2560]">#{o.id}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.cls}`}
                          >
                            <Icon className="w-2.5 h-2.5" />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          <strong className="text-slate-800">{o.customer}</strong> · {o.product}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        ₹{(o.amount || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-slate-400">{o.date}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Selling Garments */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-[#FAF8F5]/80 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Top Selling Products</h2>
              <p className="text-[11px] text-slate-400">Based on verified purchases</p>
            </div>
            <Link href="/admin/products" className="text-xs text-[#997b47] hover:underline font-bold">
              Catalog
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading top products...</div>
            ) : topProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No product sales recorded yet.</div>
            ) : (
              topProducts.map((p, idx) => {
                const maxSales = Math.max(...topProducts.map((tp) => Number(tp.sales || 1)), 1);
                const pct = Math.round((Number(p.sales || 0) / maxSales) * 100);
                return (
                  <div key={p.name || idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate">{p.name}</span>
                      <span className="text-slate-500 shrink-0 ml-2 font-bold">{p.sales} sold</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0a2560] via-[#65814e] to-[#997b47] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Performance: {pct}%</span>
                      <span className="font-semibold text-slate-700">₹{Number(p.revenue || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Moderate Reviews",
            href: "/admin/reviews",
            icon: Star,
            desc: "Approve customer ratings",
            cls: "bg-white border border-amber-200/70 text-slate-900 hover:border-amber-400",
            iconCls: "bg-amber-100 text-[#997b47]",
          },
          {
            label: "Product Catalog",
            href: "/admin/products",
            icon: Package,
            desc: "Manage fabrics & sizes",
            cls: "bg-white border border-slate-200 text-slate-900 hover:border-[#0a2560]",
            iconCls: "bg-[#0a2560]/10 text-[#0a2560]",
          },
          {
            label: "Orders Fulfilment",
            href: "/admin/orders",
            icon: ShoppingBag,
            desc: "Dispatch & tracking IDs",
            cls: "bg-white border border-slate-200 text-slate-900 hover:border-[#997b47]",
            iconCls: "bg-[#997b47]/10 text-[#997b47]",
          },
          {
            label: "Customer Base",
            href: "/admin/customers",
            icon: Users,
            desc: "View verified clients",
            cls: "bg-white border border-slate-200 text-slate-900 hover:border-slate-400",
            iconCls: "bg-slate-100 text-slate-700",
          },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className={`p-5 rounded-3xl shadow-soft-sm transition-all hover:shadow-soft hover:-translate-y-1 block ${a.cls}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${a.iconCls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-900">{a.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{a.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
