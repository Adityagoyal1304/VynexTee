// src/pages/RegisterPage.jsx
// Completely self-contained register page.
// To remove: delete this file + its route in App.jsx. Nothing else breaks.
// FIX: All inputs are inline JSX — no helper component defined inside the render
// function (which would cause React to unmount/remount on every keystroke).

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "@/services/authService";
import useAuthStore from "@/store/authStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);
  const user     = useAuthStore((s) => s.user);

  React.useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [showPw,  setShowPw]  = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name    = "Name is required";
    if (!form.email.trim())        e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)            e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.confirmPassword)     e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
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
      const data = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setAuth(data);
      toast.success(`Welcome to VynexTee, ${data.name}!`);
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    backgroundColor: "var(--bg-page)",
    border: hasError ? "1px solid rgba(239,68,68,0.6)" : "1px solid var(--border)",
    color: "var(--text-primary)",
  });

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 animate-fadeIn"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "10%", right: "12%",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "5%",
          width: 260, height: 260,
          background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460 }}>
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
          <div className="mb-7 text-center">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                boxShadow: "0 0 24px rgba(96,165,250,0.30)",
              }}
            >
              <UserPlus size={24} className="text-white" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
            >
              Create account
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Join VynexTee — premium tees & more
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="register-name"
                className="block text-xs font-semibold tracking-wide mb-1.5 uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Aditya Goyal"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                  style={inputStyle(errors.name)}
                />
              </div>
              {errors.name && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="register-email"
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
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                  style={inputStyle(errors.email)}
                />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="new-password"
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
                  id="new-password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                  style={inputStyle(errors.password)}
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
              {errors.password && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-xs font-semibold tracking-wide mb-1.5 uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="confirm-password"
                  type={showCPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                  style={inputStyle(errors.confirmPassword)}
                />
                <button
                  type="button"
                  onClick={() => setShowCPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                  aria-label={showCPw ? "Hide password" : "Show password"}
                >
                  {showCPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
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
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
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

          {/* Login link */}
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold transition-colors hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back link */}
        <p className="text-center mt-5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link to="/shop" className="hover:underline" style={{ color: "var(--text-secondary)" }}>
            ← Continue browsing without signing in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
