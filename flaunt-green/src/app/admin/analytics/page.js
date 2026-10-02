"use client";

import { BarChart2, TrendingUp, Users, ShoppingBag, ArrowUpRight, DollarSign, Calendar } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary flex items-center gap-2.5">
          <BarChart2 className="w-6 h-6 text-[#41542f]" />
          Analytics & Performance
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Detailed metrics, sales performance, and traffic insights for Flaunt Green.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: "3.42%", change: "+0.8%", icon: TrendingUp, color: "bg-[#41542f]" },
          { label: "Avg. Order Value", value: "₹4,120", change: "+14.2%", icon: DollarSign, color: "bg-[#997b47]" },
          { label: "Total Sessions", value: "18,450", change: "+22.5%", icon: Users, color: "bg-[#7694cc]" },
          { label: "Repeat Purchase Rate", value: "28.6%", change: "+3.1%", icon: ShoppingBag, color: "bg-[#ad9e85]" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">{item.label}</span>
                <div className={`w-8 h-8 rounded-xl ${item.color} text-white flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">{item.value}</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-6">
          <h3 className="font-heading font-bold text-base text-slate-800 mb-4">Traffic by Channel</h3>
          <div className="space-y-4">
            {[
              { channel: "Direct / Organic Search", pct: 48, visitors: "8,856" },
              { channel: "Instagram & Social Media", pct: 32, visitors: "5,904" },
              { channel: "Referral & Collaborations", pct: 14, visitors: "2,583" },
              { channel: "Email Newsletters", pct: 6, visitors: "1,107" },
            ].map((c) => (
              <div key={c.channel} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{c.channel}</span>
                  <span className="text-slate-400">{c.visitors} visits ({c.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#41542f] rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-6">
          <h3 className="font-heading font-bold text-base text-slate-800 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {[
              { device: "Mobile (iOS & Android)", pct: 76, color: "bg-[#41542f]" },
              { device: "Desktop & Laptop", pct: 21, color: "bg-[#997b47]" },
              { device: "Tablet", pct: 3, color: "bg-[#7694cc]" },
            ].map((d) => (
              <div key={d.device} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{d.device}</span>
                  <span className="text-slate-400">{d.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
