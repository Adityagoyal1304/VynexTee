// src/pages/RegisterPage.jsx
// Completely self-contained register page.
// To remove: delete this file + its route in App.jsx. Nothing else breaks.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "@/services/authService";
import useAuthStore from "@/store/authStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((s) => s.setAuth);

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

  /* helper to render a field */
  const Field = ({ id, label, type, icon: Icon, value, field, placeholder, show, onToggle, error }) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-semibold tracking-wide mb-1.5 uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          id={id}
          type={type === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          autoComplete={id}
          value={value}
          onChange={handleChange(field)}
          className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
          style={{
            backgroundColor: "var(--bg-page)",
            border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
            aria-label={show ? "Hide" : "Show"}
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{error}</p>}
    </div>
  );

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
            <Field
              id="register-name"
              label="Full Name"
              type="text"
              icon={User}
              value={form.name}
              field="name"
              placeholder="Aditya Goyal"
              error={errors.name}
            />
            <Field
              id="register-email"
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              field="email"
              placeholder="you@example.com"
              error={errors.email}
            />
            <Field
              id="new-password"
              label="Password"
              type="password"
              icon={Lock}
              value={form.password}
              field="password"
              placeholder="Min. 6 characters"
              show={showPw}
              onToggle={() => setShowPw((v) => !v)}
              error={errors.password}
            />
            <Field
              id="confirm-password"
              label="Confirm Password"
              type="password"
              icon={Lock}
              value={form.confirmPassword}
              field="confirmPassword"
              placeholder="••••••••"
              show={showCPw}
              onToggle={() => setShowCPw((v) => !v)}
              error={errors.confirmPassword}
            />

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
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
