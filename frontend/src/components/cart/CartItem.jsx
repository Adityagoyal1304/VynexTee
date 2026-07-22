// src/components/cart/CartItem.jsx
import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQty } = useCart();

  // Cart items are stored with _id (MongoDB), not id
  const { _id, name, price, category, image, qty, color, stock } = item;

  const handleRemove = () => {
    removeFromCart(_id);
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
      updateQty(_id, qty - 1);
    }
  };

  const increment = () => {
    const maxQty = stock ?? Infinity;
    if (qty >= maxQty) return; // silently do nothing — button is visually disabled
    updateQty(_id, qty + 1);
  };

  // Works for Cloudinary URLs (https://...) and local paths (/images/...)
  const hasRealImage = image && !image.includes("placeholder");

  const atStockLimit = stock != null && qty >= stock;

  return (
    <div className="flex gap-4 py-5 border-b last:border-0 animate-fadeIn" style={{ borderColor: "var(--border-light)" }}>
      {/* Image */}
      <div
        className="h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center"
        style={{ backgroundColor: !hasRealImage ? (color || "#1e293b") : undefined }}
      >
        {hasRealImage ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: color || "#1e293b" }}
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {category === "tshirt" ? "T-Shirt" : "Bag"}
            </span>
            <h4 className="text-sm font-semibold leading-tight line-clamp-2 mt-0.5" style={{ color: "var(--text-primary)" }}>
              {name}
            </h4>
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="shrink-0 p-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.backgroundColor = "transparent"; }}
            aria-label={`Remove ${name} from cart`}
            title="Remove from cart"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Qty Controls */}
          <div className="flex items-center gap-1 rounded-xl p-1 border" style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border-light)" }}>
            <button
              onClick={decrement}
              className="h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              aria-label={`Decrease quantity of ${name}`}
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span
              className="w-8 text-center text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
              aria-live="polite"
              aria-label={`Quantity: ${qty}`}
            >
              {qty}
            </span>
            <button
              onClick={increment}
              disabled={atStockLimit}
              className="h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: atStockLimit ? "var(--text-muted)" : "var(--text-secondary)" }}
              onMouseEnter={(e) => { if (!atStockLimit) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = atStockLimit ? "var(--text-muted)" : "var(--text-secondary)"; }}
              aria-label={`Increase quantity of ${name}`}
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Line Total */}
          <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            {formatPrice(price * qty)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
