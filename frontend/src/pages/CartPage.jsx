// src/pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

const CartPage = () => {
  const { items, totalItems } = useCart();
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen pt-24 pb-20 animate-fadeIn" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            Your Cart
          </h1>
          {!isEmpty && (
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="relative">
              <div
                className="h-28 w-28 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
              >
                <ShoppingBag size={48} style={{ color: "var(--text-muted)" }} />
              </div>
            </div>
            <div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
              >
                Your cart is empty
              </h2>
              <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
                Looks like you haven't added anything yet. Browse our collection and find something you love.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop?category=tshirt"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-colors"
                style={{ backgroundColor: "var(--accent-deep)" }}
              >
                Shop T-Shirts
              </Link>
              <Link
                to="/shop?category=bag"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  color: "var(--text-secondary)",
                }}
              >
                Shop Bags
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl px-6"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
              >
                {items.map((item) => <CartItem key={item.id} item={item} />)}
              </div>
              <div className="mt-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-sm transition-colors group hover:text-white"
                  style={{ color: "var(--text-muted)" }}
                >
                  <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
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
