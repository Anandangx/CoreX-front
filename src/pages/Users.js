import React, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  const colors = { success:"#10b981", error:"#ef4444", info:"#3b82f6" };
  return (
    <div style={{ position:"fixed", bottom:80, right:16, zIndex:9999, background:"#0d1220", border:`1px solid ${colors[type]}40`, borderRadius:12, padding:"12px 18px", boxShadow:"0 16px 48px rgba(0,0,0,0.5)", display:"flex", alignItems:"center", gap:10, animation:"slideIn 0.3s ease", fontFamily:"'DM Sans',sans-serif", maxWidth:"90vw" }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:colors[type], flexShrink:0, boxShadow:`0 0 8px ${colors[type]}` }} />
      <span style={{ fontSize:13, color:"#e2e8f0" }}>{msg}</span>
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#475569", padding:0, marginLeft:4, fontSize:16 }}>×</button>
    </div>
  );
}

function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div style={M.overlay} onClick={onCancel}>
      <div style={M.modal} onClick={e => e.stopPropagation()}>
        <div style={{ width:48, height:48, borderRadius:12, margin:"0 auto 14px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#f1f5f9", textAlign:"center", marginBottom:8 }}>Delete User</h3>
        <p style={{ fontSize:13, color:"#64748b", textAlign:"center", lineHeight:1.6, marginBottom:20 }}>Are you sure you want to delete <strong style={{color:"#f1f5f9"}}>{user?.name || user?.username}</strong>? This cannot be undone.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button style={M.cancelBtn} onClick={onCancel} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Cancel</button>
          <button style={M.deleteBtn} onClick={onConfirm} onMouseEnter={e=>e.currentTarget.style.background="#dc2626"} onMouseLeave={e=>e.currentTarget.style.background="#ef4444"}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function UserModal({ form, editId, onChange, onSubmit, onClose, loading }) {
  const firstRef = useRef();
  useEffect(() => { setTimeout(() => firstRef.current?.focus(), 100); }, []);
  return (
    <div style={M.overlay} onClick={onClose}>
      <div style={M.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#10b981,#059669)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                {editId ? <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/> : <><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><circle cx="8.5" cy="7" r="4" stroke="#fff" strokeWidth="1.8"/><line x1="20" y1="8" x2="20" y2="14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><line x1="23" y1="11" x2="17" y2="11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></>}
              </svg>
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#f1f5f9" }}>{editId ? "Edit User" : "Add User"}</h3>
          </div>
          <button style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", borderRadius:6 }} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[{name:"username",label:"Username",placeholder:"e.g. jdoe",type:"text"},{name:"name",label:"Full Name",placeholder:"e.g. John Doe",type:"text"},{name:"email",label:"Email",placeholder:"e.g. john@company.com",type:"email"}].map(f => (
            <div key={f.name}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", letterSpacing:"0.04em", display:"block", marginBottom:5 }}>{f.label}</label>
              <input ref={f.name==="username"?firstRef:undefined} type={f.type} name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={onChange} style={M.input}
                onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.7)";e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,0.12)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";e.target.style.boxShadow="none";}}
              />
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, marginTop:22, justifyContent:"flex-end" }}>
          <button style={M.cancelBtn} onClick={onClose} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Cancel</button>
          <button style={{ ...M.saveBtn, opacity:loading?0.7:1 }} onClick={onSubmit} disabled={loading}>{loading?"Saving…":editId?"Update":"Create"}</button>
        </div>
      </div>
    </div>
  );
}

