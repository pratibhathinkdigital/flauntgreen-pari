import api from "@/lib/axios";

// ── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: (params) => api.get("/products", { params }),
  getOne: (slug)   => api.get(`/products/${slug}`),
  getFeatured: ()  => api.get("/products?featured=true"),
  search: (query)  => api.get(`/products?search=${query}`),
  // Admin endpoints
  adminGetAll: (params) => api.get("/admin/products", { params }),
  create: (data)   => api.post("/admin/products", data, {
    headers: { 'Content-Type': 'multipart/form-data' } // Important for image uploads
  }),
  update: (id, data) => api.post(`/admin/products/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id)       => api.delete(`/admin/products/${id}`),
  toggleStatus: (id) => api.patch(`/admin/products/${id}/toggle-status`),
  toggleFeatured: (id) => api.patch(`/admin/products/${id}/toggle-featured`),
};

// ── Categories ────────────────────────────────────────────────────────────────

export const categoriesApi = {
  getAll: ()           => api.get("/categories"),
  getOne: (slug)       => api.get(`/categories/${slug}`),
  // Admin endpoints
  adminGetAll: ()      => api.get("/admin/categories"),
  create: (data)       => api.post("/admin/categories", data),
  update: (id, data)   => api.put(`/admin/categories/${id}`, data),
  delete: (id)         => api.delete(`/admin/categories/${id}`),
};

// ── Collections ───────────────────────────────────────────────────────────────

export const collectionsApi = {
  getAll: ()           => api.get("/collections"),
  getOne: (slug)       => api.get(`/collections/${slug}`),
  // Admin endpoints
  adminGetAll: ()      => api.get("/admin/collections"),
  create: (data)       => api.post("/admin/collections", data),
  update: (id, data)   => api.put(`/admin/collections/${id}`, data),
  delete: (id)         => api.delete(`/admin/collections/${id}`),
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login:        (data) => api.post("/auth/login", data),
  register:     (data) => api.post("/auth/register", data),
  verifyOtp:    (data) => api.post("/auth/verify-otp", data),
  resendOtp:    (data) => api.post("/auth/resend-otp", data),
  logout:       ()     => api.post("/auth/logout"),
  getMe:        ()     => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword:  (data)  => api.post("/auth/reset-password", data),
  googleAuth:     ()      => api.get("/auth/google"),
};

// ── User Profile ────────────────────────────────────────────────────────────────

export const userApi = {
  updateProfile:  (data) => api.put("/user/profile", data),
  changePassword: (data) => api.put("/user/change-password", data),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersApi = {
  getMyOrders: (params)   => api.get("/orders/my-orders", { params }),
  getOne:      (id)        => api.get(`/orders/${id}`),
  create:      (data)      => api.post("/orders", data),
  cancel:      (id, data)  => api.put(`/orders/${id}/cancel`, data),
  // Admin
  getAll:      (params)    => api.get("/orders", { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// ── Cart / Wishlist ───────────────────────────────────────────────────────────

export const cartApi = {
  sync: (items) => api.post("/cart/sync", { items }),
};

export const wishlistApi = {
  toggle: (productId) => api.post("/wishlist/toggle", { productId }),
  getAll: ()          => api.get("/wishlist"),
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export const reviewsApi = {
  // Public
  getByProduct: (product_slug, params) => api.get("/reviews", { params: { product_slug, ...params } }),
  submit: (data) => api.post("/reviews", data),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  // Admin
  adminGetAll: (params) => api.get("/admin/reviews", { params }),
  updateStatus: (id, status) => api.patch(`/admin/reviews/${id}/status`, { status }),
  delete: (id) => api.delete(`/admin/reviews/${id}`),
};

// ── Testimonials ─────────────────────────────────────────────────────────────

export const testimonialsApi = {
  getByPage: (page) => api.get("/testimonials", { params: { page } }),
  adminGetAll: (params) => api.get("/admin/testimonials", { params }),
  create: (data) => api.post("/admin/testimonials", data),
  update: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  toggleActive: (id) => api.patch(`/admin/testimonials/${id}/toggle-active`),
  delete: (id) => api.delete(`/admin/testimonials/${id}`),
};

// ── Addresses ─────────────────────────────────────────────────────────────────

export const addressesApi = {
  getAll:  ()         => api.get("/user/addresses"),
  create:  (data)     => api.post("/user/addresses", data),
  update:  (id, data) => api.put(`/user/addresses/${id}`, data),
  delete:  (id)       => api.delete(`/user/addresses/${id}`),
};

// ── Payments ──────────────────────────────────────────────────────────────────

export const paymentsApi = {
  createIntent: (data)    => api.post("/payments/create-intent", data),
  verifyPayment: (data)   => api.post("/payments/verify", data),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboardStats: () => api.get("/admin/stats"),
  getUsers:    (params)  => api.get("/admin/users", { params }),
  updateUser:  (id, data)=> api.put(`/admin/users/${id}`, data),
  deleteUser:  (id)      => api.delete(`/admin/users/${id}`),
};

// ── Journal ───────────────────────────────────────────────────────────────────

export const journalApi = {
  // Public
  getAll:    (params)    => api.get("/journals", { params }),
  getOne:    (slug)      => api.get(`/journals/${slug}`),
  // Admin
  adminGetAll: ()        => api.get("/admin/journals"),
  create:    (data)      => api.post("/admin/journals", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update:    (id, data)  => api.post(`/admin/journals/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete:    (id)        => api.delete(`/admin/journals/${id}`),
};

