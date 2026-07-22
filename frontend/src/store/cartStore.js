// src/store/cartStore.js
// Zustand cart store with localStorage persistence

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // ── Actions ─────────────────────────────────────────────────

      /**
       * Add a product to the cart, or increment qty if already present.
       * Returns { success: boolean, message?: string } so callers can show toasts.
       */
      addToCart: (product) => {
        const stock = typeof product.stock === "number" ? product.stock : Infinity;
        const existing = get().items.find((i) => i._id === product._id);
        const currentQty = existing ? existing.qty : 0;

        if (currentQty >= stock) {
          return {
            success: false,
            message: "Out of stock!",
          };
        }

        set((state) => {
          const ex = state.items.find((i) => i._id === product._id);
          if (ex) {
            return {
              items: state.items.map((i) =>
                i._id === product._id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                _id: product._id,
                name: product.name,
                price: product.price,
                category: product.category,
                image: product.images?.[0] || null,
                color: product.color || null,
                // Store null when stock is Infinity so JSON serialisation stays clean
                stock: Number.isFinite(stock) ? stock : null,
                qty: 1,
              },
            ],
          };
        });

        return { success: true };
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        }));
      },

      updateQty: (id, newQty) => {
        if (newQty < 1) return;
        set((state) => ({
          items: state.items.map((i) => {
            if (i._id !== id) return i;
            const maxQty = Number.isFinite(i.stock) ? i.stock : Infinity;
            return { ...i, qty: Math.min(newQty, maxQty) };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "vynextee-cart", // localStorage key
      // Only persist the items array — exclude all functions and computed values.
      // This prevents Zustand's rehydration merge from mangling the state.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export { useCartStore };
export default useCartStore;
