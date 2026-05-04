import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { saveToken } from "../services/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!username || !password) {
    setError("Please fill in all fields.");
    return;
  }

  setLoading(true);

  try {
    const res = await API.post(
      "/auth/login",
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("LOGIN RESPONSE:", res.data);

    // ✅ FIX: always store only token
    saveToken(res.data.token);

    navigate("/dashboard");

  } catch (err) {
    console.log("ERROR:", err);
    console.log("RESPONSE:", err.response);

    setError(
      err.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={S.page}>
      {/* Animated BG blobs */}
      <div style={S.blob1} />
      <div style={S.blob2} />
      <div style={S.blob3} />

      {/* Grid lines */}
      <div style={S.grid} />

      <div style={{ ...S.wrapper, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)" }}>

        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="white" opacity="0.92"/>
              <circle cx="16" cy="16" r="7" fill="#10b981"/>
            </svg>
          </div>
          <span style={S.logoText}>CoreX</span>
        </div>

        <div style={S.card}>
          {/* Card inner glow */}
          <div style={S.cardGlow} />

          <div style={S.cardHeader}>
            <h1 style={S.title}>Welcome back</h1>
            <p style={S.subtitle}>Sign in to your admin workspace</p>
          </div>

          {error && (
            <div style={S.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#ef4444"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={S.form}>
            <div style={S.fieldGroup}>
              <label style={S.label}>Username</label>
              <div style={S.inputWrap}>
                <svg style={S.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#64748b" strokeWidth="2"/>
                </svg>
                <input
                  style={S.input}
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  autoComplete="username"
                />
              </div>
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>Password</label>
              <div style={S.inputWrap}>
                <svg style={S.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#64748b" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  style={S.input}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                />
                <button type="button" style={S.eyeBtn} onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#64748b" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#64748b" strokeWidth="2"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...S.btn,
                ...(loading ? S.btnLoading : {}),
              }}
              disabled={loading}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(16,185,129,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,185,129,0.35)"; }}
            >
              {loading ? (
                <span style={S.spinner} />
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginLeft:8}}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p style={S.hint}>
            Secured with JWT authentication
          </p>
        </div>

        <p style={S.footer}>© 2026 CoreX · Enterprise Management System</p>
      </div>

      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,50px) scale(1.1)} 66%{transform:translate(40px,-20px) scale(0.9)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,30px) scale(1.05)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        input:focus { outline:none; border-color: rgba(16,185,129,0.7) !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important; }
        input::placeholder { color: #334155; }
        input { transition: border-color 0.2s, box-shadow 0.2s; }
      `}</style>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#080c14",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },
  blob1: {
    position: "absolute", width: 500, height: 500,
    borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
    top: "-100px", left: "-100px",
    animation: "blob1 12s ease-in-out infinite",
  },
  blob2: {
    position: "absolute", width: 400, height: 400,
    borderRadius: "50%", background: "radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)",
    bottom: "-80px", right: "-80px",
    animation: "blob2 15s ease-in-out infinite",
  },
  blob3: {
    position: "absolute", width: 300, height: 300,
    borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
    top: "50%", left: "60%",
    animation: "blob3 10s ease-in-out infinite",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    pointerEvents: "none",
  },
  wrapper: {
    position: "relative", zIndex: 1,
    display: "flex", flexDirection: "column", alignItems: "center",
    width: "100%", maxWidth: 440,
  },
  logoRow: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 32,
  },
  logoIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22, fontWeight: 800, color: "#f1f5f9",
    letterSpacing: "-0.03em",
  },
  card: {
    width: "100%",
    background: "#0d1220",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: "40px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
    position: "relative",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute", top: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "60%", height: 1,
    background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)",
  },
  cardHeader: { marginBottom: 28 },
  title: {
    fontSize: 28, fontWeight: 800, color: "#f1f5f9",
    fontFamily: "'Syne', sans-serif", marginBottom: 6,
  },
  subtitle: { color: "#64748b", fontSize: 14, fontWeight: 400 },
  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 8, padding: "10px 14px",
    color: "#fca5a5", fontSize: 13, marginBottom: 20,
  },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#94a3b8" },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute", left: 14, top: "50%",
    transform: "translateY(-50%)", pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "12px 44px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, color: "#f1f5f9",
    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: {
    position: "absolute", right: 14, top: "50%",
    transform: "translateY(-50%)",
    background: "none", border: "none",
    cursor: "pointer", padding: 0, display: "flex",
  },
  btn: {
    marginTop: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "13px 24px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white", fontFamily: "'Syne', sans-serif",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
    boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
    transition: "all 0.2s",
  },
  btnLoading: { opacity: 0.75, cursor: "not-allowed" },
  spinner: {
    width: 18, height: 18, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  hint: {
    marginTop: 20, textAlign: "center",
    fontSize: 12, color: "#334155",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
  },
  footer: { marginTop: 28, fontSize: 12, color: "#1e293b" },
};