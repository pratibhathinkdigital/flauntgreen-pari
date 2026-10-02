import { Suspense } from "react";
import OrdersClient from "./OrdersClient";

export const metadata = { title: "My Orders | Flaunt Green" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-20 bg-slate-100 rounded-2xl"/><div className="h-32 bg-slate-100 rounded-2xl"/><div className="h-32 bg-slate-100 rounded-2xl"/></div>}>
      <OrdersClient />
    </Suspense>
  );
}
