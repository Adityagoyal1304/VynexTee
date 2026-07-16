// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag, Sun, Moon, Search, User, ChevronDown,
  Shirt, LogIn, Settings, Heart, X, Package,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [scrolled,     setScrolled]     = useState(false);
  const [searchQuery,  setSearchQuery]   = useState("");
  const [searchActive, setSearchActive]  = useState(false);
  const [storeOpen,    setStoreOpen]     = useState(false);
  const [profileOpen,  setProfileOpen]   = useState(false);

  const storeRef   = useRef(null);
  const profileRef = useRef(null);
  const searchRef  = useRef(null);

  /* ── scroll shadow ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (storeRef.current   && !storeRef.current.contains(e.target))   setStoreOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchActive(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── escape key ── */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") { setStoreOpen(false); setProfileOpen(false); setSearchActive(false); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchActive(false);
    }
  };

  const closeAll = () => { setStoreOpen(false); setProfileOpen(false); };

  /* ─────────────────────────────────────────────────────────── */
  return (
    <header
      className={`nav-surface fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? "scrolled" : ""}`}
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >

        {/* ── 1. LOGO ─────────────────────────────────────────── */}
        <Link
          to="/"
          className="flex items-center gap-3 group shrink-0 min-w-[160px]"
          aria-label="Vynextee home"
          onClick={closeAll}
        >
          <img
            src="/logo.jpeg"
            alt="Vynextee logo"
            className="h-9 w-9 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
          <span
            className="text-lg font-bold tracking-wider text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            VYNEX<span style={{ color: "var(--accent)" }}>TEE</span>
          </span>
        </Link>

        {/* ── 2. SEARCH BAR ────────────────────────────────────── */}
        <form
          ref={searchRef}
          onSubmit={handleSearch}
          className="flex-1 px-4"
          role="search"
        >
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "rgba(255,255,255,0.35)" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchActive(true)}
              placeholder="Search tees, bags…"
              aria-label="Search products"
              className="w-full pl-9 pr-9 py-2 text-sm rounded-xl transition-all duration-200 focus:outline-none"
              style={{
                background:  searchActive ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
                border:      searchActive ? "1px solid rgba(96,165,250,0.40)" : "1px solid rgba(255,255,255,0.08)",
                color:       "#fff",
                caretColor:  "var(--accent)",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(255,255,255,0.35)" }}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </form>

        {/* ── RIGHT CONTROLS ───────────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0 min-w-[220px] justify-end">

          {/* ── 4. STORE DROPDOWN ── */}
          <div className="relative hidden md:block" ref={storeRef}>
            <button
              onClick={() => { setStoreOpen((v) => !v); setProfileOpen(false); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                storeOpen
                  ? "text-white bg-white/10"
                  : "text-white/65 hover:text-white hover:bg-white/5"
              }`}
              aria-haspopup="true"
              aria-expanded={storeOpen}
            >
              <Package size={15} />
              Store
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${storeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Store dropdown panel */}
            <div
              className={`absolute right-0 top-full mt-2.5 w-56 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 origin-top-right ${
                storeOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ background: "#0a1525", border: "1px solid rgba(96,165,250,0.18)" }}
            >
              <div className="p-2">
                <p
                  className="text-[10px] font-semibold tracking-widest uppercase px-3 py-2"
                  style={{ color: "var(--accent)" }}
                >
                  Shop by Category
                </p>

                <Link
                  to="/shop?category=tshirt"
                  onClick={() => setStoreOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5 group/item"
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(96,165,250,0.12)" }}
                  >
                    <Shirt size={15} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <p className="font-medium text-white/85 group-hover/item:text-white transition-colors">T-Shirts</p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Oversized · Polo · Vintage
                    </p>
                  </div>
                </Link>

                <Link
                  to="/shop?category=bag"
                  onClick={() => setStoreOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5 group/item"
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(96,165,250,0.12)" }}
                  >
                    <ShoppingBag size={15} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <p className="font-medium text-white/85 group-hover/item:text-white transition-colors">Bags</p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Totes · Slings · Backpacks
                    </p>
                  </div>
                </Link>

                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 8px" }} />

                <Link
                  to="/shop"
                  onClick={() => setStoreOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ color: "var(--accent)", background: "rgba(96,165,250,0.08)" }}
                >
                  View All Products →
                </Link>
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="hidden md:block w-px h-6 mx-1" style={{ background: "rgba(255,255,255,0.10)" }} />

          {/* ── 3. PROFILE DROPDOWN ── */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen((v) => !v); setStoreOpen(false); }}
              className={`flex items-center gap-1.5 p-2 rounded-xl transition-all duration-200 ${
                profileOpen ? "bg-white/10" : "hover:bg-white/5"
              }`}
              aria-haspopup="true"
              aria-expanded={profileOpen}
              aria-label="Profile menu"
            >
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.6), rgba(96,165,250,0.4))",
                  border: "1px solid rgba(96,165,250,0.30)",
                }}
              >
                <User size={14} className="text-white" />
              </div>
            </button>

            {/* Profile dropdown panel */}
            <div
              className={`absolute right-0 top-full mt-2.5 w-64 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 origin-top-right ${
                profileOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ background: "#0a1525", border: "1px solid rgba(96,165,250,0.18)" }}
            >
              {/* User info header */}
              <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                      boxShadow: "0 0 16px rgba(96,165,250,0.25)",
                    }}
                  >
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Guest User</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                      Not signed in
                    </p>
                  </div>
                </div>

                {/* Sign in CTA */}
                <button
                  className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{ backgroundColor: "var(--accent-deep)" }}
                >
                  Sign In / Register
                </button>
              </div>

              {/* Menu items */}
              <div className="p-2">
                {[
                  { icon: Heart,    label: "Wishlist",       sub: "Your saved items" },
                  { icon: Package,  label: "My Orders",      sub: "Track your orders" },
                  { icon: Settings, label: "Settings",       sub: "Account preferences" },
                ].map(({ icon: Icon, label, sub }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5 text-left group/item"
                  >
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(96,165,250,0.10)" }}
                    >
                      <Icon size={13} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <p className="font-medium text-white/80 group-hover/item:text-white transition-colors leading-none">
                        {label}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>
                        {sub}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="hidden md:block w-px h-6 mx-1" style={{ background: "rgba(255,255,255,0.10)" }} />

          {/* ── 6. THEME TOGGLE ── */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark
              ? <Sun  size={16} strokeWidth={1.8} />
              : <Moon size={16} strokeWidth={1.8} />
            }
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
