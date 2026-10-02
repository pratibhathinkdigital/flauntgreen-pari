"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  Tag,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Check,
  HelpCircle,
  AlertCircle,
  Leaf,
  ChevronDown,
  MapPin,
  Plus,
  Home,
  Briefcase,
  RefreshCw
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { ordersApi, paymentsApi, addressesApi, couponsApi } from "@/services/api";
import toast from "react-hot-toast";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Chandigarh",
  "Puducherry"
];

// Coupons are validated server-side via couponsApi.validate()


const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && typeof window.Razorpay === "function") {
      resolve(true);
      return;
    }
    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) {
      if (typeof window !== "undefined" && typeof window.Razorpay === "function") {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, totalPrice, clearCart, appliedCoupon: cartCoupon, applyCoupon, removeCoupon, syncStockWithBackend } = useCartStore();
  const { user } = useAuthStore();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    saveAddress: true,
    sameAsBilling: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddressLine1: "",
    billingAddressLine2: "",
    billingCity: "",
    billingState: "Maharashtra",
    billingPincode: "",
    notes: ""
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [shippingMethod, setShippingMethod] = useState("standard"); // 'standard' (free) or 'express' (150)
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' or 'cod'
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const selectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShowNewAddressForm(false);
    const names = (addr.full_name || "").trim().split(" ");
    setFormData((prev) => ({
      ...prev,
      firstName: names[0] || prev.firstName,
      lastName: names.slice(1).join(" ") || prev.lastName,
      phone: addr.phone || prev.phone,
      addressLine1: addr.address_line_1 || "",
      addressLine2: addr.address_line_2 || "",
      city: addr.city || "",
      state: addr.state || "Maharashtra",
      pincode: addr.postal_code || ""
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.addressLine1;
      delete next.city;
      delete next.state;
      delete next.pincode;
      delete next.firstName;
      delete next.lastName;
      delete next.phone;
      return next;
    });
  };

  useEffect(() => {
    setMounted(true);
    loadRazorpaySDK();
    syncStockWithBackend?.();
    // Guard: must be logged in to checkout
    const stored = localStorage.getItem("flontgreen-auth");
    const auth = stored ? JSON.parse(stored)?.state : null;
    if (!auth?.token) {
      router.replace("/login?redirect=/checkout");
      return;
    }
    if (auth.user) {
      setFormData((prev) => ({
        ...prev,
        email: auth.user.email || prev.email,
        phone: auth.user.phone || prev.phone,
        firstName: auth.user.name ? auth.user.name.split(" ")[0] : prev.firstName,
        lastName: auth.user.name ? auth.user.name.split(" ").slice(1).join(" ") : prev.lastName
      }));
    }

    if (cartCoupon) {
      setAppliedCoupon(cartCoupon);
    }

    // Load saved addresses for logged-in user
    const fetchSavedAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await addressesApi.getAll();
        const list = res.data || [];
        setSavedAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.is_default) || list[0];
          selectAddress(defaultAddr);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error("Failed to load saved addresses:", err);
        setShowNewAddressForm(true);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchSavedAddresses();
  }, [cartCoupon]);

  if (!mounted) return null;

  // Price calculations
  const subtotal = totalPrice();
  const shippingFee = shippingMethod === "express" ? 150 : 0;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === "fixed") {
      discountAmount = appliedCoupon.value;
    }
  }
  discountAmount = Math.min(discountAmount, subtotal);
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Coupon apply
  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    setCouponError("");
    const cleaned = couponInput.trim().toUpperCase();
    if (!cleaned) return;

    setCouponLoading(true);
    try {
      const res = await couponsApi.validate(cleaned, subtotal);
      if (res.data?.valid) {
        setAppliedCoupon(res.data.coupon);
        applyCoupon(res.data.coupon);
        setCouponInput("");
        toast.success(`Promo code applied: ${res.data.coupon.label}`);
      } else {
        setCouponError(res.data?.message || "Invalid promo code");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid promo code or order requirements not met.";
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    removeCoupon();
    setCouponError("");
    toast.success("Promo code removed.");
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Street address is required";
    } else if (/(p\.?o\.?\s*box|post\s*office\s*box|apo|fpo)/i.test(formData.addressLine1)) {
      newErrors.addressLine1 = "Orders cannot be shipped to PO boxes or military addresses as per our Shipping Policy.";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit PIN code";
    }

    if (!formData.sameAsBilling) {
      if (!formData.billingFirstName.trim()) newErrors.billingFirstName = "Billing first name is required";
      if (!formData.billingLastName.trim()) newErrors.billingLastName = "Billing last name is required";
      if (!formData.billingAddressLine1.trim()) newErrors.billingAddressLine1 = "Billing address is required";
      if (!formData.billingCity.trim()) newErrors.billingCity = "Billing city is required";
      if (!formData.billingPincode || !/^\d{6}$/.test(formData.billingPincode.trim())) {
        newErrors.billingPincode = "Enter a valid 6-digit billing PIN code";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Place Order Handler — Razorpay Integration
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      setTermsError(true);
      toast.error("Please accept the Terms and Conditions before placing your order.");
      document.getElementById("terms-and-conditions")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required shipping fields.");
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Guard: Ensure none of the cart items exceed available stock
    for (const item of items) {
      if (item.stock !== undefined && item.quantity > Number(item.stock)) {
        toast.error(`'${item.name}' has only ${item.stock} item(s) available in stock. Please adjust your cart.`);
        router.push("/cart");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const fullAddress = `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

      // If Cash on Delivery, save directly to orders table
      if (paymentMethod === "cod") {
        const orderPayload = {
          shipping_name: `${formData.firstName} ${formData.lastName}`,
          shipping_phone: formData.phone,
          shipping_address: fullAddress,
          subtotal: subtotal,
          shipping_cost: shippingFee,
          total: totalAmount,
          payment_method: "cod",
          coupon_code: appliedCoupon?.code || null,
          items: items.map((i) => ({
            product_id: i.product_id || null,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size || null,
            color: i.color || null,
            image: i.image || null,
          }))
        };

        const res = await ordersApi.create(orderPayload);
        const createdOrder = res.data?.order;

        const confirmedOrder = {
          orderNumber: createdOrder?.order_number || `FG-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          estimatedDelivery: `${new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} (8-14 Working Days)`,
          payload: {
            customer: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, phone: formData.phone },
            shipping_address: { first_name: formData.firstName, last_name: formData.lastName, address_line_1: formData.addressLine1, address_line_2: formData.addressLine2, city: formData.city, state: formData.state, pincode: formData.pincode },
            subtotal, shipping_fee: shippingFee, discount_amount: discountAmount, coupon_code: appliedCoupon?.code || null
          },
          items: [...items],
          total: totalAmount,
          paymentMethod: "Cash on Delivery"
        };

        setOrderConfirmed(confirmedOrder);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.success("Order placed successfully!");
        return;
      }

      // 1. Create Razorpay order via our backend
      let razorpayOrderData = null;
      let useRazorpay = false;

      try {
        const intentRes = await paymentsApi.createIntent({
          amount: totalAmount,
          currency: "INR",
          shipping_name: `${formData.firstName} ${formData.lastName}`,
          shipping_phone: formData.phone,
          shipping_address: fullAddress,
          shipping_cost: shippingFee,
          coupon_code: appliedCoupon?.code || null,
          items: items.map((i) => ({
            id: i.product_id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size || null,
            color: i.color || null,
            image: i.image || null,
          })),
        });

        if (intentRes.data) {
          razorpayOrderData = intentRes.data;
          useRazorpay = true;
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to initialize payment.");
        setIsSubmitting(false);
        return;
      }

      if (useRazorpay && razorpayOrderData?.id) {
        // Ensure Razorpay SDK is loaded
        const isLoaded = await loadRazorpaySDK();
        if (!isLoaded || typeof window.Razorpay !== "function") {
          toast.error("Unable to load Razorpay payment gateway. Please check your internet connection.");
          setIsSubmitting(false);
          return;
        }

        // 2. Open Razorpay Checkout Modal
        try {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: razorpayOrderData.amount,
            currency: razorpayOrderData.currency,
            name: "Flaunt Green",
            description: `Order #${razorpayOrderData.db_order_id}`,
            order_id: razorpayOrderData.id,
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: `+91${formData.phone}`
            },
            theme: { color: "#41542f" },
            handler: async (response) => {
              // 3. Verify payment on backend
              try {
                const verifyRes = await paymentsApi.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });

                if (verifyRes.data?.success) {
                  const confirmedOrder = {
                    orderNumber: verifyRes.data?.order_number || `FG-${razorpayOrderData.db_order_id || Math.floor(100000 + Math.random() * 900000)}`,
                    createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                    estimatedDelivery: `${new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} (8-14 Working Days)`,
                    payload: {
                      customer: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, phone: formData.phone },
                      shipping_address: { first_name: formData.firstName, last_name: formData.lastName, address_line_1: formData.addressLine1, address_line_2: formData.addressLine2, city: formData.city, state: formData.state, pincode: formData.pincode },
                      subtotal, shipping_fee: shippingFee, discount_amount: discountAmount, coupon_code: appliedCoupon?.code || null
                    },
                    items: [...items],
                    total: totalAmount,
                    paymentMethod: "Online Payment (Paid)"
                  };

                  setOrderConfirmed(confirmedOrder);
                  clearCart();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  toast.success("Payment successful! Order confirmed.");
                } else {
                  toast.error("Payment verification failed. Please contact support.");
                }
              } catch (verifyErr) {
                toast.error("Failed to verify payment. Please contact support.");
              }
              setIsSubmitting(false);
            },
            modal: {
              ondismiss: () => {
                toast.error("Payment cancelled.");
                setIsSubmitting(false);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", function (response) {
            console.error("Razorpay payment failed:", response.error);
            toast.error(response.error?.description || "Payment failed. Please try again.");
            setIsSubmitting(false);
          });
          rzp.open();
          return; // Don't run finally block until handler completes
        } catch (modalErr) {
          console.error("Error opening Razorpay modal:", modalErr);
          toast.error("Failed to initialize Razorpay checkout.");
          setIsSubmitting(false);
          return;
        }
      } else {
        toast.error("Unable to process order. Please try again or select Cash on Delivery.");
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error(err.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SUCCESS / CONFIRMATION SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Top Brand & Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#41542f]/10 text-[#41542f] rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-[#41542f]/5">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#997b47] mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Thank You For Shopping Consciously
            </span>
            <h1
              className="font-bold text-[#141b28] mb-2"
              style={{
                fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 5vw, 44px)"
              }}
            >
              Order Placed Successfully!
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              We&apos;ve sent a confirmation email to{" "}
              <strong className="text-[#141b28]">{orderConfirmed.payload.customer.email}</strong> with your order receipt.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden mb-6">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Order Reference</span>
                <span className="font-mono text-lg font-bold text-[#141b28]">
                  #{orderConfirmed.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Placed On</span>
                <span className="text-sm font-medium text-[#141b28]">{orderConfirmed.createdAt}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Estimated Delivery</span>
                <span className="text-sm font-medium text-[#41542f] flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> {orderConfirmed.estimatedDelivery}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Payment</span>
                <span className="text-sm font-semibold text-[#997b47]">
                  {orderConfirmed.paymentMethod}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="p-6 sm:p-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Ordered Items ({orderConfirmed.items.length})
              </h3>
              <div className="divide-y divide-slate-100 mb-6">
                {orderConfirmed.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-4">
                    <div className="w-14 h-16 relative bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image || item.images?.[0] || "/assets/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#141b28] truncate">{item.name}</h4>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ""} {item.color ? `• ${item.color}` : ""}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-[#141b28]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Price Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-amber-100/60 text-xs">
                  <span className="font-bold text-[#141b28] uppercase tracking-wider block mb-1">
                    Delivering To
                  </span>
                  <p className="font-semibold text-slate-800">
                    {orderConfirmed.payload.shipping_address.first_name}{" "}
                    {orderConfirmed.payload.shipping_address.last_name}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {orderConfirmed.payload.shipping_address.address_line_1},{" "}
                    {orderConfirmed.payload.shipping_address.address_line_2 && (
                      <>{orderConfirmed.payload.shipping_address.address_line_2}, </>
                    )}
                    {orderConfirmed.payload.shipping_address.city},{" "}
                    {orderConfirmed.payload.shipping_address.state} -{" "}
                    {orderConfirmed.payload.shipping_address.pincode}
                  </p>
                  <p className="text-slate-600 mt-1">Phone: {orderConfirmed.payload.customer.phone}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{orderConfirmed.payload.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>{orderConfirmed.payload.shipping_fee === 0 ? "Free" : `₹${orderConfirmed.payload.shipping_fee}`}</span>
                  </div>
                  {orderConfirmed.payload.discount_amount > 0 && (
                    <div className="flex justify-between text-[#41542f] font-medium">
                      <span>Discount ({orderConfirmed.payload.coupon_code})</span>
                      <span>-₹{orderConfirmed.payload.discount_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#141b28] pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span>₹{orderConfirmed.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="px-8 py-3.5 rounded-xl font-medium bg-[#997b47] text-white hover:bg-[#836838] transition-colors text-center text-sm shadow-gold"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="px-8 py-3.5 rounded-xl font-medium border border-slate-200 text-[#141b28] hover:bg-white transition-colors text-center text-sm"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EMPTY CART GUARD
  // ─────────────────────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-white">
        <div className="w-16 h-16 bg-[#f7ece6] rounded-full flex items-center justify-center text-[#997b47] mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1
          className="font-bold mb-3 text-[#141b28]"
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 4vw, 36px)"
          }}
        >
          Your Bag is Empty
        </h1>
        <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed">
          You don&apos;t have any conscious pieces in your cart yet. Explore our sustainable collection to begin checkout.
        </p>
        <Link
          href="/collections"
          className="px-8 py-3.5 rounded-xl font-medium bg-[#997b47] text-white hover:bg-[#836838] transition-colors text-sm shadow-gold"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN CHECKOUT FORM
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Checkout Minimal Top Bar */}
      <div className="bg-white border-b border-slate-100 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/FGLOGONEW.png"
              alt="Flaunt Green"
              width={140}
              height={54}
              className="w-auto h-9"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-[#41542f]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/cart" className="hover:text-[#141b28] flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Bag
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#141b28]">Checkout</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Customer Info, Shipping & Payment */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
              {/* STEP 1: Contact Information */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#41542f] text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2
                      className="font-bold text-xl text-[#141b28]"
                      style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "24px" }}
                    >
                      Contact Information
                    </h2>
                  </div>
                  {!user && (
                    <div className="text-xs text-slate-500">
                      Have an account?{" "}
                      <Link href="/login" className="text-[#997b47] hover:underline font-medium">
                        Log in
                      </Link>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.email
                          ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                          : "border-slate-200 focus:border-[#997b47] focus:ring-[#997b47]"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">We&apos;ll send order receipts to this address.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="phone">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
                        +91
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                          errors.phone
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                            : "border-slate-200 focus:border-[#997b47] focus:ring-[#997b47]"
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">For delivery status &amp; courier OTP.</p>
                  </div>
                </div>
              </div>

              {/* STEP 2: Shipping Address */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-[#41542f] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2
                    className="font-bold text-xl text-[#141b28]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "24px" }}
                  >
                    Shipping Address
                  </h2>
                </div>

                {/* Saved Addresses Option Selector */}
                {loadingAddresses ? (
                  <div className="flex items-center gap-2 py-4 mb-4 text-xs text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#41542f]" />
                    <span>Loading your saved addresses...</span>
                  </div>
                ) : savedAddresses.length > 0 ? (
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Saved Delivery Addresses ({savedAddresses.length}):
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (!showNewAddressForm) {
                            setShowNewAddressForm(true);
                            setSelectedAddressId("new");
                            setFormData((prev) => ({
                              ...prev,
                              addressLine1: "",
                              addressLine2: "",
                              city: "",
                              pincode: ""
                            }));
                          } else {
                            setShowNewAddressForm(false);
                            const def = savedAddresses.find((a) => a.is_default) || savedAddresses[0];
                            selectAddress(def);
                          }
                        }}
                        className="text-xs font-semibold text-[#41542f] hover:underline flex items-center gap-1"
                      >
                        {showNewAddressForm ? "← Select From Saved Addresses" : "+ Deliver to a New / Different Address"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id && !showNewAddressForm;
                        const LabelIcon = addr.type === "office" || addr.type === "work" ? Briefcase : Home;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => selectAddress(addr)}
                            className={`cursor-pointer rounded-2xl p-4 border transition-all text-left relative ${
                              isSelected
                                ? "border-[#41542f] bg-[#41542f]/5 ring-1 ring-[#41542f] shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-soft-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                  isSelected ? "bg-[#41542f] text-white" : "bg-slate-100 text-slate-600"
                                }`}>
                                  <LabelIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                  {addr.type || "Home"}
                                </span>
                              </div>
                              {addr.is_default && (
                                <span className="text-[10px] font-bold text-[#997b47] bg-[#997b47]/10 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-bold text-slate-900">{addr.full_name}</p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                              {addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ""}, {addr.city}, {addr.state} - {addr.postal_code}
                            </p>
                            <p className="text-xs text-slate-400 mt-1.5 font-mono">📞 +91 {addr.phone}</p>

                            <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-100/80">
                              <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                isSelected ? "border-[#41542f] bg-[#41542f] text-white" : "border-slate-300"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </span>
                              <span className={`text-xs font-semibold ${isSelected ? "text-[#41542f]" : "text-slate-600"}`}>
                                {isSelected ? "Delivering to this address (Auto-filled)" : "Deliver to this address"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="e.g. Pratibha"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                          errors.firstName
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                            : "border-slate-200 focus:border-[#997b47] focus:ring-[#997b47]"
                        }`}
                      />
                      {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="e.g. Sharma"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                          errors.lastName
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                            : "border-slate-200 focus:border-[#997b47] focus:ring-[#997b47]"
                        }`}
                      />
                      {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="addressLine1">
                      Street Address &amp; House/Flat No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="addressLine1"
                      name="addressLine1"
                      type="text"
                      placeholder="e.g. Flat 402, Green Valley Apartments"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.addressLine1
                          ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                          : "border-slate-200 focus:border-[#997b47] focus:ring-[#997b47]"
                      }`}
                    />
                    {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="addressLine2">
                      Apartment, Suite, Landmark (Optional)
                    </label>
                    <input
                      id="addressLine2"
                      name="addressLine2"
                      type="text"
                      placeholder="e.g. Near Lotus Park"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="city">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                          errors.city
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                            : "border-slate-200 focus:border-[#997b47] focus:ring-[#997b47]"
                        }`}
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="state">
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#997b47] focus:ring-1 focus:ring-[#997b47] appearance-none bg-white pr-8"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="pincode">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 400050"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                          errors.pincode
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                            : "border-slate-200 focus:border-[#997b47] focus:ring-[#997b47]"
                        }`}
                      />
                      {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="saveAddress"
                        checked={formData.saveAddress}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded text-[#41542f] focus:ring-[#41542f] border-slate-300"
                      />
                      <span className="text-xs text-slate-600">
                        Save this shipping address in my account for future orders
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* STEP 3: Shipping Method */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-[#41542f] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2
                    className="font-bold text-xl text-[#141b28]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "24px" }}
                  >
                    Delivery Method
                  </h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === "standard"
                        ? "border-[#41542f] bg-[#41542f]/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="w-4 h-4 text-[#41542f] focus:ring-[#41542f]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#141b28]">Standard Eco Delivery</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Leaf className="w-2.5 h-2.5" /> 100% Carbon Neutral
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Delivered in 4–6 business days in plastic-free packaging</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#41542f]">FREE</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === "express"
                        ? "border-[#41542f] bg-[#41542f]/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="w-4 h-4 text-[#41542f] focus:ring-[#41542f]"
                      />
                      <div>
                        <span className="text-sm font-bold text-[#141b28]">Express Handcrafted Dispatch</span>
                        <p className="text-xs text-slate-500 mt-0.5">Priority courier delivery in 1–2 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#141b28]">₹150.00</span>
                  </label>
                </div>
              </div>

              {/* STEP 4: Payment Method */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-7 h-7 rounded-full bg-[#41542f] text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2
                    className="font-bold text-xl text-[#141b28]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "24px" }}
                  >
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Online Payment */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-[#997b47] bg-[#997b47]/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")}
                          className="w-4 h-4 text-[#997b47] focus:ring-[#997b47]"
                        />
                        <div>
                          <span className="text-sm font-bold text-[#141b28]">Online Payment (Razorpay / Instant)</span>
                          <p className="text-xs text-slate-500 mt-0.5">
                            UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-[#997b47]" />
                    </div>

                    {paymentMethod === "online" && (
                      <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs text-slate-600 bg-white/70 p-3 rounded-lg">
                        <p className="flex items-center gap-1.5 text-[#41542f] font-medium">
                          <ShieldCheck className="w-4 h-4" /> 100% Encrypted &amp; Secure Checkout
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          You will be seamlessly connected to Razorpay to complete your UPI or card payment.
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Cash On Delivery */}
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#997b47] bg-[#997b47]/5 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="w-4 h-4 text-[#997b47] focus:ring-[#997b47]"
                        />
                        <div>
                          <span className="text-sm font-bold text-[#141b28]">Cash on Delivery (COD)</span>
                          <p className="text-xs text-slate-500 mt-0.5">Pay via cash or QR scanner upon delivery</p>
                        </div>
                      </div>
                      <Banknote className="w-5 h-5 text-slate-400" />
                    </div>
                  </label>
                </div>

                {/* Billing Address Toggle */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Billing Address
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="radio"
                        name="sameAsBilling"
                        checked={formData.sameAsBilling}
                        onChange={() => setFormData((p) => ({ ...p, sameAsBilling: true }))}
                        className="text-[#41542f] focus:ring-[#41542f]"
                      />
                      <span>Same as shipping address</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                      <input
                        type="radio"
                        name="sameAsBilling"
                        checked={!formData.sameAsBilling}
                        onChange={() => setFormData((p) => ({ ...p, sameAsBilling: false }))}
                        className="text-[#41542f] focus:ring-[#41542f]"
                      />
                      <span>Use a different billing address</span>
                    </label>
                  </div>

                  {!formData.sameAsBilling && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium mb-1">Billing First Name *</label>
                          <input
                            name="billingFirstName"
                            value={formData.billingFirstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">Billing Last Name *</label>
                          <input
                            name="billingLastName"
                            value={formData.billingLastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border bg-white text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Billing Address Line 1 *</label>
                        <input
                          name="billingAddressLine1"
                          value={formData.billingAddressLine1}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-lg border bg-white text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-medium mb-1">City *</label>
                          <input
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1">State *</label>
                          <select
                            name="billingState"
                            value={formData.billingState}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border bg-white text-xs"
                          >
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-medium mb-1">PIN Code *</label>
                          <input
                            name="billingPincode"
                            maxLength={6}
                            value={formData.billingPincode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary & Action */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="space-y-6 sticky top-8">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3
                    className="font-bold text-lg text-[#141b28]"
                    style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: "22px" }}
                  >
                    Order Summary ({items.length})
                  </h3>
                  <Link href="/cart" className="text-xs text-[#997b47] hover:underline font-medium">
                    Edit Bag
                  </Link>
                </div>

                {/* Cart items listing */}
                <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100 pr-1 mb-4">
                  {items.map((item) => (
                    <div key={item._id} className="py-3 flex gap-3 items-center">
                      <div className="w-14 h-16 relative bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={item.image || item.images?.[0] || "/assets/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1 rounded">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#141b28] uppercase truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• {item.color}</span>}
                        </div>
                        <div className="text-xs font-semibold text-[#141b28] mt-1">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="border-t border-slate-100 pt-4 mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-[#41542f]/10 px-3 py-2 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-[#41542f]">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="font-bold">{appliedCoupon.code}</span>
                        <span className="text-slate-600">(-₹{discountAmount.toLocaleString("en-IN")})</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 hover:text-red-700 font-medium underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. WELCOME10)"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError("");
                          }}
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#997b47] uppercase"
                        />
                        <button
                          type="submit"
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-4 py-2 rounded-xl bg-[#41542f] text-white text-xs font-semibold hover:bg-[#344325] transition-colors disabled:opacity-50 flex items-center gap-1 shadow-sm"
                        >
                          {couponLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-red-500 font-medium">{couponError}</p>}
                    </form>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4 mb-5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#141b28]">
                      ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-medium text-[#41542f]">
                      {shippingFee === 0 ? "🎉 Free Delivery" : `₹${shippingFee.toFixed(2)}`}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#41542f] font-medium">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Taxes (GST 12% included)</span>
                    <span>₹{Math.round(subtotal * 0.12).toLocaleString("en-IN")}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold text-[#141b28]">
                    <span>Total Amount</span>
                    <span className="text-lg text-[#141b28]">
                      ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="mb-4 pt-4 border-t border-slate-100">
                  <label
                    htmlFor="terms-and-conditions"
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                      termsError
                        ? "bg-red-50 border border-red-200 ring-2 ring-red-100"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="terms-and-conditions"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked) setTermsError(false);
                      }}
                      className="mt-0.5 w-4 h-4 text-[#41542f] rounded border-slate-300 focus:ring-[#41542f] cursor-pointer accent-[#41542f]"
                    />
                    <span className="text-[12px] text-slate-600 leading-snug select-none">
                      I have read and agree to Flaunt Green&apos;s{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="font-semibold text-[#41542f] underline hover:text-[#344325]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="font-semibold text-[#41542f] underline hover:text-[#344325]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                      <span className="text-red-500 ml-1 font-bold">*</span>
                    </span>
                  </label>
                  {termsError && (
                    <p className="text-[11px] text-red-500 font-medium mt-1 ml-2">
                      Please check this box to agree with the Terms and Conditions before placing your order.
                    </p>
                  )}
                </div>

                {/* Complete Order Button */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold bg-[#997b47] text-white hover:bg-[#836838] transition-all duration-200 shadow-gold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Place Order (₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-amber-100/70 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5 text-[#41542f] font-semibold">
                  <Leaf className="w-4 h-4 shrink-0" />
                  <span>100% Certified Organic &amp; Sustainable</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-[#997b47] shrink-0" />
                  <span>Safe, Carbon-Neutral Dispatch across India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#997b47] shrink-0" />
                  <span>48-Hour Size Exchange &amp; Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
