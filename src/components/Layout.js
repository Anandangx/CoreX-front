import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../services/auth";

const NAV_ITEMS = [
  {
    label: "Dashboard", path: "/dashboard",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg>),
  },
  {
    label: "Users", path: "/users",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function Layout({ children, title = "Dashboard" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);
  useEffect(() => { if (!isMobile) setDrawerOpen(false); }, [isMobile]);

  const handleLogout = () => { logout(); navigate("/"); };
  const sidebarW = isMobile ? 260 : (collapsed ? 72 : 260);

  const SidebarContent = () => (
    <>
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <polygon points="16,3 29,10 29,22 16,29 3,22 3,10" fill="white" opacity="0.95"/>
            <circle cx="16" cy="16" r="6" fill="#10b981"/>
          </svg>
        </div>
        {(!collapsed || isMobile) && <span style={S.logoText}>CoreX</span>}
        {isMobile && (
          <button style={S.drawerClose} onClick={() => setDrawerOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      {(!collapsed || isMobile) && <p style={S.navSectionLabel}>MAIN MENU</p>}

      <nav style={S.nav}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              style={{ ...S.navItem, ...(active ? S.navItemActive : {}), justifyContent: (collapsed && !isMobile) ? "center" : "flex-start" }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ ...S.navIcon, color: active ? "#10b981" : "#64748b" }}>{item.icon}</span>
              {(!collapsed || isMobile) && (
                <span style={{ fontSize: 14, fontWeight: 500, color: active ? "#f1f5f9" : "#64748b", whiteSpace: "nowrap" }}>{item.label}</span>
              )}
              {active && (!collapsed || isMobile) && <span style={S.activeIndicator} />}
            </Link>
          );
        })}
      </nav>

      <div style={S.sidebarBottom}>
        <div style={S.sidebarDivider} />
        <button style={{ ...S.logoutBtn, justifyContent: (collapsed && !isMobile) ? "center" : "flex-start" }}
          onClick={handleLogout}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {(!collapsed || isMobile) && <span style={{ color: "#ef4444", fontSize: 13, fontWeight: 500 }}>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div style={S.root}>
      {!isMobile && (
        <aside style={{ ...S.sidebar, width: sidebarW }}>
          <SidebarContent />
        </aside>
      )}

      {isMobile && drawerOpen && (
        <div style={S.overlay} onClick={() => setDrawerOpen(false)} />
      )}

      {isMobile && (
        <aside style={{
          ...S.sidebar, width: 260,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", zIndex: 300,
        }}>
          <SidebarContent />
        </aside>
      )}

      <div style={{ ...S.main, marginLeft: isMobile ? 0 : sidebarW, transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        <header style={S.topbar}>
          <div style={S.topbarLeft}>
            <button style={S.collapseBtn}
              onClick={() => isMobile ? setDrawerOpen(!drawerOpen) : setCollapsed(!collapsed)}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="6" x2="21" y2="6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div>
              <h2 style={{ ...S.pageTitle, fontSize: isMobile ? 15 : 18 }}>{title}</h2>
              {!isMobile && <p style={S.breadcrumb}>Admin Panel → {title}</p>}
            </div>
          </div>

          <div style={S.topbarRight}>
            {!isMobile && (
              <button style={S.iconBtn}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={S.badge} />
              </button>
            )}

            <div style={S.avatarWrap} onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div style={S.avatar}>A</div>
              {!isMobile && (
                <div style={S.avatarInfo}>
                  <span style={S.avatarName}>Admin</span>
                  <span style={S.avatarRole}>Super Admin</span>
                </div>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 4 }}>
                <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {userMenuOpen && (
              <div style={S.dropdown}>
                <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Admin</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>admin@corex.app</div>
                </div>
                <div style={S.dropdownItem} onClick={handleLogout}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ color: "#ef4444" }}>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </header>

        <main style={{ ...S.content, padding: isMobile ? "14px" : "28px" }}>
          {children}
        </main>

        {isMobile && (
          <nav style={S.bottomNav}>
            {NAV_ITEMS.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} style={{ ...S.bottomNavItem, color: active ? "#10b981" : "#475569" }}>
                  <span style={{ color: active ? "#10b981" : "#475569" }}>{item.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, marginTop: 3 }}>{item.label}</span>
                  {active && <span style={S.bottomNavDot} />}
                </Link>
              );
            })}
            <button style={{ ...S.bottomNavItem, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }} onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 10, fontWeight: 600, marginTop: 3 }}>Logout</span>
            </button>
          </nav>
        )}
      </div>
      <style>{`a{text-decoration:none;}*{box-sizing:border-box;}`}</style>
    </div>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', sans-serif" },
  sidebar: {
    position: "fixed", top: 0, left: 0, bottom: 0,
    background: "#0a0f1a", borderRight: "1px solid rgba(255,255,255,0.05)",
    display: "flex", flexDirection: "column",
    transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
    zIndex: 200, overflowX: "hidden", boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)", zIndex: 250 },
  logo: { display: "flex", alignItems: "center", gap: 10, padding: "20px 16px", minHeight: 64, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  logoIcon: { flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(16,185,129,0.35)" },
  logoText: { fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em", whiteSpace: "nowrap", flex: 1 },
  drawerClose: { background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 },
  navSectionLabel: { fontSize: 10, fontWeight: 600, color: "#334155", letterSpacing: "0.1em", padding: "18px 20px 8px", whiteSpace: "nowrap" },
  nav: { flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: 2 },
  navItem: { display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, transition: "all 0.2s", cursor: "pointer", position: "relative", textDecoration: "none" },
  navItemActive: { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" },
  navIcon: { flexShrink: 0, display: "flex" },
  activeIndicator: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" },
  sidebarBottom: { padding: "10px 10px 20px" },
  sidebarDivider: { height: 1, background: "rgba(255,255,255,0.05)", margin: "10px 0" },
  logoutBtn: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", transition: "background 0.2s" },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: "rgba(8,12,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 },
  topbarLeft: { display: "flex", alignItems: "center", gap: 12 },
  collapseBtn: { width: 36, height: 36, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", flexShrink: 0 },
  pageTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 },
  breadcrumb: { fontSize: 12, color: "#334155", marginTop: 1 },
  topbarRight: { display: "flex", alignItems: "center", gap: 8, position: "relative" },
  iconBtn: { width: 36, height: 36, borderRadius: 9, background: "transparent", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background 0.2s" },
  badge: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #080c14" },
  avatarWrap: { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px 6px 6px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "background 0.2s" },
  avatar: { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: 13 },
  avatarInfo: { display: "flex", flexDirection: "column" },
  avatarName: { fontSize: 13, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.2 },
  avatarRole: { fontSize: 11, color: "#475569", lineHeight: 1.2 },
  dropdown: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#0d1220", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "6px", minWidth: 180, boxShadow: "0 16px 48px rgba(0,0,0,0.5)", zIndex: 400 },
  dropdownItem: { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 7, cursor: "pointer", fontSize: 13, transition: "background 0.15s" },
  content: { flex: 1, background: "#080c14", paddingBottom: 80, minHeight: "calc(100vh - 64px)" },
  bottomNav: { position: "fixed", bottom: 0, left: 0, right: 0, height: 64, background: "#0a0f1a", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 150, backdropFilter: "blur(12px)", boxShadow: "0 -4px 24px rgba(0,0,0,0.4)" },
  bottomNavItem: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, height: "100%", textDecoration: "none", position: "relative", padding: "8px 0" },
  bottomNavDot: { position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#3b82f6" },
};