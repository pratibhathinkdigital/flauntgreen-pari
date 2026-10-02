"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, User, LogOut, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AdminHeader() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/admin/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 relative z-20">
      {/* Functional Search */}
      <form onSubmit={handleSearch} className="relative max-w-xs w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Search products by title/SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0c2c6d] focus:ring-1 focus:ring-[#0c2c6d] bg-slate-50/50"
          id="admin-search-input"
        />
      </form>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative" 
            aria-label="Notifications" 
            id="admin-notifications-btn"
          >
            <Bell className="w-5 h-5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 text-left animate-scale-up z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications</span>
                <span className="text-[10px] text-[#0c2c6d] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-[#164bb5]" /> System Live
                </span>
              </div>
              <p className="text-xs text-slate-500 py-3 text-center">
                All order &amp; refund webhooks are functioning smoothly.
              </p>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0c2c6d] to-[#164bb5] flex items-center justify-center text-white font-bold text-sm shadow-soft-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-900 leading-none">
              {user?.name || "Administrator"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {user?.email || "admin@flauntgreen.com"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
