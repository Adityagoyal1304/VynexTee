// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=tshirt", label: "T-Shirts" },
  { to: "/shop?category=bag", label: "Bags" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevItems, setPrevItems] = useState(totalItems);
  const [cartPop, setCartPop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalItems > prevItems) {
      setCartPop(true);
      setTimeout(() => setCartPop(false), 350);
    }
    setPrevItems(totalItems);
  }, [totalItems]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── HEADER ───────────────────────────────────────────────────
          Always uses --bg-nav (#060610) — deliberately darker than
          the page body so it reads as a separate surface element.
      ─────────────────────────────────────────────────────────────── */}
      <header
        className={`nav-surface fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
          scrolled ? "scrolled" : ""
        }`}
        role="banner"
      >
        {/* Accent line at very top of header */}
        <div
          className="h-[3px] w-full"
          style={{ backgroundColor: "var(--accent)" }}
        />

        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="Vynextee home"
          >
            <img
              src="/logo.jpeg"
              alt="Vynextee logo"
              className="h-10 w-10 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
            <span
              className="text-xl font-bold tracking-wider text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              VYNEX<span style={{ color: "var(--accent)" }}>TEE</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                role="listitem"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? (
                <Sun size={17} strokeWidth={1.8} />
              ) : (
                <Moon size={17} strokeWidth={1.8} />
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2"
              aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            >
              <ShoppingBag size={21} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-white text-[10px] font-bold ${
                    cartPop ? "badge-pop" : ""
                  }`}
                  style={{ backgroundColor: "var(--accent-deep)" }}
                  aria-live="polite"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Menu ─────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 flex flex-col transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: "var(--bg-nav)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              className="font-bold text-white text-lg tracking-wider"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              VYNEX<span style={{ color: "var(--accent)" }}>TEE</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X size={19} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 px-4 py-5">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Theme toggle row */}
          <div
            className="mx-4 my-2 flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-sm text-white/50">
              {isDark ? "Dark mode" : "Light mode"}
            </span>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Cart CTA */}
          <div className="mt-auto px-4 pb-8">
            <button
              onClick={() => { navigate("/cart"); setMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold text-sm transition-colors"
              style={{ backgroundColor: "var(--accent-deep)" }}
              aria-label="View cart"
            >
              <ShoppingBag size={17} />
              View Cart
              {totalItems > 0 && (
                <span className="ml-auto bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
