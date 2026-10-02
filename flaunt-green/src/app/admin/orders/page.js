"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, ShoppingBag, Clock, Truck, CheckCircle, RotateCcw,
  Package, ChevronDown, Eye, Pencil, X, AlertCircle
} from "lucide-react";
import { ordersApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminOrderDetailModal from "@/components/admin/AdminOrderDetailModal";
import toast from "react-hot-toast";

const ORDERS = [
  { id: "FG-294821", customer: "Pratibha Sharma",  email: "pratibha@example.com",   date: "18 Sep 2026", status: "delivered",  total: 8499,  items: 2, payment: "Online" },
  { id: "FG-294715", customer: "Ananya Mehta",     email: "ananya@example.com",     date: "18 Sep 2026", status: "shipped",    total: 4200,  items: 1, payment: "Online" },
  { id: "FG-294600", customer: "Riya Kapoor",      email: "riya@example.com",       date: "17 Sep 2026", status: "processing", total: 6800,  items: 1, payment: "Online" },
  { id: "FG-294555", customer: "Meera Pillai",     email: "meera@example.com",      date: "17 Sep 2026", status: "placed",     total: 3200,  items: 1, payment: "COD" },
  { id: "FG-294490", customer: "Sneha Desai",      email: "sneha@example.com",      date: "16 Sep 2026", status: "delivered",  total: 1499,  items: 1, payment: "Online" },
  { id: "FG-294320", customer: "Kavita Nair",      email: "kavita@example.com",     date: "14 Sep 2026", status: "cancelled",  total: 5500,  items: 1, payment: "Online" },
  { id: "FG-294200", customer: "Divya Rao",        email: "divya@example.com",      date: "12 Sep 2026", status: "delivered",  total: 2999,  items: 2, payment: "COD" },
  { id: "FG-293900", customer: "Pooja Sharma",     email: "pooja@example.com",      date: "10 Sep 2026", status: "shipped",    total: 7200,  items: 1, payment: "Online" },
];

const STATUS_CFG = {
  placed:     { label: "Placed",     cls: "bg-blue-100 text-blue-700",      icon: Package },
  processing: { label: "Processing", cls: "bg-amber-100 text-amber-700",    icon: Clock },
  shipped:    { label: "Shipped",    cls: "bg-indigo-100 text-indigo-700",  icon: Truck },
  delivered:  { label: "Delivered",  cls: "bg-emerald-100 text-emerald-700",icon: CheckCircle },
  cancelled:  { label: "Cancelled",  cls: "bg-red-100 text-red-600",        icon: RotateCcw },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.placed;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <Icon className="w-3 h-3" />{cfg.label}
    </span>
  );
}

function StatusEditDropdown({ current, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#997b47] border border-slate-200 px-2 py-1.5 rounded-lg"
      >
        <Pencil className="w-3 h-3" /> <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 bg-white rounded-xl shadow-soft-lg border border-slate-100 py-1 min-w-[140px]">
          {Object.entries(STATUS_CFG).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { onSelect(key); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${current === key ? "font-bold text-[#41542f]" : "text-slate-600"}`}
            >
              <val.icon className="w-3 h-3" /> {val.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const PAGE_SIZE = 20;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getAll();
      const mapped = (res.data || []).map((o) => ({
        id: o.order_number || o.id,
        dbId: o.id,
        rawOrder: o,
        customer: o.shipping_name || o.user?.name || "Customer",
        email: o.user?.email || "N/A",
        phone: o.shipping_phone || o.user?.phone || "",
        date: new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        status: o.status,
        deliveredAt: o.delivered_at,
        returnStatus: o.return_status || (o.return_request ? o.return_request.status : "none"),
        returnRequest: o.return_request || o.returnRequest,
        total: parseFloat(o.total || 0),
        items: o.items ? o.items.length : 1,
        payment: o.payment_method === "cod" ? "COD" : "Online",
        paymentStatus: o.payment_status,
        address: o.shipping_address,
      }));
      setOrders(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, dbId, status) => {
    try {
      await ordersApi.updateStatus(dbId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  const filtered = orders.filter((o) => {
    let matchStatus = true;
    if (filterStatus === "returns") {
      matchStatus = !!o.returnRequest || (o.returnStatus && o.returnStatus !== "none");
    } else if (filterStatus !== "all") {
      matchStatus = o.status === filterStatus;
    }

    const matchPayment = filterPayment === "all" || o.payment.toLowerCase() === filterPayment.toLowerCase();
    const query = search.toLowerCase();
    const matchSearch =
      !search ||
      o.id.toString().toLowerCase().includes(query) ||
      o.customer.toLowerCase().includes(query) ||
      o.email.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query);

    return matchStatus && matchPayment && matchSearch;
  });

  const paginatedOrders = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const counts = Object.fromEntries(
    Object.keys(STATUS_CFG).map((s) => [s, orders.filter((o) => o.status === s).length])
  );
  const returnsCount = orders.filter((o) => o.returnRequest || (o.returnStatus && o.returnStatus !== "none")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Orders</h1>
          <p className="text-sm text-text-muted mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
        {[
          { key: "all", label: "All", count: orders.length },
          ...Object.entries(STATUS_CFG).map(([k, v]) => ({ key: k, label: v.label, count: counts[k] })),
          { key: "returns", label: "Returns 📦", count: returnsCount }
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => { setFilterStatus(s.key); setCurrentPage(1); }}
            className={`text-center p-3 rounded-xl border text-xs font-medium transition-all ${
              filterStatus === s.key
                ? s.key === "returns"
                  ? "bg-[#997b47] text-white border-[#997b47] shadow-brand"
                  : "bg-[#41542f] text-white border-[#41542f] shadow-brand"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-[10px] uppercase tracking-wide opacity-80 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search & Payment Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-soft-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPayment}
            onChange={(e) => { setFilterPayment(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#997b47] bg-white"
          >
            <option value="all">All Payment Methods</option>
            <option value="COD">COD</option>
            <option value="Online">Online</option>
          </select>

          {(search || filterStatus !== "all" || filterPayment !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
                setFilterPayment("all");
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 bg-slate-50/50">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">
                    No orders found matching filters.
                  </td>
                </tr>
              )}
              {paginatedOrders.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#997b47]">
                    #{o.id}
                    {o.returnRequest && (
                      <span className={`block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase w-fit ${
                        o.returnRequest.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        o.returnRequest.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        o.returnRequest.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Return: {o.returnRequest.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary text-xs">{o.customer}</p>
                    <p className="text-[11px] text-text-muted">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{o.date}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">{o.items} item{o.items > 1 ? "s" : ""}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      o.payment === "COD" ? "bg-slate-100 text-slate-600" : "bg-[#41542f]/10 text-[#41542f]"
                    }`}>
                      {o.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-text-primary">
                    ₹{o.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#41542f] transition-colors"
                        title="View Details & Returns"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <StatusEditDropdown current={o.status} onSelect={(s) => updateStatus(o.id, o.dbId, s)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 20 per page AdminPagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Admin Order & Return Management Modal */}
      <AdminOrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onRefresh={fetchOrders}
      />
    </div>
  );
}
