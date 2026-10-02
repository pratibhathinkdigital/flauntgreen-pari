import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// ── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Attach token from localStorage if available
    if (typeof window !== "undefined") {
      const auth = JSON.parse(localStorage.getItem("flontgreen-auth") || "{}");
      const token = auth?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // Token expired – clear auth and redirect to session expired page
      if (typeof window !== "undefined") {
        localStorage.removeItem("flontgreen-auth");
        const currentPath = window.location.pathname + window.location.search;
        if (!currentPath.includes("/login") && !currentPath.includes("/session-expired")) {
          window.location.href = `/session-expired?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    return Promise.reject(error);
  }
);

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
    : "http://localhost:8000");

export const getImageUrl = (path, fallback = "/placeholder.png") => {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  if (path.startsWith("/assets/") || path.startsWith("assets/")) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  if (cleanPath.startsWith("storage/")) {
    return `${BACKEND_URL}/${cleanPath}`;
  }
  return `${BACKEND_URL}/storage/${cleanPath}`;
};

export default api;
