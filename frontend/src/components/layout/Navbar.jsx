// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag, Sun, Moon, Search, User, ChevronDown,
  Shirt, Settings, Heart, X, Package, Menu,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/context/ThemeContext";
import useAuthStore from "@/store/authStore";

const Navbar = () => {
  const { totalItems } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [scrolled,       setScrolled]     = useState(false);
  const [prevItems,      setPrevItems]     = useState(0);
  const [cartPop,        setCartPop]       = useState(false);
  const [searchQuery,    setSearchQuery]   = useState("");
  const [searchActive,   setSearchActive]  = useState(false);
  const [storeOpen,      setStoreOpen]     = useState(false);
  const [profileOpen,    setProfileOpen]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const storeRef   = useRef(null);
  const profileRef = useRef(null);
  const searchRef  = useRef(null);

  /* ── scroll shadow ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── cart badge pop ── */
  useEffect(() => {
    if (totalItems > prevItems) {
      setCartPop(true);
      setTimeout(() => setCartPop(false), 350);
    }
    setPrevItems(totalItems);
  }, [totalItems]);

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

  const closeAll = () => { setStoreOpen(false); setProfileOpen(false); setMobileMenuOpen(false); };

  /* ─────────────────────────────────────────────────────────── */
  // close mobile menu on body scroll
  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
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
          className="hidden md:flex flex-1 px-4"
          role="search"
        >
          <div className="relative w-full max-w-xl mx-auto">
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
                  background: isAuthenticated
                    ? "linear-gradient(135deg, rgba(34,197,94,0.6), rgba(74,222,128,0.4))"
                    : "linear-gradient(135deg, rgba(59,130,246,0.6), rgba(96,165,250,0.4))",
                  border: isAuthenticated
                    ? "1px solid rgba(74,222,128,0.40)"
                    : "1px solid rgba(96,165,250,0.30)",
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
                      background: isAuthenticated
                        ? "linear-gradient(135deg, #22c55e, #4ade80)"
                        : "linear-gradient(135deg, #3b82f6, #60a5fa)",
                      boxShadow: isAuthenticated
                        ? "0 0 16px rgba(74,222,128,0.25)"
                        : "0 0 16px rgba(96,165,250,0.25)",
                    }}
                  >
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isAuthenticated ? user?.name : "Guest User"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {isAuthenticated ? user?.email : "Not signed in"}
                    </p>
                  </div>
                </div>

                {/* Auth CTA */}
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      navigate("/");
                    }}
                    className="mt-3 w-full py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setProfileOpen(false); navigate("/login"); }}
                    className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white transition-all"
                    style={{ backgroundColor: "var(--accent-deep)" }}
                  >
                    Sign In / Register
                  </button>
                )}
              </div>

              {/* Menu items */}
              <div className="p-2">
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5 text-left group/item"
                    >
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(96,165,250,0.10)" }}>
                        <User size={13} style={{ color: "var(--accent)" }} />
                      </div>
                      <div>
                        <p className="font-medium text-white/80 group-hover/item:text-white transition-colors leading-none">My Profile</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>View account details</p>
                      </div>
                    </button>

                    {user?.role === "admin" && (
                      <button
                        onClick={() => { setProfileOpen(false); navigate("/admin"); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-white/5 text-left group/item mt-1"
                      >
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(34,197,94,0.10)" }}>
                          <Settings size={13} style={{ color: "#4ade80" }} />
                        </div>
                        <div>
                          <p className="font-medium text-white/80 group-hover/item:text-white transition-colors leading-none">Admin Dashboard</p>
                          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>Manage store products</p>
                        </div>
                      </button>
                    )}
                  </>
                )}
                
                {!isAuthenticated && (
                  <div className="px-3 py-2 text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Please sign in to view menu
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="hidden md:block w-px h-6 mx-1" style={{ background: "rgba(255,255,255,0.10)" }} />

          {/* ── 5. CART ── */}
          <button
            onClick={() => { navigate("/cart"); closeAll(); }}
            className="relative p-2.5 rounded-xl text-white/65 hover:text-white hover:bg-white/5 transition-all duration-200"
            aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span
                className={`absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full text-white text-[9px] font-bold ${
                  cartPop ? "badge-pop" : ""
                }`}
                style={{ backgroundColor: "var(--accent-deep)" }}
                aria-live="polite"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

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

          {/* ── 7. HAMBURGER (mobile only) ── */}
          <button
            className="md:hidden p-2 rounded-xl text-white/65 hover:text-white hover:bg-white/5 transition-all duration-200"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>

    {/* ══════════════════════════════════════════════════
        MOBILE FULL-SCREEN MENU DRAWER
    ══════════════════════════════════════════════════ */}
    <div
      className={`fixed inset-0 z-40 flex flex-col transition-all duration-300 md:hidden ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "#060d1a", paddingTop: "64px" }}
      aria-hidden={!mobileMenuOpen}
    >
      {/* Search bar in drawer */}
      <div className="px-5 pt-6 pb-4">
        <form
          onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }}
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
              placeholder="Search tees, bags…"
              aria-label="Search products"
              className="w-full pl-9 pr-4 py-3 text-sm rounded-xl focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(96,165,250,0.25)",
                color: "#fff",
              }}
            />
          </div>
        </form>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 20px" }} />

      {/* Nav links */}
      <nav className="flex flex-col px-4 pt-4 gap-1" aria-label="Mobile navigation">
        <p
          className="text-[10px] font-semibold tracking-widest uppercase px-3 py-2"
          style={{ color: "var(--accent)" }}
        >
          Shop by Category
        </p>

        <Link
          to="/shop"
          onClick={closeAll}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "rgba(255,255,255,0.80)", background: "rgba(255,255,255,0.04)" }}
        >
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(96,165,250,0.12)" }}>
            <Package size={17} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="font-semibold text-white">All Products</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Browse everything</p>
          </div>
        </Link>

        <Link
          to="/shop?category=tshirt"
          onClick={closeAll}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "rgba(255,255,255,0.80)" }}
        >
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(96,165,250,0.10)" }}>
            <Shirt size={17} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="font-semibold text-white">T-Shirts</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Oversized · Polo · Vintage</p>
          </div>
        </Link>

        <Link
          to="/shop?category=bag"
          onClick={closeAll}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "rgba(255,255,255,0.80)" }}
        >
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(96,165,250,0.10)" }}>
            <ShoppingBag size={17} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="font-semibold text-white">Bags</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Totes · Slings · Backpacks</p>
          </div>
        </Link>
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 20px" }} />

      {/* Auth section */}
      <div className="px-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => { closeAll(); navigate("/profile"); }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all mb-2"
              style={{ color: "rgba(255,255,255,0.80)" }}
            >
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(96,165,250,0.10)" }}>
                <User size={17} style={{ color: "var(--accent)" }} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{user?.email}</p>
              </div>
            </button>
            {user?.role === "admin" && (
              <button
                onClick={() => { closeAll(); navigate("/admin"); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all mb-2"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(34,197,94,0.10)" }}>
                  <Settings size={17} style={{ color: "#4ade80" }} />
                </div>
                <p className="font-semibold text-white">Admin Dashboard</p>
              </button>
            )}
            <button
              onClick={() => { logout(); closeAll(); navigate("/"); }}
              className="w-full py-3 rounded-xl text-sm font-semibold mt-2 transition-all"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.20)" }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => { closeAll(); navigate("/login"); }}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ backgroundColor: "var(--accent-deep)" }}
          >
            Sign In / Register
          </button>
        )}
      </div>
    </div>
    </>
  );
};

export default Navbar;
