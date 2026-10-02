import DashboardSidebar from "@/components/layout/DashboardSidebar";

export const metadata = {
  title: "My Account | Flaunt Green",
};

export default function AccountLayout({ children }) {
  return (
    <div className="section container-site">
      <div className="flex gap-8">
        <DashboardSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
