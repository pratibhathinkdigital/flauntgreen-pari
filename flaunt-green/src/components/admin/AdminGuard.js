"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ShieldAlert, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!token || !user) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/account");
    }
  }, [mounted, user, token, router]);

  // Loading state while checking authentication
  if (!mounted || !token || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-[#1C2A3A] p-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#0c2c6d] animate-spin" />
          <p className="text-sm font-medium text-stone-600">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  // Not an admin
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-[#1C2A3A] p-4 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#141b28]">
            Access Denied
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            You do not have permission to view the administrative panel. You are being redirected to your customer dashboard.
          </p>
          <div className="pt-2">
            <Link
              href="/account"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#0c2c6d] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Go to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