// ── Coupons & Marketing ───────────────────────────────────────────────────────

export const couponsApi = {
  validate:       (code, subtotal) => api.post("/coupons/validate", { code, subtotal }),
  adminGetAll:    ()               => api.get("/admin/coupons"),
  adminCreate:    (data)           => api.post("/admin/coupons", data),
  adminUpdate:    (id, data)       => api.put(`/admin/coupons/${id}`, data),
  adminDelete:    (id)             => api.delete(`/admin/coupons/${id}`),
  adminSendEmail: (id, data)       => api.post(`/admin/coupons/${id}/send-email`, data),
};

// ── Contact & Enquiries ────────────────────────────────────────────────────────

export const contactApi = {
  send: (data) => api.post("/contact", data),
};

export const enquiriesApi = {
  getAll: (params) => api.get("/admin/enquiries", { params }),
  getOne: (id) => api.get(`/admin/enquiries/${id}`),
  update: (id, data) => api.put(`/admin/enquiries/${id}`, data),
  delete: (id) => api.delete(`/admin/enquiries/${id}`),
};

// ── Returns & Exchanges (Flaunt Green Policy) ──────────────────────────────

export const returnsApi = {
  create:              (orderId, data)   => api.post(`/orders/${orderId}/return-request`, data),
  getForOrder:         (orderId)         => api.get(`/orders/${orderId}/return-request`),
  adminGetAll:         (params)          => api.get("/admin/returns", { params }),
  adminApprove:        (returnId, data)  => api.post(`/admin/returns/${returnId}/approve`, data),
  adminReject:         (returnId, data)  => api.post(`/admin/returns/${returnId}/reject`, data),
  adminRefund:         (returnId, data)  => api.post(`/admin/returns/${returnId}/refund`, data),
  adminReplacement:   (returnId, data)  => api.post(`/admin/returns/${returnId}/replacement`, data),
};

// ── Settings & SEO ─────────────────────────────────────────────────────────────

export const settingsApi = {
  getAll: () => api.get("/settings"),
  update: (data) => api.put("/admin/settings", data),
};

export const seoApi = {
  // Public
  getForRoute: (route) => api.get("/seo", { params: { route } }),
  // Admin
  adminGetAll: () => api.get("/admin/seo"),
  adminCreate: (data) => api.post("/admin/seo", data),
  adminUpdate: (id, data) => api.put(`/admin/seo/${id}`, data),
  adminDelete: (id) => api.delete(`/admin/seo/${id}`),
};
