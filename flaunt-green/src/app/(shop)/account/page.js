import { Suspense } from "react";
import AccountDashboardClient from "./AccountDashboardClient";

export const metadata = {
  title: "My Account | Flaunt Green",
  description: "Manage your orders, wishlist, addresses and profile.",
};

export default function AccountDashboardPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-32 bg-slate-100 rounded-2xl"/><div className="h-24 bg-slate-100 rounded-2xl"/></div>}>
      <AccountDashboardClient />
    </Suspense>
  );
}
