// src/pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";

const CartPage = () => {
  const { items, totalItems } = useCart();
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-[#0a0a16] pt-24 pb-20 animate-fadeIn">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Your Cart
          </h1>
          {!isEmpty && (
            <p className="text-white/40 mt-2 text-sm">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          )}
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="relative">
              <div className="h-28 w-28 rounded-3xl bg-[#111827] border border-white/5 flex items-center justify-center">
                <ShoppingBag size={48} className="text-white/20" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#1e293b] border-2 border-[#0a0a16] flex items-center justify-center">
                <span className="text-[9px] text-white/40 font-bold">0</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                Your cart is empty
              </h2>
              <p className="text-white/40 text-sm max-w-xs">
                Looks like you haven't added anything yet. Browse our collection and find something you love.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop?category=tshirt"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3b82f6] text-white font-semibold text-sm hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                aria-label="Browse T-Shirts"
              >
                Shop T-Shirts
              </Link>
              <Link
                to="/shop?category=bag"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:text-white hover:bg-white/10 transition-all"
                aria-label="Browse Bags"
              >
                Shop Bags
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-[#111827] border border-white/5 px-6">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
                  aria-label="Continue shopping"
                >
                  <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
