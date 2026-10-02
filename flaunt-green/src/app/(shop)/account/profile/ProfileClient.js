"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Camera, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { userApi } from "@/services/api";
import toast from "react-hot-toast";

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#997b47]" />
        <h3 className="text-sm font-bold text-[#141b28]">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InputField({ label, id, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && !error && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] transition-all";
const inputErrCls = "w-full px-4 py-2.5 rounded-xl border border-red-400 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all";

export default function ProfileClient() {
  const [mounted, setMounted] = useState(false);
  const { user, setAuth } = useAuthStore();

  // Profile form
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form
  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdErrors, setPwdErrors] = useState({});
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      const parts = (user.name || "").split(" ");
      setProfile({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (!mounted) return null;

  const initials = [profile.firstName?.[0], profile.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "FG";

  // ── Profile Save ──────────────────────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.firstName.trim()) errs.firstName = "First name is required";
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      errs.email = "Valid email required";
    if (profile.phone && !/^[6-9]\d{9}$/.test(profile.phone.replace(/[^0-9]/g, "")))
      errs.phone = "Enter a valid 10-digit mobile number";
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingProfile(true);
    try {
      const res = await userApi.updateProfile({
        name: `${profile.firstName.trim()} ${profile.lastName.trim()}`.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
      });
      
      setAuth(res.data.user, useAuthStore.getState().token);
      setProfileSaved(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Password Save ─────────────────────────────────────────────────────────────
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.current) errs.current = "Current password is required";
    if (!passwords.newPwd || passwords.newPwd.length < 8)
      errs.newPwd = "Password must be at least 8 characters";
    if (passwords.newPwd !== passwords.confirm)
      errs.confirm = "Passwords do not match";
    setPwdErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPwd(true);
    try {
      await userApi.changePassword({
        current_password: passwords.current,
        new_password: passwords.newPwd,
        new_password_confirmation: passwords.confirm
      });
      toast.success("Password changed successfully!");
      setPasswords({ current: "", newPwd: "", confirm: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1
          className="text-2xl font-bold text-[#141b28]"
          style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
        >
          Profile Settings
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your personal information and account security</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-5 flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#41542f] to-[#27321c] flex items-center justify-center text-white text-xl font-bold shadow-brand">
            {initials}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#997b47] rounded-lg flex items-center justify-center text-white shadow-gold hover:bg-[#836838] transition-colors">
            <Camera className="w-3 h-3" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-[#141b28]">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-xs text-slate-400">{profile.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-[#41542f]/10 text-[#41542f] rounded-full">
            Conscious Member
          </span>
        </div>
      </div>

      {/* Personal Info Form */}
      <SectionCard title="Personal Information" icon={User}>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="First Name" id="firstName" required error={profileErrors.firstName}>
              <input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                placeholder="e.g. Pratibha"
                className={profileErrors.firstName ? inputErrCls : inputCls}
              />
            </InputField>

            <InputField label="Last Name" id="lastName">
              <input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                placeholder="e.g. Sharma"
                className={inputCls}
              />
            </InputField>
          </div>

          <InputField label="Email Address" id="email" required error={profileErrors.email}
            hint="Order receipts and updates are sent here.">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={`${profileErrors.email ? inputErrCls : inputCls} pl-10`}
              />
            </div>
          </InputField>

          <InputField label="Mobile Number" id="phone" error={profileErrors.phone}
            hint="For delivery OTPs and order updates.">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">+91</span>
              <Phone className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="phone"
                type="tel"
                maxLength={10}
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
                placeholder="9876543210"
                className={`${profileErrors.phone ? inputErrCls : inputCls} pl-16`}
              />
            </div>
          </InputField>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#997b47] text-white text-sm font-semibold hover:bg-[#836838] transition-colors disabled:opacity-60 shadow-gold"
            >
              {savingProfile ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving...</>
              ) : profileSaved ? (
                <><Check className="w-4 h-4" />Saved!</>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Password Change Form */}
      <SectionCard title="Change Password" icon={Lock}>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <InputField label="Current Password" id="currentPwd" required error={pwdErrors.current}>
            <div className="relative">
              <input
                id="currentPwd"
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                placeholder="Enter your current password"
                className={`${pwdErrors.current ? inputErrCls : inputCls} pr-11`}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#997b47]">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </InputField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="New Password" id="newPwd" required error={pwdErrors.newPwd}
              hint="Minimum 8 characters">
              <div className="relative">
                <input
                  id="newPwd"
                  type={showNew ? "text" : "password"}
                  value={passwords.newPwd}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPwd: e.target.value }))}
                  placeholder="Create a strong password"
                  className={`${pwdErrors.newPwd ? inputErrCls : inputCls} pr-11`}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#997b47]">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </InputField>

            <InputField label="Confirm New Password" id="confirmPwd" required error={pwdErrors.confirm}>
              <div className="relative">
                <input
                  id="confirmPwd"
                  type={showConfirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="Repeat new password"
                  className={`${pwdErrors.confirm ? inputErrCls : inputCls} pr-11`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#997b47]">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </InputField>
          </div>

          {/* Password Strength */}
          {passwords.newPwd && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => {
                  const strength = passwords.newPwd.length >= 8 && /[A-Z]/.test(passwords.newPwd)
                    ? 4 : passwords.newPwd.length >= 8 ? 3
                    : passwords.newPwd.length >= 6 ? 2 : 1;
                  return (
                    <div key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        level <= strength
                          ? strength >= 4 ? "bg-emerald-500"
                          : strength >= 3 ? "bg-[#41542f]"
                          : strength >= 2 ? "bg-amber-400" : "bg-red-400"
                          : "bg-slate-200"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">
                {passwords.newPwd.length < 6 ? "Too short" :
                 passwords.newPwd.length < 8 ? "Weak" :
                 /[A-Z]/.test(passwords.newPwd) ? "Strong" : "Good"}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPwd}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#41542f] text-white text-sm font-semibold hover:bg-[#344326] transition-colors disabled:opacity-60 shadow-brand"
            >
              {savingPwd ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Updating...</>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
        <h3 className="text-sm font-bold text-red-700 mb-1">Danger Zone</h3>
        <p className="text-xs text-red-600 mb-3">Once you delete your account, all data is permanently removed. This action cannot be undone.</p>
        <button className="text-xs px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-100 transition-colors font-medium">
          Delete My Account
        </button>
      </div>
    </div>
  );
}
