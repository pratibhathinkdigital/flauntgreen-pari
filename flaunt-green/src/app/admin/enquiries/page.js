"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  MailCheck,
  MailX,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  X,
  AlertCircle
} from "lucide-react";
import { enquiriesApi } from "@/services/api";
import AdminPagination from "@/components/admin/AdminPagination";
import toast from "react-hot-toast";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "unread" | "read"
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const PAGE_SIZE = 20;

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiriesApi.getAll();
      setEnquiries(res.data || []);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleToggleRead = async (enquiry, e) => {
    if (e) e.stopPropagation();
    try {
      const newStatus = !enquiry.is_read;
      await enquiriesApi.update(enquiry.id, { is_read: newStatus });
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === enquiry.id ? { ...item, is_read: newStatus } : item
        )
      );
      if (selectedEnquiry && selectedEnquiry.id === enquiry.id) {
        setSelectedEnquiry((prev) => ({ ...prev, is_read: newStatus }));
      }
      toast.success(newStatus ? "Marked as read" : "Marked as unread");
    } catch (err) {
      console.error(err);
      toast.error("Could not update enquiry status");
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      setActionLoading(true);
      await enquiriesApi.delete(id);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
      toast.success("Enquiry deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete enquiry");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDetail = async (enquiry) => {
    setSelectedEnquiry(enquiry);
    // Automatically mark as read if it was unread
    if (!enquiry.is_read) {
      try {
        await enquiriesApi.update(enquiry.id, { is_read: true });
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === enquiry.id ? { ...item, is_read: true } : item
          )
        );
        setSelectedEnquiry({ ...enquiry, is_read: true });
      } catch (err) {
        console.error("Auto mark read error:", err);
      }
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Copied ${field} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered enquiries
  const filtered = enquiries.filter((item) => {
    const matchFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "unread"
        ? !item.is_read
        : item.is_read;

    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.phone?.includes(q) ||
      item.subject?.toLowerCase().includes(q) ||
      item.message?.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  const totalCount = enquiries.length;
  const unreadCount = enquiries.filter((e) => !e.is_read).length;
  const readCount = enquiries.filter((e) => e.is_read).length;

  const paginatedEnquiries = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-[#41542f]" />
            Customer Enquiries
          </h1>
          <p className="text-sm text-text-muted mt-1">
            View, manage, and respond to incoming inquiries and contact messages.
          </p>
        </div>
        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#41542f]" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">Total Enquiries</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#41542f]/10 text-[#41542f] flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-amber-600">Unread Messages</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{unreadCount}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-emerald-600">Reviewed / Read</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{readCount}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject or message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#41542f] focus:ring-1 focus:ring-[#41542f]"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Messages", count: totalCount },
            { id: "unread", label: "Unread", count: unreadCount },
            { id: "read", label: "Read", count: readCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterStatus(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                filterStatus === tab.id
                  ? "bg-[#41542f] text-white border-[#41542f] shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterStatus === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#41542f] animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Loading enquiries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-slate-700">No enquiries found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search
                ? "No enquiries match your search query. Try another search term."
                : "No customer enquiries have been received yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedEnquiries.map((item) => {
              const isUnread = !item.is_read;
              const formattedDate = item.created_at
                ? new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—";

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-50/80 ${
                    isUnread ? "bg-amber-50/40 font-medium" : "bg-white"
                  }`}
                >
                  {/* Left: Sender & Preview */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                        isUnread
                          ? "bg-[#41542f] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm ${isUnread ? "font-bold text-slate-900" : "text-slate-800"}`}>
                          {item.name || "Anonymous"}
                        </span>
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                            New
                          </span>
                        )}
                        <span className="text-xs text-slate-400 hidden sm:inline">&bull;</span>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                          {item.email}
                        </span>
                        {item.phone && (
                          <>
                            <span className="text-xs text-slate-400 hidden sm:inline">&bull;</span>
                            <span className="text-xs text-slate-500">{item.phone}</span>
                          </>
                        )}
                      </div>

                      <h4 className={`text-sm mt-1 truncate ${isUnread ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                        {item.subject}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Right: Date & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title={isUnread ? "Mark as Read" : "Mark as Unread"}
                        onClick={(e) => handleToggleRead(item, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#41542f] hover:bg-slate-100 transition-colors"
                      >
                        {isUnread ? (
                          <MailCheck className="w-4 h-4" />
                        ) : (
                          <MailX className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        title="View Full Message"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#997b47] hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        title="Delete Enquiry"
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-100 shadow-soft-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#41542f]/10 text-[#41542f] font-bold text-lg flex items-center justify-center shrink-0">
                  {selectedEnquiry.name ? selectedEnquiry.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    {selectedEnquiry.name || "Anonymous Sender"}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {selectedEnquiry.created_at
                        ? new Date(selectedEnquiry.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Contact Metadata Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-600 truncate">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedEnquiry.email}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedEnquiry.email, "email")}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {selectedEnquiry.phone ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedEnquiry.phone}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedEnquiry.phone, "phone")}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title="Copy Phone"
                    >
                      {copiedField === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>No phone provided</span>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">Subject</p>
                <p className="text-base font-semibold text-slate-800 mt-1">
                  {selectedEnquiry.subject}
                </p>
              </div>

              {/* Message */}
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">Message Content</p>
                <div className="mt-2 p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(selectedEnquiry)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {selectedEnquiry.is_read ? (
                    <>
                      <MailX className="w-3.5 h-3.5" /> Mark Unread
                    </>
                  ) : (
                    <>
                      <MailCheck className="w-3.5 h-3.5 text-emerald-600" /> Mark Read
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(selectedEnquiry.id)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedEnquiry.phone && (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-white transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                )}
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344325] transition-all shadow-soft-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
