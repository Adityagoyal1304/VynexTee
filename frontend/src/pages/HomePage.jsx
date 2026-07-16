import React from "react";
import { Star, Shirt, ShoppingBag } from "lucide-react";

// ── Reusable diamond decoration ─────────────────────────────────────
const Diamond = ({ size, top, left, right, bottom, variant = "outline", animClass = "", opacity = 1 }) => (
  <div
    className={`diamond ${
      variant === "filled" ? "diamond-filled" :
      variant === "accent" ? "diamond-accent" :
      variant === "blue"   ? "diamond-blue"   :
      "diamond-outline"
    } ${animClass}`}
    style={{ width: size, height: size, top, left, right, bottom, opacity }}
    aria-hidden="true"
  />
);

const HomePage = () => {
  return (
    <div className="animate-fadeIn">

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "var(--bg-hero-gradient)" }}
        aria-label="Hero"
      >
        {/* Radial glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--bg-hero-radial)" }}
          aria-hidden="true"
        />

        {/* Diamond decorations */}
        <Diamond size="320px" top="-80px"    left="-80px"   variant="outline" opacity={0.25} animClass="diamond-float-3" />
        <Diamond size="180px" top="60px"     left="160px"   variant="filled"  opacity={0.18} animClass="diamond-float-1" />
        <Diamond size="90px"  top="180px"    left="80px"    variant="blue"    opacity={0.35} animClass="diamond-float-2" />
        <Diamond size="420px" bottom="-120px" right="-100px" variant="outline" opacity={0.15} animClass="diamond-float-4" />
        <Diamond size="220px" top="30px"     right="60px"   variant="filled"  opacity={0.12} animClass="diamond-float-2" />
        <Diamond size="110px" bottom="100px" right="220px"  variant="blue"    opacity={0.3}  animClass="diamond-float-1" />
        <Diamond size="60px"  top="50%"      left="42%"     variant="accent"  opacity={0.5}  animClass="diamond-float-3" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-36 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
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

              <p
                className="text-lg leading-relaxed max-w-md mb-10"
                style={{ color: "var(--hero-text-sub)" }}
              >
                Premium oversized tees and designer bags crafted for the ones
                who don't blend in. Free shipping on orders above ₹999.
              </p>

              {/* Coming soon pill */}
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{
                  background: "var(--hero-tag-bg)",
                  border: "1px solid var(--hero-tag-border)",
                  color: "var(--hero-text-sub)",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                Products dropping soon — stay tuned
              </div>

              {/* Stats */}
              <div
                className="mt-14 flex gap-10 pt-8"
                style={{ borderTop: "1px solid var(--hero-divider)" }}
              >
                {[
                  { val: "10K+", label: "Happy Customers" },
                  { val: "50+",  label: "Unique Designs" },
                  { val: "4.9★", label: "Avg Rating" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p
                      className="text-2xl font-bold"
                      style={{ fontFamily: "Syne, sans-serif", color: "var(--hero-text)" }}
                    >
                      {val}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--hero-text-stat)" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — decorative product colour blocks */}
            <div className="hidden lg:grid grid-cols-2 gap-4 relative">
              {[
                { bg: "#93C5FD", Icon: Shirt,        dark: false },
                { bg: "#1e3a5f", Icon: ShoppingBag,  dark: true  },
                { bg: "#bfdbfe", Icon: Shirt,        dark: false },
                { bg: "#d4a574", Icon: ShoppingBag,  dark: false },
              ].map(({ bg, Icon, dark }, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    marginTop: i % 2 !== 0 ? "2rem" : "0",
                    border: "1px solid var(--hero-overlay-border)",
                  }}
                >
                  <div
                    className="aspect-square flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: bg }}
                  >
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
                  <div
                    className="px-3 py-2.5"
                    style={{ backgroundColor: "var(--hero-card-info-bg)" }}
                  >
                    <div
                      className="h-2 w-16 rounded-full opacity-30"
                      style={{ backgroundColor: "var(--hero-card-text)" }}
                    />
                    <div
                      className="h-2 w-10 rounded-full opacity-20 mt-1.5"
                      style={{ backgroundColor: "var(--hero-card-text)" }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: "var(--accent-deep)" }}
        />
      </section>

    </div>
  );
};

export default HomePage;
