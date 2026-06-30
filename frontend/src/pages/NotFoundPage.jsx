// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag, ArrowRight } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center px-4 animate-fadeIn">
      <div className="text-center max-w-md">
        {/* Giant 404 */}
        <div className="relative mb-8">
          <p
            className="text-[10rem] font-bold leading-none select-none"
            style={{
              fontFamily: "Syne, sans-serif",
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-[#60a5fa]/10 border border-[#60a5fa]/20 flex items-center justify-center animate-float">
              <ShoppingBag size={28} className="text-[#60a5fa]" />
            </div>
          </div>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Page Not Found
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          Looks like this page got lost in transit. The item you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3b82f6] text-white font-semibold text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
            aria-label="Go to home page"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-semibold text-sm hover:text-white hover:bg-white/10 transition-all group focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
            aria-label="Browse all products"
          >
            Browse Shop
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
