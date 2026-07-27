// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { resetPasswordRequest } from "@/services/authService";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirmPw,   setShowConfirmPw]   = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [submitted,       setSubmitted]       = useState(false);
  const [error,           setError]           = useState("");

  const validate = () => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    try {
      await resetPasswordRequest(token, password);
      setSubmitted(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid or expired reset token";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
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
              Reset Password
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Create a new secure password for your account.
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
                  Password Reset Complete!
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Your password has been changed successfully. Redirecting you to sign in...
                </p>
              </div>
              <Link
                to="/login"
                className="mt-3 inline-block px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
                style={{ backgroundColor: "var(--accent-deep)" }}
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} noValidate>
              {/* New Password */}
              <div className="mb-4">
                <label
                  htmlFor="rp-password"
                  className="block text-xs font-semibold tracking-wide mb-1.5 uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    id="rp-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-page)",
                      border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label
                  htmlFor="rp-confirm-password"
                  className="block text-xs font-semibold tracking-wide mb-1.5 uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    id="rp-confirm-password"
                    type={showConfirmPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-page)",
                      border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {error && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{error}</p>}
              </div>

              <button
                id="rp-submit"
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
                    Resetting…
                  </>
                ) : (
                  "Update Password"
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

export default ResetPasswordPage;
