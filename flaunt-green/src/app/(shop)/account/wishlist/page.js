import { Suspense } from "react";
import WishlistClient from "./WishlistClient";

export const metadata = { title: "My Wishlist | Flaunt Green" };

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-16 bg-slate-100 rounded-2xl"/><div className="h-40 bg-slate-100 rounded-2xl"/></div>}>
      <WishlistClient />
    </Suspense>
  );
}
