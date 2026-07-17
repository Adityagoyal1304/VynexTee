// src/pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import useAuthStore from "@/store/authStore";
import { createOrder } from "@/services/orderService";
import toast from "react-hot-toast";

const CartPage = () => {
  const { items, totalItems, clearCart } = useCart();
  const isEmpty = items.length === 0;
  const { user } = useAuthStore();
  const [isCheckout, setIsCheckout] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [shippingAddress, setShippingAddress] = React.useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });

  const handleProceedToCheckout = () => {
    setIsCheckout(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        items: items.map(i => ({ _id: i._id, qty: i.qty })),
        shippingAddress
      });
      clearCart();
      setIsSuccess(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center animate-fadeIn" style={{ backgroundColor: "var(--bg-page)" }}>
        <div className="text-emerald-400 mb-6">
          <CheckCircle size={80} />
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
          Order Confirmed!
        </h1>
        <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
          Thank you for your purchase. We're getting your order ready.
        </p>
        <Link to="/profile" className="px-8 py-4 rounded-xl text-white font-bold bg-emerald-500 hover:bg-emerald-600 transition-colors">
          View My Orders
        </Link>
      </div>
    );
  }

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
                {!isCheckout ? (
                  items.map((item) => <CartItem key={item._id} item={item} />)
                ) : (
                  <div className="py-6">
                    <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Shipping Details</h2>
                    <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Full Name</label>
                        <input required type="text" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Phone Number</label>
                        <input required type="text" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Address Line</label>
                        <input required type="text" value={shippingAddress.addressLine} onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>City</label>
                          <input required type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" }} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>Pincode</label>
                          <input required type="text" value={shippingAddress.pincode} onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-primary)", "--tw-ring-color": "var(--accent)" }} />
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <div className="mt-6">
                {!isCheckout ? (
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-sm transition-colors group hover:text-white"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                    Continue Shopping
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsCheckout(false)}
                    className="inline-flex items-center gap-2 text-sm transition-colors group hover:text-white"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                    Back to Cart
                  </button>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <CartSummary 
                onProceed={handleProceedToCheckout} 
                isCheckout={isCheckout} 
                submitting={submitting} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
