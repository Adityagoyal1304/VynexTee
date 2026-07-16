// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  ArrowRight, Shirt, ShoppingBag, Zap, Shield, Truck, RefreshCw, Star, ChevronRight,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const valueProps = [
  { Icon: Truck,     title: "Free Shipping",   desc: "On orders above ₹999" },
  { Icon: Shield,    title: "100% Authentic",  desc: "Genuine quality guaranteed" },
  { Icon: RefreshCw, title: "Easy Returns",    desc: "15-day hassle-free returns" },
  { Icon: Zap,       title: "Fast Dispatch",   desc: "Ships within 24 hours" },
];

// ── Reusable diamond decoration ────────────────────────────────────
const Diamond = ({ size, top, left, right, bottom, variant = "outline", animClass = "", opacity = 1, zIndex = 0 }) => (
  <div
    className={`diamond ${
      variant === "filled"  ? "diamond-filled"  :
      variant === "accent"  ? "diamond-accent"  :
      variant === "blue"    ? "diamond-blue"    :
      "diamond-outline"
    } ${animClass}`}
    style={{
      width: size, height: size,
      top, left, right, bottom,
      opacity, zIndex,
    }}
    aria-hidden="true"
  />
);

const HomePage = () => {
  const { data: allProducts = [], isLoading } = useProducts();

  const featured = allProducts
    .filter((p) => p.badge === "Bestseller")
    .slice(0, 4)
    .concat(allProducts.filter((p) => p.badge !== "Bestseller").slice(0, 4))
    .slice(0, 4);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(newsletterSchema) });

  const onNewsletterSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Thanks! We'll be in touch. 💙", {
      duration: 4000,
      style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b" },
    });
    reset();
  };

  return (
    <div className="animate-fadeIn">

      {/* ═══════════════════════════════════════════════════════════
          HERO — flat dark block + diamond geometry
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: "var(--bg-hero)" }}
        aria-label="Hero"
      >
        {/* ── Diamond decorations ── */}
        <Diamond size="320px" top="-80px"   left="-80px"  variant="outline" opacity={0.25} animClass="diamond-float-3" />
        <Diamond size="180px" top="60px"    left="160px"  variant="filled"  opacity={0.18} animClass="diamond-float-1" />
        <Diamond size="90px"  top="180px"   left="80px"   variant="blue"    opacity={0.35} animClass="diamond-float-2" />
        <Diamond size="420px" bottom="-120px" right="-100px" variant="outline" opacity={0.15} animClass="diamond-float-4" />
        <Diamond size="220px" top="30px"    right="60px"  variant="filled"  opacity={0.12} animClass="diamond-float-2" />
        <Diamond size="110px" bottom="100px" right="220px" variant="blue"   opacity={0.3}  animClass="diamond-float-1" />
        <Diamond size="60px"  top="50%"     left="42%"    variant="accent"  opacity={0.5}  animClass="diamond-float-3" />

        {/* ── Content ── */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-36 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
                style={{
                  background: "var(--hero-tag-bg)",
                  border: "1px solid var(--hero-tag-border)",
                  color: "var(--accent)",
                }}
              >
                <Star size={11} fill="currentColor" />
                New Summer Collection 2024
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--hero-text)" }}
              >
                Wear the{" "}
                <span style={{ color: "var(--accent)" }}>Bold.</span>
                <br />
                Carry the{" "}
                <span style={{ color: "var(--accent)" }}>Statement.</span>
              </h1>

              <p className="text-lg leading-relaxed max-w-md mb-10" style={{ color: "var(--hero-text-sub)" }}>
                Premium oversized tees and designer bags crafted for the ones who don't blend in.
                Free shipping on orders above ₹999.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop?category=tshirt"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base text-white transition-all duration-200 focus:outline-none group"
                  style={{ backgroundColor: "var(--accent-deep)" }}
                  aria-label="Shop T-Shirts"
                >
                  <Shirt size={18} />
                  Shop T-Shirts
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop?category=bag"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none"
                  style={{ border: "2px solid var(--hero-outline-btn)", color: "var(--hero-text)" }}
                  aria-label="Shop Bags"
                >
                  <ShoppingBag size={18} />
                  Shop Bags
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-14 flex gap-10 pt-8" style={{ borderTop: "1px solid var(--hero-divider)" }}>
                {[
                  { val: "10K+", label: "Happy Customers" },
                  { val: "50+",  label: "Unique Designs" },
                  { val: "4.9★", label: "Avg Rating" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "var(--hero-text)" }}>{val}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--hero-text-stat)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product showcase blocks (no gradients, flat colored) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 relative">
              {[
                { bg: "#93C5FD", label: "Icy Blue Tee",        price: "₹899",   Icon: Shirt,        dark: false },
                { bg: "#1e3a5f", label: "Signature Tote",       price: "₹1,699", Icon: ShoppingBag,  dark: true  },
                { bg: "#bfdbfe", label: "Classic White Tee",    price: "₹699",   Icon: Shirt,        dark: false },
                { bg: "#d4a574", label: "Urban Canvas Tote",    price: "₹1,199", Icon: ShoppingBag,  dark: false },
              ].map(({ bg, label, price, Icon, dark }, i) => (
                <div
                  key={label}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    marginTop: i % 2 !== 0 ? "2rem" : "0",
                    border: "1px solid var(--hero-overlay-border)",
                    transform: "translateZ(0)",
                  }}
                >
                  <div
                    className="aspect-square flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: bg }}
                  >
                    {/* Mini diamond inside card */}
                    <div
                      className="absolute"
                      style={{
                        width: 80, height: 80,
                        background: "rgba(0,0,0,0.06)",
                        transform: "rotate(45deg)",
                        top: -20, right: -20,
                      }}
                    />
                    <Icon
                      size={52}
                      style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.22)" }}
                    />
                  </div>
                  <div className="p-3" style={{ backgroundColor: "var(--hero-card-info-bg)" }}>
                    <p className="text-xs" style={{ color: "var(--hero-card-label)" }}>{label}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "var(--hero-card-text)" }}>{price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom edge marker — solid color block divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: "var(--accent-deep)" }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          VALUE PROPS — contrasting flat surface
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="py-12"
        style={{
          backgroundColor: "var(--bg-section)",
          borderBottom: "1px solid var(--border-light)",
        }}
        aria-label="Brand features"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {valueProps.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 group">
                <div
                  className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-colors"
                  style={{
                    background: "var(--accent-glow)",
                    border: "1px solid var(--accent)",
                    borderOpacity: 0.2,
                  }}
                >
                  <Icon size={18} style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED PRODUCTS — page background
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 section-page" aria-label="Featured products">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: "var(--accent)" }}
              >
                Handpicked for you
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
              >
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm transition-colors group"
              style={{ color: "var(--text-muted)" }}
              aria-label="View all products"
            >
              View All
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: "var(--bg-card)" }}>
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
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                color: "var(--text-secondary)",
              }}
            >
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORY BANNERS — alternating flat blocks
      ══════════════════════════════════════════════════════════════ */}
      <section className="section-surface" aria-label="Shop by category">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* T-Shirts block */}
          <Link
            to="/shop?category=tshirt"
            className="group relative overflow-hidden flex flex-col justify-end p-12 min-h-[320px] transition-all duration-300"
            style={{ backgroundColor: "var(--bg-dark-block)" }}
            aria-label="Shop T-Shirts"
          >
            {/* Diamond decorations inside block */}
            <Diamond size="200px" top="-50px"  right="-50px" variant="outline" opacity={0.12} animClass="diamond-float-3" />
            <Diamond size="100px" top="40px"   right="80px"  variant="blue"    opacity={0.2}  animClass="diamond-float-1" />
            <Diamond size="50px"  bottom="80px" right="180px" variant="filled" opacity={0.15} animClass="diamond-float-2" />

            {/* Hover accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2"
              style={{ backgroundColor: "var(--accent)" }}
            />

            <div className="relative z-10">
              <Shirt size={40} className="mb-5 transition-transform duration-300 group-hover:-translate-y-1" style={{ color: "var(--accent)" }} />
              <h3
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--hero-text)" }}
              >
                T-Shirts
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--dark-block-text)" }}>
                7 styles from ₹649 — Oversized, polo &amp; vintage cuts
              </p>
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                style={{ color: "var(--accent)" }}
              >
                Shop T-Shirts <ArrowRight size={15} />
              </span>
            </div>
          </Link>

          {/* Bags block */}
          <Link
            to="/shop?category=bag"
            className="group relative overflow-hidden flex flex-col justify-end p-12 min-h-[320px] transition-all duration-300"
            style={{ backgroundColor: "var(--bg-section-alt)" }}
            aria-label="Shop Bags"
          >
            <Diamond size="200px" top="-50px"  left="-50px"  variant="outline" opacity={0.1}  animClass="diamond-float-4" />
            <Diamond size="100px" top="40px"   left="80px"   variant="accent"  opacity={0.3}  animClass="diamond-float-2" />
            <Diamond size="50px"  bottom="80px" left="180px" variant="filled"  opacity={0.12} animClass="diamond-float-1" />

            <div
              className="absolute right-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-2"
              style={{ backgroundColor: "var(--accent-deep)" }}
            />

            <div className="relative z-10">
              <ShoppingBag size={40} className="mb-5 transition-transform duration-300 group-hover:-translate-y-1" style={{ color: "var(--accent)" }} />
              <h3
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
              >
                Bags
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                7 styles from ₹899 — Totes, slings &amp; backpacks
              </p>
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                style={{ color: "var(--accent)" }}
              >
                Shop Bags <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEWSLETTER — distinct block with diamond pattern
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: "var(--bg-dark-block)" }}
        aria-label="Newsletter signup"
      >
        {/* Diamond field */}
        <Diamond size="280px" top="-70px"   left="-70px"   variant="outline" opacity={0.1}  animClass="diamond-float-4" />
        <Diamond size="150px" bottom="-40px" right="-40px" variant="outline" opacity={0.1}  animClass="diamond-float-3" />
        <Diamond size="70px"  top="30px"    right="25%"    variant="blue"    opacity={0.25} animClass="diamond-float-1" />
        <Diamond size="40px"  bottom="30px" left="20%"     variant="blue"    opacity={0.2}  animClass="diamond-float-2" />

        <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6 text-center">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--newsletter-icon-bg)", border: "1px solid var(--newsletter-icon-border)" }}
          >
            <Zap size={22} style={{ color: "var(--accent)" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--hero-text)" }}
          >
            Stay in the Loop
          </h2>
          <p className="mb-8" style={{ color: "var(--dark-block-text)" }}>
            Early access to drops, exclusive discounts, and style drops. No spam.
          </p>

          <form onSubmit={handleSubmit(onNewsletterSubmit)} noValidate>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address for newsletter"
                  className={`w-full px-5 py-3.5 rounded-xl text-sm focus:outline-none transition-all ${
                    errors.email ? "border-red-400" : ""
                  }`}
                  style={{
                    background: "var(--newsletter-input-bg)",
                    border: errors.email ? "1px solid #f87171" : "1px solid var(--newsletter-input-border)",
                    color: "var(--newsletter-input-color)",
                  }}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 text-left" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="shrink-0 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: "var(--accent-deep)" }}
                aria-label="Subscribe to newsletter"
              >
                {isSubmitting ? "..." : "Subscribe"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-xs" style={{ color: "var(--newsletter-fine)" }}>
            10,000+ subscribers · Unsubscribe anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
