import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("flontgreen-cart");
            localStorage.removeItem("flontgreen-wishlist");
          } catch (e) {
            console.error("Storage clear error on logout:", e);
          }
        }
      },

      isAuthenticated: () => {
        const state = get();
        return Boolean(state.token && state.user);
      },

      isAdmin: () => get().user?.role === "admin",

      isCustomer: () => get().user?.role === "customer",
    }),
    {
      name: "flontgreen-auth",
    }
  )
);
