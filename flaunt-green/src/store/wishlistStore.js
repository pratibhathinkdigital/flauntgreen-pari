import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // product: { id, name, price, slug, image, ... }
      toggleItem: (product) => {
        const prodId = product.id ?? product.product_id;
        const exists = get().items.find(
          (i) => (prodId && (i.id === prodId || i.product_id === prodId)) || (product.slug && i.slug === product.slug)
        );
        set((state) => ({
          items: exists
            ? state.items.filter(
                (i) =>
                  !(
                    (prodId && (i.id === prodId || i.product_id === prodId)) ||
                    (product.slug && i.slug === product.slug)
                  )
              )
            : [...state.items, { ...product, id: prodId, product_id: prodId }],
        }));
        return !exists; // returns true if added, false if removed
      },

      isWishlisted: (idOrSlug) =>
        get().items.some(
          (i) => i.id === idOrSlug || i.product_id === idOrSlug || (idOrSlug && i.slug === idOrSlug)
        ),

      removeItem: (idOrSlug) =>
        set((s) => ({
          items: s.items.filter(
            (i) => i.id !== idOrSlug && i.product_id !== idOrSlug && i.slug !== idOrSlug
          ),
        })),

      totalWishlist: () => get().items.length,

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "flontgreen-wishlist",
    }
  )
);
