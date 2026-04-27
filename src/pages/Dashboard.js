import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

function StatCard({ label, value, icon, color, sub, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      ...S.statCard,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, box-shadow 0.25s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "18", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span style={{ fontSize: 10, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>↑ Live</span>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginTop: 5 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#334155", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    API.get("/users").then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Users", value: loading ? "—" : users.length, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, color: "#3b82f6", sub: "Registered accounts", delay: 0 },
    { label: "Active Sessions", value: "12", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, color: "#10b981", sub: "Currently online", delay: 80 },
    { label: "API Requests", value: "4.2K", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, color: "#8b5cf6", sub: "Last 24 hours", delay: 160 },
    { label: "System Health", value: "99.9%", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, color: "#f59e0b", sub: "Uptime this month", delay: 240 },
  ];

  const recent = users.slice(-5).reverse().map((u, i) => ({
    name: u.name || u.username, email: u.email,
    action: i === 0 ? "Added" : i === 1 ? "Updated" : "Viewed",
    time: `${i + 1}h ago`,
    color: ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444"][i % 5],
  }));

  return (
    <Layout title="Dashboard">
      {/* Welcome banner */}
      <div style={{ ...S.banner, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 14 : 0 }}>
        <div style={S.bannerGlow} />
        <div>
          <h1 style={{ ...S.bannerTitle, fontSize: isMobile ? 18 : 24 }}>Good morning, Admin 👋</h1>
          <p style={S.bannerSub}>Here's what's happening with your system today.</p>
        </div>
        <button style={{ ...S.manageBtn, alignSelf: isMobile ? "flex-start" : "auto" }} onClick={() => navigate("/users")}
          onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#080c14"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#f1f5f9"; }}
        >
          Manage Users →
        </button>
      </div>

      {/* Stats grid — 2 cols on mobile, 4 on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 16, marginBottom: isMobile ? 14 : 24 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Bottom panels — stacked on mobile */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 12 : 16 }}>

        {/* Recent activity */}
        <div style={S.panel}>
          <div style={S.panelHeader}>
            <div>
              <h3 style={S.panelTitle}>Recent Activity</h3>
              <p style={S.panelSub}>Latest user actions</p>
            </div>
            <button style={S.viewAllBtn} onClick={() => navigate("/users")}
              onMouseEnter={e => e.currentTarget.style.color = "#34d399"}
              onMouseLeave={e => e.currentTarget.style.color = "#10b981"}
            >View all →</button>
          </div>
          <div>
            {loading ? [1,2,3].map(i => (
              <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ width:34, height:34, borderRadius:8, background:"rgba(255,255,255,0.05)", flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ height:11, borderRadius:4, background:"rgba(255,255,255,0.05)", width:"55%", marginBottom:6 }} />
                  <div style={{ height:9, borderRadius:4, background:"rgba(255,255,255,0.03)", width:"35%" }} />
                </div>
              </div>
            )) : recent.length === 0 ? (
              <p style={{ textAlign:"center", color:"#334155", padding:"30px 0", fontSize:13 }}>No users yet</p>
            ) : recent.map((a, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 8px", borderRadius:8, borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ width:34, height:34, borderRadius:8, background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#fff", fontSize:12, flexShrink:0 }}>
                  {a.name[0].toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:"#e2e8f0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.name}</div>
                  <div style={{ fontSize:11, color:"#475569", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.email}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20, display:"inline-block", background: a.action==="Added"?"rgba(16,185,129,0.15)":a.action==="Deleted"?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)", color: a.action==="Added"?"#10b981":a.action==="Deleted"?"#ef4444":"#60a5fa" }}>{a.action}</div>
                  <div style={{ fontSize:10, color:"#334155", marginTop:2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System info */}
        <div style={S.panel}>
          <div style={S.panelHeader}>
            <div>
              <h3 style={S.panelTitle}>System Info</h3>
              <p style={S.panelSub}>Backend & stack details</p>
            </div>
          </div>
          {[
            { label:"Backend",  value:"Spring Boot 3",    color:"#10b981" },
            { label:"Database", value:"JPA / Hibernate",  color:"#3b82f6" },
            { label:"Auth",     value:"JWT Bearer Token", color:"#8b5cf6" },
            { label:"API Port", value:"localhost:8084",   color:"#f59e0b" },
            { label:"Frontend", value:"React 18 + MUI",  color:"#60a5fa" },
            { label:"Status",   value:"● Running",        color:"#10b981" },
          ].map((item, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 8px", borderRadius:7, borderBottom:"1px solid rgba(255,255,255,0.03)", transition:"background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize:13, color:"#475569" }}>{item.label}</span>
              <span style={{ fontSize:13, fontWeight:500, color:item.color }}>{item.value}</span>
            </div>
          ))}

          {/* Mini chart */}
          <div style={{ marginTop:14, padding:"12px", background:"rgba(255,255,255,0.02)", borderRadius:10, border:"1px solid rgba(255,255,255,0.04)" }}>
            <p style={{ fontSize:10, color:"#334155", marginBottom:8, fontWeight:600, letterSpacing:"0.05em" }}>USER GROWTH</p>
            <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:44 }}>
              {[30,55,40,70,60,80,65,90,75,100,85,users.length>0?100:95].map((h,i) => (
                <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:"3px 3px 0 0", background: i===11?"#10b981":"rgba(16,185,129,0.2)" }} />
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontSize:9, color:"#334155" }}>Jan</span>
              <span style={{ fontSize:9, color:"#334155" }}>Dec</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const S = {
  banner: { background:"linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.06))", border:"1px solid rgba(16,185,129,0.15)", borderRadius:14, padding:"22px 24px", display:"flex", justifyContent:"space-between", marginBottom:16, position:"relative", overflow:"hidden" },
  bannerGlow: { position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.15) 0%,transparent 70%)", pointerEvents:"none" },
  bannerTitle: { fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#f1f5f9", marginBottom:4 },
  bannerSub: { color:"#64748b", fontSize:13 },
  manageBtn: { padding:"9px 18px", borderRadius:9, border:"1px solid rgba(255,255,255,0.15)", background:"transparent", color:"#f1f5f9", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.2s", flexShrink:0 },
  statCard: { background:"#0d1220", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"18px", boxShadow:"0 4px 16px rgba(0,0,0,0.3)", cursor:"default" },
  panel: { background:"#0d1220", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"20px", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" },
  panelHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 },
  panelTitle: { fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#f1f5f9" },
  panelSub: { fontSize:11, color:"#475569", marginTop:2 },
  viewAllBtn: { background:"none", border:"none", color:"#10b981", cursor:"pointer", fontSize:12, fontWeight:600, transition:"color 0.2s", padding:0 },
};