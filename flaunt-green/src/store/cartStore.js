import { create } from "zustand";
import { persist }  from "zustand/middleware";
import toast from "react-hot-toast";
import { productsApi } from "@/services/api";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Adds a product variant. Enforces variant stock limit
      addItem: (product, quantity = 1) => {
        let warning = "";
        set((state) => {
          // Unique key: product_id + size + color_name
          const key = `${product.product_id}-${product.size || ""}-${product.color || ""}`;
          const existing = state.items.find((i) => i._cartKey === key);
          const maxStock = product.stock !== undefined 
            ? Number(product.stock) 
            : (existing?.stock !== undefined ? Number(existing.stock) : Infinity);

          if (existing) {
            const currentQty = existing.quantity;
            if (currentQty >= maxStock) {
              warning = `Only ${maxStock} unit(s) available in stock.`;
              return state;
            }

            const targetQty = currentQty + quantity;
            const newQty = Math.min(targetQty, maxStock);
            if (targetQty > maxStock) {
              warning = `Only ${maxStock} unit(s) available in stock. Added ${newQty - currentQty} more.`;
            }

            return {
              items: state.items.map((i) =>
                i._cartKey === key
                  ? { ...i, ...product, stock: maxStock, quantity: newQty }
                  : i
              ),
            };
          }

          const initialQty = Math.min(quantity, maxStock);
          if (quantity > maxStock) {
            warning = `Only ${maxStock} unit(s) available in stock.`;
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                stock: maxStock,
                _cartKey: key,
                quantity: initialQty,
              },
            ],
          };
        });

        if (warning) {
          toast.error(warning);
        }
      },

      removeItem: (cartKeyOrId) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              i._cartKey !== cartKeyOrId &&
              i.product_id !== cartKeyOrId &&
              i.id !== cartKeyOrId &&
              i._id !== cartKeyOrId
          ),
        }));
      },

      // Update quantity with stock boundary check
      updateQuantity: (cartKeyOrId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKeyOrId);
          return;
        }

        let stockExceeded = false;
        let limitStock = 0;

        set((state) => {
          return {
            items: state.items.map((i) => {
              if (
                i._cartKey === cartKeyOrId ||
                i.product_id === cartKeyOrId ||
                i.id === cartKeyOrId ||
                i._id === cartKeyOrId
              ) {
                const maxStock = i.stock !== undefined ? Number(i.stock) : Infinity;
                if (quantity > maxStock) {
                  stockExceeded = true;
                  limitStock = maxStock;
                  return { ...i, quantity: maxStock };
                }
                return { ...i, quantity };
              }
              return i;
            }),
          };
        });

        if (stockExceeded) {
          toast.error(`Only ${limitStock} item(s) available in stock.`);
        }
      },

      // Synchronize current cart items with latest backend variant stock
      syncStockWithBackend: async () => {
        try {
          const res = await productsApi.getAll();
          const allProducts = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          if (!allProducts || allProducts.length === 0) return;

          let adjustedCount = 0;

          set((state) => {
            const updatedItems = state.items.map((item) => {
              // Find matching product by id or slug
              const backendProduct = allProducts.find(
                (p) => String(p.id) === String(item.product_id) || p.slug === item.product_id || p.slug === item.slug
              );

              if (!backendProduct || !backendProduct.variants) {
                return item;
              }

              // Find matching variant by size and color
              const variant = backendProduct.variants.find(
                (v) =>
                  (!item.size || v.size.toLowerCase() === item.size.toLowerCase()) &&
                  (!item.color || !v.color_name || v.color_name.toLowerCase() === item.color.toLowerCase())
              ) || backendProduct.variants.find((v) => !item.size || v.size.toLowerCase() === item.size.toLowerCase())
                || backendProduct.variants[0];

              if (!variant) return item;

              const backendStock = Number(variant.stock ?? 0);
              let newQuantity = item.quantity;

              if (newQuantity > backendStock) {
                adjustedCount++;
                newQuantity = Math.max(1, backendStock);
              }

              return {
                ...item,
                stock: backendStock,
                quantity: newQuantity,
              };
            });

            return { items: updatedItems };
          });

          if (adjustedCount > 0) {
            toast.error("Cart quantity adjusted to available stock.");
          }
        } catch (err) {
          console.error("Failed to sync cart stock with backend:", err);
        }
      },

      appliedCoupon: null,
      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),

      clearCart: () => set({ items: [], appliedCoupon: null }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0),
    }),
    {
      name: "flontgreen-cart",
    }
  )
);
