import React, { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { User, Mail, Package, ShieldCheck, Clock } from "lucide-react";
import { getMyOrders } from "@/services/orderService";
import { formatPrice } from "@/utils/formatPrice";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" };
      case "shipped": return { bg: "rgba(96,165,250,0.15)", text: "#60a5fa", border: "rgba(96,165,250,0.3)" };
      case "cancelled": return { bg: "rgba(248,113,113,0.15)", text: "#f87171", border: "rgba(248,113,113,0.3)" };
      default: return { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", border: "rgba(251,191,36,0.3)" };
    }
  };

  return (
    <div
      className="min-h-screen pt-24 pb-20 animate-fadeIn"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <div
            className="h-24 w-24 rounded-3xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
              boxShadow: "0 0 40px rgba(96,165,250,0.25)",
            }}
          >
            <User size={40} className="text-white" />
          </div>
          <div>
            <h1
              className="text-3xl sm:text-4xl font-bold flex items-center justify-center sm:justify-start gap-3"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
            >
              {user?.name}
              {user?.role === "admin" && (
                <span
                  className="px-2.5 py-1 text-xs uppercase tracking-widest rounded-lg flex items-center gap-1.5"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.15)",
                    color: "#4ade80",
                    border: "1px solid rgba(74,222,128,0.3)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <ShieldCheck size={12} /> Admin
                </span>
              )}
            </h1>
            <p className="mt-2 text-sm flex items-center justify-center sm:justify-start gap-2" style={{ color: "var(--text-secondary)" }}>
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Order History (Placeholder) */}
          <div
            className="md:col-span-2 rounded-2xl p-6 md:p-8"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(96,165,250,0.12)" }}
              >
                <Package size={20} style={{ color: "var(--accent)" }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                Order History
              </h2>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-page)" }}
              >
                <Package size={32} className="mb-4" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  No orders yet
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  When you make a purchase, it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusStyles = getStatusColor(order.status);
                  return (
                    <div key={order._id} className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-page)", border: "1px solid var(--border-light)" }}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Order #{order._id.substring(order._id.length - 8)}</p>
                          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                            <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{formatPrice(order.totalAmount)}</span>
                          <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-md" style={{ backgroundColor: statusStyles.bg, color: statusStyles.text, border: `1px solid ${statusStyles.border}` }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex-shrink-0 relative group">
                            <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-12 h-12 rounded-lg object-cover" style={{ border: "1px solid var(--border-light)" }} />
                            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-black">
                              {item.qty}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Account Settings / Info */}
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-col gap-4"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Account Info
            </h2>
            
            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                Name
              </p>
              <p className="font-medium text-sm" style={{ color: "var(--text-secondary)" }}>
                {user?.name}
              </p>
            </div>
            
            <div className="h-px w-full" style={{ backgroundColor: "var(--border-light)" }} />

            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                Email
              </p>
              <p className="font-medium text-sm" style={{ color: "var(--text-secondary)" }}>
                {user?.email}
              </p>
            </div>

            <div className="h-px w-full" style={{ backgroundColor: "var(--border-light)" }} />

            <div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                Account Type
              </p>
              <p className="font-medium text-sm capitalize" style={{ color: "var(--text-secondary)" }}>
                {user?.role}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
