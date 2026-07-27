// src/pages/LoginPage.jsx
// Completely self-contained login page.
// To remove: delete this file + its route in App.jsx. Nothing else breaks.

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser } from "@/services/authService";
import useAuthStore from "@/store/authStore";

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const setAuth   = useAuthStore((s) => s.setAuth);
  const user      = useAuthStore((s) => s.user);

  const from = location.state?.from?.pathname || "/";

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)        e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });
      setAuth(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 animate-fadeIn"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Floating background blobs */}
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "10%",
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "8%",
          width: 240, height: 240,
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                boxShadow: "0 0 24px rgba(96,165,250,0.30)",
              }}
            >
              <LogIn size={24} className="text-white" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
            >
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Sign in to your VynexTee account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold tracking-wide mb-1.5 uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-page)",
                    border: errors.email
                      ? "1px solid rgba(239,68,68,0.6)"
                      : "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold tracking-wide mb-1.5 uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-page)",
                    border: errors.password
                      ? "1px solid rgba(239,68,68,0.6)"
                      : "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                backgroundColor: loading ? "rgba(59,130,246,0.5)" : "var(--accent-deep)",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 20px rgba(59,130,246,0.25)",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    style={{ display: "inline-block" }}
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-light)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-light)" }} />
          </div>

          {/* Register link */}
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back to shop */}
        <p className="text-center mt-5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link to="/shop" className="hover:underline" style={{ color: "var(--text-secondary)" }}>
            ← Continue browsing without signing in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
