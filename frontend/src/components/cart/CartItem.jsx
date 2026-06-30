// src/components/cart/CartItem.jsx
import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQty } = useCart();
  const { id, name, price, category, image, qty, color } = item;

  const handleRemove = () => {
    removeFromCart(id);
    toast(`${name} removed from cart`, {
      icon: "🗑️",
      style: {
        background: "#111827",
        color: "#f8f8f8",
        border: "1px solid #1e293b",
      },
    });
  };

  const decrement = () => {
    if (qty <= 1) {
      handleRemove();
    } else {
      updateQty(id, qty - 1);
    }
  };

  const increment = () => updateQty(id, qty + 1);

  const hasRealImage = image && !image.includes("placeholder") && image.startsWith("/");

  return (
    <div className="flex gap-4 py-5 border-b border-white/5 last:border-0 animate-fadeIn">
      {/* Image */}
      <div
        className="h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center"
        style={{ backgroundColor: !hasRealImage ? (color || "#1e293b") : undefined }}
      >
        {hasRealImage ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{ backgroundColor: color || "#1e293b" }}
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-xs text-white/40 uppercase tracking-widest">
              {category === "tshirt" ? "T-Shirt" : "Bag"}
            </span>
            <h4 className="text-sm font-semibold text-white/90 leading-tight line-clamp-2 mt-0.5">
              {name}
            </h4>
          </div>
          <button
            onClick={handleRemove}
            className="shrink-0 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={`Remove ${name} from cart`}
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty Controls */}
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
            <button
              onClick={decrement}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              aria-label={`Decrease quantity of ${name}`}
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-white" aria-label={`Quantity: ${qty}`}>
              {qty}
            </span>
            <button
              onClick={increment}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              aria-label={`Increase quantity of ${name}`}
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Line Total */}
          <span className="text-base font-bold text-white">
            {formatPrice(price * qty)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
