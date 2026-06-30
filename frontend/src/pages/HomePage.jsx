// src/pages/HomePage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowRight, Shirt, ShoppingBag, Zap, Shield, Truck, RefreshCw, Star, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

// Newsletter validation schema
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Value prop data
const valueProps = [
  { Icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
  { Icon: Shield, title: "100% Authentic", desc: "Genuine quality guaranteed" },
  { Icon: RefreshCw, title: "Easy Returns", desc: "15-day hassle-free returns" },
  { Icon: Zap, title: "Fast Dispatch", desc: "Ships within 24 hours" },
];

const HomePage = () => {
  const { data: allProducts = [], isLoading } = useProducts();

  // Pick 4 featured products (badge = Bestseller or first 4)
  const featured = allProducts
    .filter((p) => p.badge === "Bestseller")
    .slice(0, 4)
    .concat(
      allProducts.filter((p) => p.badge !== "Bestseller").slice(0, 4)
    )
    .slice(0, 4);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(newsletterSchema) });

  const onNewsletterSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600)); // simulate API
    toast.success("Thanks! We'll be in touch. 💙", {
      duration: 4000,
      style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b" },
      iconTheme: { primary: "#60a5fa", secondary: "#0a0a16" },
    });
    reset();
  };

  return (
    <div className="animate-fadeIn">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Hero">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a16] via-[#0d0d1a] to-[#0f172a]" />
        <div className="hero-glow absolute inset-0" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#60a5fa]/10 border border-[#60a5fa]/20 text-[#60a5fa] text-xs font-semibold tracking-widest uppercase mb-8">
                <Star size={12} fill="currentColor" />
                New Summer Collection 2024
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white mb-6"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Wear the{" "}
                <span className="gradient-text">Bold.</span>
                <br />
                Carry the{" "}
                <span className="gradient-text">Statement.</span>
              </h1>

              <p className="text-lg text-white/50 leading-relaxed max-w-md mb-10">
                Premium oversized tees and designer bags crafted for the ones who don't blend in.
                Free shipping on orders above ₹999.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop?category=tshirt"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-base hover:bg-blue-500 transition-all duration-200 shadow-xl shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#0a0a16] group"
                  aria-label="Shop T-Shirts collection"
                >
                  <Shirt size={18} />
                  Shop T-Shirts
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop?category=bag"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-transparent border-2 border-white/15 text-white/80 font-semibold text-base hover:border-[#60a5fa]/50 hover:text-white hover:bg-[#60a5fa]/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] group"
                  aria-label="Shop Bags collection"
                >
                  <ShoppingBag size={18} />
                  Shop Bags
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex gap-10">
                {[
                  { val: "10K+", label: "Happy Customers" },
                  { val: "50+", label: "Unique Designs" },
                  { val: "4.9★", label: "Average Rating" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                      {val}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Side — floating product cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4 relative">
              <div className="animate-float" style={{ animationDelay: "0s" }}>
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10" style={{ backgroundColor: "#93C5FD" }}>
                  <div className="aspect-square flex items-center justify-center">
                    <Shirt size={64} className="text-[#1e3a5f] opacity-60" />
                  </div>
                  <div className="p-3 bg-[#111827]">
                    <p className="text-xs text-white/60">Icy Blue Longline Tee</p>
                    <p className="text-sm font-bold text-white mt-0.5">₹899</p>
                  </div>
                </div>
              </div>
              <div className="animate-float mt-8" style={{ animationDelay: "0.4s" }}>
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10" style={{ backgroundColor: "#0D0D1A" }}>
                  <div className="aspect-square flex items-center justify-center border border-white/5">
                    <ShoppingBag size={64} className="text-[#60a5fa] opacity-60" />
                  </div>
                  <div className="p-3 bg-[#111827]">
                    <p className="text-xs text-white/60">Vynex Signature Tote</p>
                    <p className="text-sm font-bold text-white mt-0.5">₹1,699</p>
                  </div>
                </div>
              </div>
              <div className="animate-float" style={{ animationDelay: "0.8s" }}>
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ backgroundColor: "#F5F5F5" }}>
                  <div className="aspect-square flex items-center justify-center">
                    <Shirt size={64} className="text-gray-400 opacity-60" />
                  </div>
                  <div className="p-3 bg-[#111827]">
                    <p className="text-xs text-white/60">Classic White Oversized</p>
                    <p className="text-sm font-bold text-white mt-0.5">₹699</p>
                  </div>
                </div>
              </div>
              <div className="animate-float mt-8" style={{ animationDelay: "1.2s" }}>
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ backgroundColor: "#D4C5A9" }}>
                  <div className="aspect-square flex items-center justify-center">
                    <ShoppingBag size={64} className="text-[#7c6a4e] opacity-60" />
                  </div>
                  <div className="p-3 bg-[#111827]">
                    <p className="text-xs text-white/60">Urban Canvas Tote</p>
                    <p className="text-sm font-bold text-white mt-0.5">₹1,199</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
          <p className="text-xs text-white/40 tracking-widest uppercase">Scroll</p>
        </div>
      </section>

      {/* ─── VALUE PROPS ──────────────────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-[#0d0d1a]" aria-label="Brand features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {valueProps.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#60a5fa]/10 border border-[#60a5fa]/20 flex items-center justify-center group-hover:bg-[#60a5fa]/20 transition-colors">
                  <Icon size={18} className="text-[#60a5fa]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-20 bg-[#0a0a16]" aria-label="Featured products">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-[#60a5fa] font-semibold tracking-widest uppercase mb-2">
                Handpicked for you
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm text-white/50 hover:text-[#60a5fa] transition-colors group"
              aria-label="View all products"
            >
              View All
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-[#111827] border border-white/5 animate-pulse">
                  <div className="aspect-square skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-16 skeleton rounded-full" />
                    <div className="h-4 w-4/5 skeleton rounded-md" />
                    <div className="h-5 w-20 skeleton rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:text-white hover:bg-white/10 transition-all"
            >
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY BANNER ──────────────────────────────────── */}
      <section className="py-12 bg-[#0d0d1a]" aria-label="Shop by category">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* T-Shirts Banner */}
            <Link
              to="/shop?category=tshirt"
              className="group relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-[#1e3a5f] to-[#0d0d1a] p-10 hover:border-[#60a5fa]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              aria-label="Shop T-Shirts"
            >
              <div className="absolute top-0 right-0 h-64 w-64 -translate-y-16 translate-x-16 rounded-full bg-blue-500/5 blur-3xl" />
              <Shirt size={48} className="text-[#60a5fa] mb-6 opacity-80" />
              <h3
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                T-Shirts
              </h3>
              <p className="text-white/50 text-sm mb-6">Oversized, polo, vintage — 7 styles from ₹649</p>
              <span className="inline-flex items-center gap-2 text-[#60a5fa] text-sm font-semibold group-hover:gap-3 transition-all">
                Shop T-Shirts <ArrowRight size={15} />
              </span>
            </Link>

            {/* Bags Banner */}
            <Link
              to="/shop?category=bag"
              className="group relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-[#1a2e1e] to-[#0d0d1a] p-10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
              aria-label="Shop Bags"
            >
              <div className="absolute top-0 right-0 h-64 w-64 -translate-y-16 translate-x-16 rounded-full bg-emerald-500/5 blur-3xl" />
              <ShoppingBag size={48} className="text-emerald-400 mb-6 opacity-80" />
              <h3
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Bags
              </h3>
              <p className="text-white/50 text-sm mb-6">Totes, slings, backpacks — 7 styles from ₹899</p>
              <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Shop Bags <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ───────────────────────────────────────── */}
      <section className="py-20 bg-[#0a0a16]" aria-label="Newsletter signup">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <div className="h-12 w-12 rounded-xl bg-[#60a5fa]/10 border border-[#60a5fa]/20 flex items-center justify-center mx-auto mb-6">
            <Zap size={22} className="text-[#60a5fa]" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Stay in the Loop
          </h2>
          <p className="text-white/50 mb-8">
            Get early access to new drops, exclusive discounts, and style inspiration. No spam, ever.
          </p>

          <form onSubmit={handleSubmit(onNewsletterSubmit)} noValidate>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address for newsletter"
                  className={`w-full px-5 py-3.5 rounded-xl text-white placeholder-white/30 bg-white/5 border text-sm focus:outline-none focus:ring-2 focus:ring-[#60a5fa] transition-all ${
                    errors.email ? "border-red-400" : "border-white/10"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 text-left" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="shrink-0"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </Button>
            </div>
          </form>

          <p className="mt-4 text-xs text-white/25">
            Join 10,000+ subscribers · Unsubscribe anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
