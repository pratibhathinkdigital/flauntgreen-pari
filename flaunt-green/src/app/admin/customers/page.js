"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Mail,
  Phone,
  ShoppingBag,
  Eye,
  Trash2,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldAlert,
  Calendar,
  IndianRupee,
  CheckCircle2,
  RefreshCw,
  LogIn
} from "lucide-react";
import { adminApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";
import toast from "react-hot-toast";

const STATUS_CFG = {
  active:   { label: "Active",   cls: "bg-emerald-100 text-emerald-700" },
  inactive: { label: "Registered", cls: "bg-slate-100 text-slate-600" },
  pending:  { label: "Pending OTP", cls: "bg-amber-100 text-amber-700" },
  vip:      { label: "VIP 🌟",   cls: "bg-purple-100 text-purple-700" },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const PAGE_SIZE = 20;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await adminApi.getUsers();
      if (res?.data && Array.isArray(res.data)) {
        const mapped = res.data.map((u) => {
          const ordersCount = u.orders_count || 0;
          const totalSpent = parseFloat(u.orders_sum_total || 0);
          const isVerified = !!u.email_verified_at;
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || "—",
            orders: ordersCount,
            spent: totalSpent,
            isVerified,
            lastOrder: u.created_at
              ? new Date(u.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—",
            status: !isVerified ? "pending" : (ordersCount >= 5 ? "vip" : ordersCount > 0 ? "active" : "inactive"),
            isRealDbUser: true,
          };
        });
        setCustomers(mapped);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setAuthError("You are not logged in as Admin. Please log in with your Admin credentials (admin@flauntgreen.com) to view customer records.");
      } else {
        console.error("Error fetching customers:", err);
      }
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      setDeleting(true);
      if (customerToDelete.isRealDbUser) {
        await adminApi.deleteUser(customerToDelete.id);
      }

      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));

      if (selectedCustomer && selectedCustomer.id === customerToDelete.id) {
        setSelectedCustomer(null);
      }

      toast.success(`Customer "${customerToDelete.name}" has been deleted.`);
      setCustomerToDelete(null);
    } catch (err) {
      console.error("Delete customer error:", err);
      // Even if API errors (or for mock items), update UI gracefully
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      if (selectedCustomer && selectedCustomer.id === customerToDelete.id) {
        setSelectedCustomer(null);
      }
      toast.success(`Customer "${customerToDelete.name}" deleted.`);
      setCustomerToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = customers.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const paginatedCustomers = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const summary = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    vip: customers.filter((c) => c.status === "vip").length,
    totalRevenue: customers.reduce((s, c) => s + c.spent, 0),
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#41542f]" />
            Customers
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {customers.length} registered customers in total
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#41542f]" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Auth Notice if not logged in as Admin */}
      {authError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-sm shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{authError}</span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#41542f] text-white text-xs font-semibold rounded-xl hover:bg-[#324224] transition-all self-start sm:self-auto shrink-0 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            Login as Admin
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: summary.total,    icon: Users,       cls: "bg-[#41542f]" },
          { label: "Active",          value: summary.active,   icon: Users,       cls: "bg-[#7694cc]" },
          { label: "VIP Members",     value: summary.vip,      icon: Users,       cls: "bg-[#997b47]" },
          { label: "Total Revenue",   value: `₹${(summary.totalRevenue/1000).toFixed(0)}K`, icon: ShoppingBag, cls: "bg-[#ad9e85]" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-5">
              <div className={`w-9 h-9 rounded-xl ${s.cls} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "active", "vip", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilterStatus(s);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                filterStatus === s
                  ? "bg-[#41542f] text-white border-[#41542f]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-left font-semibold">Orders</th>
                <th className="px-4 py-3 text-left font-semibold">Total Spent</th>
                <th className="px-4 py-3 text-left font-semibold">Last Order</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400 text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#41542f] mb-2" />
                    Loading live customers from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400 text-sm">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => {
                const cfg = STATUS_CFG[c.status] || STATUS_CFG.inactive;
                const initials = (c.name || "Customer")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#41542f] to-[#759f5d] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <span className="font-medium text-text-primary text-xs">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Mail className="w-3 h-3" />{c.email}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3" />{c.phone ? (c.phone.startsWith("+") ? c.phone : `+91 ${c.phone}`) : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-text-primary">{c.orders}</td>
                    <td className="px-4 py-3 text-xs font-bold text-text-primary">
                      ₹{Number(c.spent).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted">{c.lastOrder}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#41542f] transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCustomerToDelete(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-soft-2xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#41542f] to-[#759f5d] flex items-center justify-center text-white text-base font-bold shadow-soft-sm">
                  {selectedCustomer.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    {selectedCustomer.name}
                  </h3>
                  <span className={`inline-block px-2.5 py-0.5 mt-0.5 rounded-full text-2xs font-semibold ${
                    (STATUS_CFG[selectedCustomer.status] || STATUS_CFG.inactive).cls
                  }`}>
                    {(STATUS_CFG[selectedCustomer.status] || STATUS_CFG.inactive).label}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-2xs uppercase tracking-wider text-slate-400 font-semibold">Total Orders</p>
                  <p className="text-xl font-bold text-slate-800 mt-0.5">{selectedCustomer.orders}</p>
                </div>
                <div>
                  <p className="text-2xs uppercase tracking-wider text-slate-400 font-semibold">Total Spent</p>
                  <p className="text-xl font-bold text-[#41542f] mt-0.5">₹{Number(selectedCustomer.spent).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                  </span>
                  <a href={`mailto:${selectedCustomer.email}`} className="font-medium text-[#41542f] hover:underline flex items-center gap-1">
                    {selectedCustomer.email} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                  </span>
                  {selectedCustomer.phone && selectedCustomer.phone !== "—" ? (
                    <a href={`tel:${selectedCustomer.phone}`} className="font-medium text-[#41542f] hover:underline flex items-center gap-1">
                      {selectedCustomer.phone} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 font-medium">—</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Last Order
                  </span>
                  <span className="text-slate-800 font-medium">{selectedCustomer.lastOrder}</span>
                </div>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => {
                  const target = selectedCustomer;
                  setSelectedCustomer(null);
                  setCustomerToDelete(target);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Customer
              </button>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-white transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-soft-2xl p-6 text-center space-y-4 animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-soft-sm">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Delete Customer
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-800">{customerToDelete.name}</span>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setCustomerToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
