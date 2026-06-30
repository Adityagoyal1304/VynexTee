// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=tshirt", label: "T-Shirts" },
  { to: "/shop?category=bag", label: "Bags" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevItems, setPrevItems] = useState(totalItems);
  const [cartPop, setCartPop] = useState(false);
  const navigate = useNavigate();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cart badge pop animation
  useEffect(() => {
    if (totalItems > prevItems) {
      setCartPop(true);
      setTimeout(() => setCartPop(false), 350);
    }
    setPrevItems(totalItems);
  }, [totalItems]);

  // Close mobile menu on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a16]/95 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/50"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="Vynextee home"
          >
            <img
              src="/logo.jpeg"
              alt="Vynextee logo"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span
              className="font-display text-xl font-bold tracking-wider text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              VYNEX<span className="text-[#60a5fa]">TEE</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "text-[#60a5fa] bg-[#60a5fa]/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: Cart + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              aria-label={`Shopping cart, ${totalItems} items`}
            >
              <ShoppingBag size={22} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-[#3b82f6] text-white text-[10px] font-bold shadow-lg shadow-blue-500/40 ${
                    cartPop ? "badge-pop" : ""
                  }`}
                  aria-live="polite"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-[#0d0d1a] border-l border-white/5 flex flex-col transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
            <span className="font-display font-bold text-white text-lg tracking-wider" style={{ fontFamily: "Syne, sans-serif" }}>
              VYNEX<span className="text-[#60a5fa]">TEE</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 px-4 py-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3.5 rounded-xl text-base font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? "text-[#60a5fa] bg-[#60a5fa]/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Cart CTA */}
          <div className="mt-auto px-4 pb-8">
            <button
              onClick={() => { navigate("/cart"); setMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-base hover:bg-blue-500 transition-colors"
              aria-label="View cart"
            >
              <ShoppingBag size={18} />
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
