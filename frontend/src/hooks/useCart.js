// src/hooks/useCart.js
// Thin wrapper around cartStore — provides a stable hook interface

import { useCartStore } from "@/store/cartStore";

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    totalItems,
    totalPrice,
  };
};

export default useCart;
