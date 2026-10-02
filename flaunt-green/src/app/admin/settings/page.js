"use client";

import { useState, useEffect } from "react";
import { Settings, Store, Mail, Phone, MapPin, ShieldCheck, Save, Bell, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { settingsApi } from "@/services/api";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("Flaunt Green");
  const [supportEmail, setSupportEmail] = useState("support@flauntgreen.in");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [storeAddress, setStoreAddress] = useState("Jaipur, Rajasthan, India");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsApi.getAll();
      if (res.data) {
        if (res.data.store_name) setStoreName(res.data.store_name);
        if (res.data.support_email) setSupportEmail(res.data.support_email);
        if (res.data.support_phone) setSupportPhone(res.data.support_phone);
        if (res.data.store_address) setStoreAddress(res.data.store_address);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsApi.update({
        store_name: storeName,
        support_email: supportEmail,
        support_phone: supportPhone,
        store_address: storeAddress,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#41542f]" />
          Store Settings
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Configure general store preferences, contact details, and notification rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-6 space-y-5">
          <h3 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#41542f]" /> General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Store Location / Origin
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-sm font-semibold hover:bg-[#344325] transition-all shadow-soft-sm"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
