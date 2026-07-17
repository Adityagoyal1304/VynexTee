// src/pages/ProfilePage.jsx
import React from "react";
import useAuthStore from "@/store/authStore";
import { User, Mail, Package, ShieldCheck } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuthStore();

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
