import { Suspense } from "react";
import AddressesClient from "./AddressesClient";

export const metadata = { title: "My Addresses | Flaunt Green" };

export default function AddressesPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-16 bg-slate-100 rounded-2xl"/><div className="h-40 bg-slate-100 rounded-2xl"/></div>}>
      <AddressesClient />
    </Suspense>
  );
}