/* ── MOBILE CARD VIEW ── */
function UserCard({ user, index, onEdit, onDelete }) {
  return (
    <div style={{ background:"#0d1220", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"14px", marginBottom:10, animation:"fadeRow 0.3s ease both", animationDelay:`${index*40}ms` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:`hsl(${(user.id*47)%360},60%,40%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>
          {(user.name||user.username||"?")[0].toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, color:"#f1f5f9" }}>{user.username}</div>
          <div style={{ fontSize:12, color:"#64748b" }}>{user.name}</div>
        </div>
      </div>
      <div style={{ fontSize:12, color:"#475569", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:6, padding:"6px 10px", fontFamily:"monospace", marginBottom:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {user.email}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button style={{ flex:1, padding:"8px", borderRadius:8, border:"1px solid rgba(16,185,129,0.2)", background:"rgba(16,185,129,0.08)", color:"#10b981", fontSize:12, fontWeight:600, cursor:"pointer" }} onClick={() => onEdit(user)}>Edit</button>
        <button style={{ flex:1, padding:"8px", borderRadius:8, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:12, fontWeight:600, cursor:"pointer" }} onClick={() => onDelete(user)}>Delete</button>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function Users() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const PER_PAGE = isMobile ? 6 : 8;

  const [form, setForm] = useState({ username:"", name:"", email:"" });
  const showToast = (msg, type="success") => setToast({ msg, type });

  const getUsers = useCallback(async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data); setFiltered(res.data);
    } catch { showToast("Failed to load users", "error"); }
    finally { setLoading(false); setTimeout(() => setMounted(true), 50); }
  }, []);

  useEffect(() => { getUsers(); }, [getUsers]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u => u.username?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)));
    setPage(0);
  }, [search, users]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = () => { setForm({ username:"", name:"", email:"" }); setEditId(null); setOpen(true); };
  const handleEdit = row => { setForm({ username:row.username, name:row.name, email:row.email }); setEditId(row.id); setOpen(true); };

  const handleSubmit = async () => {
    if (!form.username || !form.name || !form.email) { showToast("Please fill all fields","error"); return; }
    setFormLoading(true);
    try {
      if (editId) { await API.put(`/user/${editId}`,form); showToast("User updated"); }
      else { await API.post("/user",form); showToast("User created"); }
      setOpen(false); getUsers();
    } catch { showToast("Operation failed","error"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    try { await API.delete(`/user/${deleteTarget.id}`); showToast("User deleted"); setDeleteTarget(null); getUsers(); }
    catch { showToast("Delete failed","error"); }
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, (page+1) * PER_PAGE);

  return (
    <Layout title="User Management">
      <div style={{ opacity:mounted?1:0, transform:mounted?"none":"translateY(10px)", transition:"all 0.4s ease" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16, flexWrap:"wrap", gap:10 }}>
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:isMobile?17:20, fontWeight:800, color:"#f1f5f9" }}>All Users</h2>
            <p style={{ fontSize:12, color:"#475569", marginTop:3 }}>{users.length} total · {filtered.length} shown</p>
          </div>
          <button style={S.addBtn} onClick={handleAdd}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(16,185,129,0.45)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 16px rgba(16,185,129,0.25)";}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            {isMobile ? "Add" : "Add User"}
          </button>
        </div>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:14 }}>
          <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#475569" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#475569" strokeWidth="2" strokeLinecap="round"/></svg>
          <input style={S.searchInput} placeholder={isMobile ? "Search users…" : "Search by username, name or email…"} value={search} onChange={e=>setSearch(e.target.value)}
            onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.5)";e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,0.1)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.06)";e.target.style.boxShadow="none";}}
          />
          {search && <button style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:4, display:"flex" }} onClick={()=>setSearch("")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>}
        </div>

        {/* MOBILE: card view / DESKTOP: table view */}
        {isMobile ? (
          <div>
            {loading ? [1,2,3].map(i=>(
              <div key={i} style={{ background:"#0d1220", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:14, marginBottom:10 }}>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,0.05)" }} />
                  <div style={{ flex:1 }}>
                    <div style={{ height:12, borderRadius:4, background:"rgba(255,255,255,0.05)", width:"50%", marginBottom:6 }} />
                    <div style={{ height:10, borderRadius:4, background:"rgba(255,255,255,0.03)", width:"35%" }} />
                  </div>
                </div>
              </div>
            )) : paged.length===0 ? (
              <div style={{ textAlign:"center", padding:"50px 20px", color:"#334155" }}>
                <p style={{ fontWeight:600 }}>No users found</p>
                <p style={{ fontSize:12, marginTop:4 }}>Try a different search</p>
              </div>
            ) : paged.map((u,i)=><UserCard key={u.id} user={u} index={i} onEdit={handleEdit} onDelete={setDeleteTarget}/>)}
          </div>
        ) : (
          <div style={{ background:"#0d1220", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <div style={{ display:"flex", background:"rgba(255,255,255,0.025)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 20px" }}>
              {["#","Username","Full Name","Email","Actions"].map((h,i)=>(
                <div key={h} style={{ flex:[0.3,1,1,1.5,1][i], padding:"12px 8px", fontSize:11, fontWeight:700, color:"#475569", letterSpacing:"0.06em", textTransform:"uppercase" }}>{h}</div>
              ))}
            </div>
            {loading ? [1,2,3,4,5].map(i=>(
              <div key={i} style={{ display:"flex", padding:"0 20px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                {[0.3,1,1,1.5,1].map((f,j)=>(
                  <div key={j} style={{ flex:f, padding:"16px 8px" }}>
                    <div style={{ height:12, borderRadius:4, background:"rgba(255,255,255,0.04)", width:`${50+j*10}%` }} />
                  </div>
                ))}
              </div>
            )) : paged.length===0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#334155" }}>
                <p style={{ fontWeight:600 }}>No users found</p>
              </div>
            ) : paged.map((u,i)=>(
              <div key={u.id} style={{ display:"flex", alignItems:"center", padding:"0 20px", borderBottom:"1px solid rgba(255,255,255,0.03)", transition:"background 0.15s", animation:"fadeRow 0.3s ease both", animationDelay:`${i*40}ms` }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.025)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{ flex:0.3, padding:"14px 8px", fontSize:12, color:"#334155" }}>{page*PER_PAGE+i+1}</div>
                <div style={{ flex:1, padding:"14px 8px", display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`hsl(${(u.id*47)%360},60%,40%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>
                    {(u.name||u.username||"?")[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{u.username}</span>
                </div>
                <div style={{ flex:1, padding:"14px 8px", fontSize:13, color:"#94a3b8" }}>{u.name}</div>
                <div style={{ flex:1.5, padding:"14px 8px" }}>
                  <span style={{ fontSize:12, color:"#64748b", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, padding:"3px 8px", fontFamily:"monospace" }}>{u.email}</span>
                </div>
                <div style={{ flex:1, padding:"14px 8px", display:"flex", gap:6 }}>
                  <button style={S.editBtn} onClick={()=>handleEdit(u)} onMouseEnter={e=>{e.currentTarget.style.background="rgba(16,185,129,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(16,185,129,0.08)";}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/></svg>
                    Edit
                  </button>
                  <button style={S.delBtn} onClick={()=>setDeleteTarget(u)} onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.08)";}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
            <span style={{ fontSize:12, color:"#475569" }}>Page {page+1} of {totalPages}</span>
            <div style={{ display:"flex", gap:4 }}>
              <button style={{ ...S.pageBtn, opacity:page===0?0.3:1 }} disabled={page===0} onClick={()=>setPage(p=>p-1)}>←</button>
              {Array.from({length:totalPages},(_,i)=>(
                <button key={i} style={{ ...S.pageBtn, ...(page===i?S.pageBtnActive:{}) }} onClick={()=>setPage(i)}>{i+1}</button>
              ))}
              <button style={{ ...S.pageBtn, opacity:page>=totalPages-1?0.3:1 }} disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)}>→</button>
            </div>
          </div>
        )}
      </div>

      {open && <UserModal form={form} editId={editId} onChange={handleChange} onSubmit={handleSubmit} onClose={()=>setOpen(false)} loading={formLoading}/>}
      {deleteTarget && <DeleteModal user={deleteTarget} onConfirm={handleDelete} onCancel={()=>setDeleteTarget(null)}/>}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <style>{`
        @keyframes fadeRow{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
        input::placeholder{color:#334155;}
        input{transition:border-color 0.2s,box-shadow 0.2s;}
      `}</style>
    </Layout>
  );
}

const S = {
  addBtn: { display:"flex", alignItems:"center", gap:7, padding:"10px 18px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", boxShadow:"0 4px 16px rgba(16,185,129,0.25)", transition:"all 0.2s" },
  searchInput: { width:"100%", padding:"11px 40px", background:"#0d1220", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, color:"#f1f5f9", fontSize:14, fontFamily:"'DM Sans',sans-serif" },
  editBtn: { display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:7, border:"1px solid rgba(16,185,129,0.15)", background:"rgba(16,185,129,0.08)", color:"#10b981", fontSize:12, fontWeight:600, cursor:"pointer", transition:"background 0.15s" },
  delBtn: { display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:7, border:"1px solid rgba(239,68,68,0.15)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:12, fontWeight:600, cursor:"pointer", transition:"background 0.15s" },
  pageBtn: { width:30, height:30, borderRadius:7, border:"1px solid rgba(255,255,255,0.07)", background:"#0d1220", color:"#94a3b8", fontSize:12, fontWeight:600, cursor:"pointer" },
  pageBtnActive: { background:"rgba(16,185,129,0.15)", borderColor:"rgba(16,185,129,0.35)", color:"#10b981" },
};

const M = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"16px" },
  modal: { background:"#0d1220", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"24px", width:"100%", maxWidth:400, boxShadow:"0 32px 80px rgba(0,0,0,0.7)", animation:"slideModal 0.25s cubic-bezier(0.4,0,0.2,1)", fontFamily:"'DM Sans',sans-serif" },
  input: { width:"100%", padding:"10px 12px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, color:"#f1f5f9", fontSize:13, fontFamily:"'DM Sans',sans-serif" },
  cancelBtn: { flex:1, padding:"10px", borderRadius:9, border:"1px solid rgba(255,255,255,0.08)", background:"transparent", color:"#94a3b8", fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.15s" },
  saveBtn: { flex:1, padding:"10px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer" },
  deleteBtn: { flex:1, padding:"10px", borderRadius:9, border:"none", background:"#ef4444", color:"#fff", fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.15s" },
};