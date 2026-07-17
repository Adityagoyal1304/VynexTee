// src/store/cartStore.js
// Zustand cart store with localStorage persistence

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // ── Actions ─────────────────────────────────────────────────

      addToCart: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i._id === product._id);
          if (existing) {
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
                qty: 1,
              },
            ],
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        }));
      },

      updateQty: (id, newQty) => {
        if (newQty < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id ? { ...i, qty: newQty } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      // ── Derived ─────────────────────────────────────────────────

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },

      get totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },
    }),
    {
      name: "vynextee-cart", // localStorage key
    }
  )
);

export { useCartStore };
export default useCartStore;
