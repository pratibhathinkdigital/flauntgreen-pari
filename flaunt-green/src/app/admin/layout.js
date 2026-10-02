import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader  from "@/components/admin/AdminHeader";
import AdminGuard   from "@/components/admin/AdminGuard";

export const metadata = {
  title: "Admin Dashboard | Flaunt Green",
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex flex-col lg:flex-row min-h-screen bg-surface-secondary">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
