// src/components/cart/CartSummary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

const FREE_SHIPPING_THRESHOLD = 999;

const CartSummary = () => {
  const { totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const orderTotal = totalPrice + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;

  const handleCheckout = () => {
    toast("Checkout coming soon! Backend integration in progress. 🚀", {
      icon: "🛒",
      duration: 4000,
      style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b", maxWidth: "380px" },
    });
  };

  return (
    <div
      className="rounded-2xl p-6 sticky top-24"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
    >
      <h2
        className="text-lg font-bold mb-6"
        style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
      >
        Order Summary
      </h2>

      {/* Free shipping progress */}
      {totalPrice < FREE_SHIPPING_THRESHOLD && totalPrice > 0 && (
        <div
          className="mb-5 p-3 rounded-xl"
          style={{ background: "var(--accent-glow)", border: "1px solid var(--accent)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Truck size={13} style={{ color: "var(--accent)" }} />
            <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>
              Add {formatPrice(remaining)} more for free shipping!
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                backgroundColor: "var(--accent)",
              }}
            />
          </div>
        </div>
      )}

      {shipping === 0 && totalPrice > 0 && (
        <div className="mb-5 p-3 rounded-xl flex items-center gap-2" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <Truck size={13} className="text-emerald-400" />
          <p className="text-xs font-medium text-emerald-400">You've unlocked free shipping! 🎉</p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span style={{ color: "var(--text-muted)" }}>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
          <span style={{ color: "var(--text-primary)" }}>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--text-muted)" }}>Shipping</span>
          <span className={shipping === 0 ? "text-emerald-400 font-medium" : ""} style={shipping !== 0 ? { color: "var(--text-primary)" } : {}}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="h-px my-2" style={{ background: "var(--border-light)" }} />
        <div className="flex justify-between font-bold text-base">
          <span style={{ color: "var(--text-primary)" }}>Total</span>
          <span style={{ color: "var(--text-primary)" }}>{formatPrice(orderTotal)}</span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Including all taxes (GST)</p>
      </div>

      {/* Checkout Button */}
      <button
        className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold text-base transition-colors focus:outline-none"
        style={{ backgroundColor: "var(--accent-deep)" }}
        onClick={handleCheckout}
        aria-label="Proceed to checkout"
      >
        <Lock size={15} />
        Proceed to Checkout
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
        <Lock size={11} />
        <span>256-bit SSL encryption</span>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {["Visa", "Mastercard", "UPI", "Razorpay"].map((m) => (
          <span key={m} className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: "var(--text-muted)", background: "var(--bg-page)", border: "1px solid var(--border-light)" }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CartSummary;
