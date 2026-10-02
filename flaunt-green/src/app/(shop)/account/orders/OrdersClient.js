"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package, Truck, CheckCircle, Clock, RotateCcw, XCircle,
  ChevronDown, ChevronUp, Search, SlidersHorizontal, AlertCircle
} from "lucide-react";
import { ordersApi } from "@/services/api";
import ReturnRequestModal from "@/components/shop/ReturnRequestModal";
import ReturnStatusModal from "@/components/shop/ReturnStatusModal";
import CancelOrderModal from "@/components/shop/CancelOrderModal";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const STATUS_CONFIG = {
  placed:     { label: "Order Placed",  color: "bg-blue-100 text-blue-700",     icon: Package },
  processing: { label: "Processing",    color: "bg-amber-100 text-amber-700",   icon: Clock },
  shipped:    { label: "Shipped",       color: "bg-indigo-100 text-indigo-700", icon: Truck },
  delivered:  { label: "Delivered",     color: "bg-emerald-100 text-emerald-700",icon: CheckCircle },
  cancelled:  { label: "Cancelled",     color: "bg-red-100 text-red-600",       icon: RotateCcw },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function OrderCard({ order, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 48-hour return window calculation strictly based on verified delivered_at timestamp
  const isDelivered = order.status === "delivered";
  const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : null;
  const hoursSinceDelivery = deliveryDate ? (new Date() - deliveryDate) / (1000 * 60 * 60) : 0;
  const isWithin48Hours = deliveryDate ? hoursSinceDelivery <= 48 : true;
  const hasReturn = order.returnStatus && order.returnStatus !== "none";
  const isCancellable = ["placed", "processing", "pending"].includes(order.status?.toLowerCase());

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft-sm overflow-hidden">
      {/* Order Header */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-50">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <span className="font-mono text-xs text-slate-400 block">Order</span>
            <span className="font-mono text-sm font-bold text-[#997b47]">#{order.id}</span>
          </div>
          <div className="w-px h-8 bg-slate-100 hidden sm:block" />
          <div>
            <span className="text-xs text-slate-400 block">Placed on</span>
            <span className="text-sm text-[#141b28] font-medium">{order.date}</span>
          </div>
          <div className="w-px h-8 bg-slate-100 hidden sm:block" />
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-[#141b28]">
            ₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          {isCancellable && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-100 transition-colors flex items-center gap-1 shadow-soft-sm"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Order
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#997b47] transition-colors border border-slate-200 px-2.5 py-1.5 rounded-lg"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Hide</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> Details</>
            )}
          </button>
        </div>
      </div>

      {/* Items Preview (always visible) */}
      <div className="px-5 py-3 flex items-center gap-3">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="w-10 h-12 relative rounded-lg overflow-hidden border-2 border-white bg-slate-100 shadow-sm"
            >
              <Image src={item.image} alt={item.name} fill className="object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-10 h-12 rounded-lg bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500 font-bold">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#141b28] truncate">{order.items[0].name}</p>
          {order.items.length > 1 && (
            <p className="text-xs text-slate-400">and {order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}</p>
          )}
        </div>
        <span className="text-xs text-slate-400">{order.paymentMethod}</span>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-50 bg-[#FAF8F5] px-5 py-4 space-y-4">
          {/* Item List */}
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-14 relative rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover"
                    onError={(e) => { e.target.style.display = "none"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#141b28]">{item.name}</p>
                  <p className="text-xs text-slate-400">
                    Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#141b28]">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping & Order Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Delivered To</p>
              <p className="text-xs text-[#141b28] leading-relaxed">{order.shippingAddress}</p>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-[#41542f]">Free</span>
              </div>
              <div className="flex justify-between font-bold text-[#141b28] pt-1 border-t border-slate-200">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Visual Tracking Timeline */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Order Tracking</p>
            <div className="relative flex items-center justify-between w-full max-w-md mx-auto mb-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#41542f] rounded-full z-0 transition-all duration-500" 
                style={{ 
                  width: order.status === 'cancelled' ? '0%' : 
                         order.status === 'delivered' ? '100%' : 
                         order.status === 'shipped' ? '66%' : 
                         order.status === 'processing' ? '33%' : '0%' 
                }}
              ></div>
              
              {/* Placed */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${order.status !== 'cancelled' ? 'bg-[#41542f] border-[#41542f] text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold mt-1.5 text-slate-600">Placed</span>
              </div>

              {/* Processing */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-[#41542f] border-[#41542f] text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                  <Package className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold mt-1.5 text-slate-600">Processed</span>
              </div>

              {/* Shipped */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${['shipped', 'delivered'].includes(order.status) ? 'bg-[#41542f] border-[#41542f] text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold mt-1.5 text-slate-600">Shipped</span>
              </div>

              {/* Delivered */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${order.status === 'delivered' ? 'bg-[#41542f] border-[#41542f] text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold mt-1.5 text-slate-600">Delivered</span>
              </div>
            </div>
            {order.status === 'cancelled' && (
               <p className="text-center text-xs text-red-500 font-medium mt-3">This order has been cancelled.</p>
            )}
          </div>

          {/* Actions & Policy-Compliant Return Flow */}
          {isDelivered && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              {/* Return Status / Trigger Button */}
              {hasReturn ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    order.returnStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : order.returnStatus === 'rejected'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : order.returnStatus === 'refunded'
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : order.returnStatus === 'replacement_dispatched'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    Return: {
                      order.returnStatus === 'approved' ? 'Approved 📦 (Ship to Dadar)' :
                      order.returnStatus === 'rejected' ? 'Declined ❌' :
                      order.returnStatus === 'refunded' ? 'Refund Completed ✅' :
                      order.returnStatus === 'replacement_dispatched' ? 'Replacement Dispatched 🚚' :
                      'Under Review ⏳'
                    }
                  </span>
                  <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white transition-colors"
                  >
                    View Return Details
                  </button>
                </div>
              ) : isWithin48Hours ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsReturnModalOpen(true)}
                    className="text-xs px-3.5 py-2 rounded-xl bg-[#41542f] text-white hover:bg-[#344326] font-semibold transition-all flex items-center gap-1.5 shadow-soft-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Request Return / Exchange
                  </button>
                  <span className="text-[11px] text-slate-500">
                    (Within 48-hour slow-fashion policy window)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Return Window Closed (48 hrs policy limit exceeded)</span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors flex items-center gap-1.5">
                  Download Invoice
                </button>
                <Link
                  href={`/products/${order.items[0]?.product_slug || order.items[0]?.product?.slug || (order.items[0]?.name ? order.items[0].name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'shop')}`}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[#0c2c6d] bg-blue-50 font-semibold hover:bg-blue-100 transition-colors"
                >
                  Write a Review
                </Link>
              </div>
            </div>
          )}

          {/* Cancellable Actions for Placed/Processing Orders */}
          {isCancellable && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Order is being processed. You can cancel before dispatch.
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors flex items-center gap-1.5">
                  Download Invoice
                </button>
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="text-xs px-3.5 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-semibold transition-all flex items-center gap-1.5 shadow-soft-sm"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel Order
                </button>
              </div>
            </div>
          )}

          {order.status === "shipped" && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                 <span className="text-xs text-[#0c2c6d] bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#0c2c6d]" />
                  Your order is on the way.
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors flex items-center gap-1.5">
                  Download Invoice
                </button>
                <button className="text-xs px-3.5 py-2 rounded-xl bg-[#41542f] text-white hover:bg-[#344326] transition-colors font-semibold shadow-soft-sm">
                  Track Shipment
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Modal */}
      <CancelOrderModal
        order={order}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onSuccess={() => {
          onRefresh?.();
        }}
      />

      {/* Return Request Modal */}
      <ReturnRequestModal
        order={order}
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onSuccess={() => {
          onRefresh?.();
        }}
      />

      {/* Return Status & Shipping Instructions Modal */}
      <ReturnStatusModal
        order={order}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
}

export default function OrdersClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, token } = useAuthStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await ordersApi.getMyOrders();
      const mapped = (res.data || []).map(o => ({
        id: o.order_number || o.id,
        rawId: o.id,
        date: new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        status: o.status,
        deliveredAt: o.delivered_at,
        returnStatus: o.return_status || (o.return_request ? o.return_request.status : (o.returnRequest ? o.returnRequest.status : 'none')),
        returnRequest: o.return_request || o.returnRequest,
        total: parseFloat(o.total),
        shippingAddress: o.shipping_address,
        paymentMethod: o.payment_method === 'razorpay' ? 'Online Payment' : 'Cash on Delivery',
        rawPaymentMethod: o.payment_method,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        items: (o.items || []).map(i => ({
          name: i.name,
          size: i.size || 'ONE',
          color: i.color || 'N/A',
          qty: i.quantity,
          price: parseFloat(i.price),
          image: i.image || "/assets/placeholder.jpg"
        }))
      }));
      setOrders(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user) {
      router.replace("/login?redirect=/account/orders");
      return;
    }
    fetchOrders();
  }, [mounted, token, user, router]);

  if (!mounted || !token || !user) return null;

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = o.id.toString().toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-bold text-[#141b28]"
            style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif" }}
          >
            My Orders
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{orders.length} orders placed</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID or product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                filterStatus === s
                  ? "bg-[#0c2c6d] text-white border-[#0c2c6d] shadow-soft-xs font-semibold"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {s === "all" ? "All Orders" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-[#0c2c6d] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No orders found</p>
          <p className="text-slate-400 text-xs mt-1">Try a different search or filter</p>
          <Link
            href="/shop"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#0c2c6d] text-white text-xs font-semibold hover:bg-[#071d4a] transition-colors shadow-soft-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onRefresh={fetchOrders} />
          ))}
        </div>
      )}
    </div>
  );
}
