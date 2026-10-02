/**
 * App-wide constants
 */

export const SITE_NAME = "Flaunt Green";
export const SITE_URL  = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const API_URL   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Pagination
export const DEFAULT_PAGE_SIZE = 12;

// Product sort options
export const SORT_OPTIONS = [
  { label: "Featured",     value: "featured" },
  { label: "Newest",       value: "-createdAt" },
  { label: "Price: Low → High", value: "price" },
  { label: "Price: High → Low", value: "-price" },
  { label: "Best Rated",   value: "-rating" },
  { label: "Most Reviews", value: "-reviewCount" },
];

// Order statuses
export const ORDER_STATUS = {
  PENDING:    "pending",
  CONFIRMED:  "confirmed",
  PROCESSING: "processing",
  SHIPPED:    "shipped",
  DELIVERED:  "delivered",
  CANCELLED:  "cancelled",
  REFUNDED:   "refunded",
};

export const ORDER_STATUS_COLORS = {
  pending:    "badge-warning",
  confirmed:  "badge-info",
  processing: "badge-info",
  shipped:    "badge-info",
  delivered:  "badge-success",
  cancelled:  "badge-danger",
  refunded:   "badge-neutral",
};

// Payment methods
export const PAYMENT_METHODS = [
  { label: "Credit / Debit Card", value: "card" },
  { label: "UPI",                 value: "upi" },
  { label: "Net Banking",         value: "netbanking" },
  { label: "Cash on Delivery",    value: "cod" },
];

// Indian states
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry",
];
