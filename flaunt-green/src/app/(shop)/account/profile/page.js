import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export const metadata = { title: "Profile Settings | Flaunt Green" };

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4"><div className="h-24 bg-slate-100 rounded-2xl"/><div className="h-64 bg-slate-100 rounded-2xl"/></div>}>
      <ProfileClient />
    </Suspense>
  );
}
