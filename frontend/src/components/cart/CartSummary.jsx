// src/components/cart/CartSummary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Truck, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import Button from "@/components/ui/Button";

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
      style: {
        background: "#111827",
        color: "#f8f8f8",
        border: "1px solid #1e293b",
        maxWidth: "380px",
      },
    });
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-white/5 p-6 sticky top-24">
      <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
        Order Summary
      </h2>

      {/* Free shipping progress */}
      {totalPrice < FREE_SHIPPING_THRESHOLD && totalPrice > 0 && (
        <div className="mb-5 p-3 rounded-xl bg-[#60a5fa]/10 border border-[#60a5fa]/20">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={14} className="text-[#60a5fa]" />
            <p className="text-xs text-[#60a5fa] font-medium">
              Add {formatPrice(remaining)} more for free shipping!
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#60a5fa] transition-all duration-500"
              style={{ width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {shipping === 0 && totalPrice > 0 && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <Truck size={14} className="text-emerald-400" />
          <p className="text-xs text-emerald-400 font-medium">You've unlocked free shipping! 🎉</p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
          <span className="text-white">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-emerald-400 font-medium" : "text-white"}>
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>
        <div className="h-px bg-white/5 my-2" />
        <div className="flex justify-between font-bold text-base text-white">
          <span>Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
        <p className="text-xs text-white/30">Including all taxes (GST)</p>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="mt-6 text-base"
        onClick={handleCheckout}
        aria-label="Proceed to checkout"
      >
        <Lock size={15} />
        Proceed to Checkout
      </Button>

      {/* Trust signals */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
        <Lock size={11} />
        <span>Secured with 256-bit SSL encryption</span>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        {["Visa", "Mastercard", "UPI", "Razorpay"].map((m) => (
          <span key={m} className="text-[10px] text-white/20 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CartSummary;
