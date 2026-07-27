// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email,     setEmail]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    // Simulate API call — replace with real endpoint when available
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4 animate-fadeIn"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* Floating background blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
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
              <KeyRound size={24} className="text-white" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
            >
              Forgot password?
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {/* Success state */}
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)" }}
              >
                <CheckCircle size={32} style={{ color: "#4ade80" }} />
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Check your email
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  If <span className="font-medium" style={{ color: "var(--accent)" }}>{email}</span> is
                  registered, you'll receive password reset instructions shortly.
                </p>
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                Didn't receive it? Check your spam folder.
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <label
                  htmlFor="fp-email"
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
                    id="fp-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-page)",
                      border: error
                        ? "1px solid rgba(239,68,68,0.6)"
                        : "1px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                {error && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{error}</p>}
              </div>

              <button
                id="fp-submit"
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
                    Sending…
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-light)" }} />
          </div>

          {/* Back to login */}
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-semibold transition-colors hover:underline"
              style={{ color: "var(--accent)" }}
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
