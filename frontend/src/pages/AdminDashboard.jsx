import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  auth, logoutUser, getCurrentUserData,
  getAllUsers, approveUser, banUser, updateUserRole, listenToAllUsers,
} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

/* ─── MOCK DATA ─────────────────────────────────────────────────────────────── */
const MOCK_USERS = [
  { id:'u1', name:'Gilbert Nyange',   email:'gilbert@farm.com',   role:'farmer', farmName:'Nyange Poultry',    approved:true,  createdAt:'2026-01-10', birds:1000, eggs:284, revenue:35400 },
  { id:'u2', name:'Amina Wanjiru',    email:'amina@sunrisefarm.ke',role:'farmer', farmName:'Sunrise Poultry',   approved:true,  createdAt:'2026-01-22', birds:650,  eggs:198, revenue:21800 },
  { id:'u3', name:'John Kamau',       email:'john@kamaufarm.com',  role:'farmer', farmName:'Kamau Farm',         approved:true,  createdAt:'2026-02-05', birds:420,  eggs:110, revenue:14200 },
  { id:'u4', name:'Fatuma Hassan',    email:'fatuma@hassan.co.ke', role:'farmer', farmName:'Hassan Layers',      approved:false, createdAt:'2026-03-14', birds:0,    eggs:0,   revenue:0 },
  { id:'u5', name:'Peter Otieno',     email:'peter@otieno.farm',   role:'farmer', farmName:'Otieno Broilers',    approved:true,  createdAt:'2026-02-18', birds:800,  eggs:0,   revenue:28600 },
  { id:'u6', name:'Grace Muthoni',    email:'grace@admin.com',     role:'admin',  farmName:'',                   approved:true,  createdAt:'2025-12-01', birds:null, eggs:null,revenue:null },
  { id:'u7', name:'David Kipchoge',   email:'david@kipchoge.farm', role:'farmer', farmName:'Kipchoge Poultry',   approved:false, createdAt:'2026-03-17', birds:0,    eggs:0,   revenue:0 },
];

const SYSTEM_STATS = [
  { icon:'🏗️', val:'5',          label:'Active Farms',          color:'var(--gold)',    trend:'↑ 2 this month' },
  { icon:'🐔', val:'2,870',      label:'Total Birds Monitored', color:'var(--success)', trend:'↑ 12% vs last month' },
  { icon:'🥚', val:'592',        label:'Eggs Collected Today',  color:'var(--info)',    trend:'↑ 8%' },
  { icon:'💰', val:'KSh 100K',   label:'System Revenue (Mar)',  color:'var(--success)', trend:'↑ 18%' },
  { icon:'⏳', val:'2',          label:'Pending Approvals',     color:'var(--warning)', trend:'Needs action' },
  { icon:'🔴', val:'3',          label:'Critical Sensor Alerts',color:'var(--danger)',  trend:'Across 2 farms' },
];

const FARM_PERFORMANCE = [
  { farm:'Nyange Poultry',   farmer:'Gilbert Nyange', birds:1000, eggs:284, revenue:35400, health:'good',    uptime:'99.2%' },
  { farm:'Sunrise Poultry',  farmer:'Amina Wanjiru',  birds:650,  eggs:198, revenue:21800, health:'good',    uptime:'98.8%' },
  { farm:'Kamau Farm',       farmer:'John Kamau',     birds:420,  eggs:110, revenue:14200, health:'warning', uptime:'97.1%' },
  { farm:'Otieno Broilers',  farmer:'Peter Otieno',   birds:800,  eggs:0,   revenue:28600, health:'good',    uptime:'99.5%' },
  { farm:'Hassan Layers',    farmer:'Fatuma Hassan',  birds:0,    eggs:0,   revenue:0,     health:'pending', uptime:'—' },
];

const SYSTEM_ALERTS = [
  { type:'danger',  farm:'Kamau Farm',    msg:'Water trough at 12% — critical depletion',         time:'4m ago' },
  { type:'warning', farm:'Sunrise Farm',  msg:'Shed temperature at 32°C — approaching threshold',  time:'11m ago' },
  { type:'danger',  farm:'Nyange Farm',   msg:'Batch D mortality spike — 14 birds this week',      time:'1h ago' },
  { type:'info',    farm:'System',        msg:'2 new admin registration requests awaiting review',  time:'2h ago' },
];

const SENSOR_OVERVIEW = [
  { farm:'Nyange Poultry',  online:6, offline:0, critical:1, warning:2 },
  { farm:'Sunrise Poultry', online:6, offline:0, critical:0, warning:1 },
  { farm:'Kamau Farm',      online:5, offline:1, critical:2, warning:1 },
  { farm:'Otieno Broilers', online:6, offline:0, critical:0, warning:0 },
];

const fmt = n => n != null ? `KSh ${Number(n).toLocaleString()}` : '—';

/* ═══════════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  const [adminUser, setAdminUser]     = useState({ name:'System Administrator', email:'admin@poltrifarm.com' });
  const [activeTab, setActiveTab]     = useState('overview');
  const [sidebarOpen, setSidebar]     = useState(true);
  const [users, setUsers]             = useState(MOCK_USERS);
  const [loading, setLoading]         = useState(false);
  const [confirmAction, setConfirm]   = useState(null); // { type, userId, name }
  const [userFilter, setUserFilter]   = useState('all');
  const [searchQ, setSearchQ]         = useState('');

  const cursorDot  = useRef(null);
  const cursorRing = useRef(null);
  const mouse      = useRef({ x:-200, y:-200 });
  const pos        = useRef({ x:-200, y:-200 });

  /* -- Firebase auth check -- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { navigate('/admin/login'); return; }
      try {
        const data = await getCurrentUserData(firebaseUser.uid);
        if (!data || data.role !== 'admin') { navigate('/dashboard'); return; }
        setAdminUser(data);
        // Real-time user listener
        const unsubUsers = listenToAllUsers(setUsers);
        return unsubUsers;
      } catch {
        // Firebase not configured — mock data stays
      }
    });
    return unsub;
  }, []);

  /* -- cursor -- */
  useEffect(() => {
    const move = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };
    window.addEventListener('mousemove', move);
    let raf;
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;
      if (cursorDot.current)
        cursorDot.current.style.transform = `translate(${mouse.current.x-5}px,${mouse.current.y-5}px)`;
      if (cursorRing.current)
        cursorRing.current.style.transform = `translate(${pos.current.x-18}px,${pos.current.y-18}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  /* -- handlers -- */
  const handleLogout = async () => { await logoutUser(); navigate('/admin/login'); };

  const handleApprove = async (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved:true } : u));
    try { await approveUser(userId); } catch {}
    setConfirm(null);
  };

  const handleBan = async (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved:false } : u));
    try { await banUser(userId); } catch {}
    setConfirm(null);
  };

  const handleRoleChange = async (userId, role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    try { await updateUserRole(userId, role); } catch {}
  };

  /* -- derived -- */
  const pendingUsers  = users.filter(u => !u.approved);
  const farmerUsers   = users.filter(u => u.role === 'farmer');
  const adminUsers    = users.filter(u => u.role === 'admin');
  const filteredUsers = users
    .filter(u => userFilter === 'all' ? true : userFilter === 'pending' ? !u.approved : u.role === userFilter)
    .filter(u => !searchQ || u.name.toLowerCase().includes(searchQ.toLowerCase()) || u.email.toLowerCase().includes(searchQ.toLowerCase()));

  /* ── NAV ── */
  const NAV = [
    { id:'overview',   icon:'⊞',  label:'System Overview'     },
    { id:'users',      icon:'👥', label:'User Management'     },
    { id:'farms',      icon:'🏗️', label:'Farm Analytics'      },
    { id:'sensors',    icon:'📡', label:'Sensor Network'      },
    { id:'finance',    icon:'📊', label:'Financial Reports'   },
    { id:'onboarding', icon:'➕', label:'Farm Onboarding'     },
  ];

  /* ─────────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --navy:#0B1F3A; --navy-mid:#112A4A; --navy-light:#1A3A5C; --navy-card:#0E1628; --navy-dark:#070F1E;
          --gold:#C9A84C; --gold-light:#E6C97A; --gold-pale:#F5E6B8;
          --white:#F8F5EE; --muted:#8A9BB5; --muted-light:#B0BED0;
          --success:#27AE60; --danger:#C0392B; --warning:#E67E22; --info:#2980B9;
          --font-d:'Cormorant Garamond',serif; --font-b:'DM Sans',sans-serif;
          --ease:cubic-bezier(.4,0,.2,1);
        }
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:var(--font-b);font-weight:300;background:var(--navy);color:var(--white);overflow-x:hidden;cursor:none;}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:var(--navy-dark)} ::-webkit-scrollbar-thumb{background:rgba(201,168,76,.15)}

        .c-dot{width:10px;height:10px;background:var(--gold);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;}
        .c-ring{width:36px;height:36px;border:1px solid rgba(201,168,76,.4);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9998;transition:width .25s,height .25s;}

        .db-layout{display:flex;min-height:100vh;}

        /* ─── Sidebar — slightly different treatment from farmer (more "command center" feel) ─── */
        .sidebar{width:260px;background:var(--navy-dark);border-right:1px solid rgba(201,168,76,.08);display:flex;flex-direction:column;transition:width .3s var(--ease);flex-shrink:0;position:relative;z-index:100;}
        .sidebar.collapsed{width:72px;}
        .sb-header{padding:1.5rem 1.2rem 1rem;border-bottom:1px solid rgba(201,168,76,.08);}
        .sb-admin-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .6rem;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;white-space:nowrap;}
        .sb-logo{font-family:var(--font-d);font-size:1.1rem;font-weight:700;letter-spacing:.12em;white-space:nowrap;overflow:hidden;}
        .sb-profile{display:flex;align-items:center;gap:.7rem;padding:.9rem 1.2rem;border-bottom:1px solid rgba(201,168,76,.08);}
        .sb-avatar{width:36px;height:36px;border-radius:0;background:rgba(201,168,76,.15);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:var(--gold);flex-shrink:0;font-family:var(--font-d);}
        .sb-info{overflow:hidden;}
        .sb-name{font-size:.78rem;font-weight:500;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .sb-role{font-size:.6rem;color:var(--gold);letter-spacing:.15em;text-transform:uppercase;}
        .sb-nav{flex:1;padding:.75rem .6rem;overflow-y:auto;}
        .sb-section-label{font-size:.55rem;color:rgba(138,155,181,.4);letter-spacing:.28em;text-transform:uppercase;padding:.5rem .6rem .3rem;white-space:nowrap;overflow:hidden;}
        .nav-item{display:flex;align-items:center;gap:.75rem;padding:.72rem .75rem;cursor:none;transition:background .2s;border-left:3px solid transparent;white-space:nowrap;overflow:hidden;}
        .nav-item:hover{background:rgba(201,168,76,.05);}
        .nav-item.active{background:rgba(201,168,76,.1);border-left-color:var(--gold);}
        .nav-icon{font-size:1rem;flex-shrink:0;width:22px;text-align:center;}
        .nav-label{font-size:.78rem;color:var(--muted);}
        .nav-item.active .nav-label{color:var(--gold);}
        .sb-footer{padding:.9rem 1rem;border-top:1px solid rgba(201,168,76,.08);}
        .sb-logout{display:flex;align-items:center;gap:.75rem;padding:.65rem .75rem;cursor:none;color:var(--muted);transition:color .2s;font-size:.78rem;background:none;border:none;width:100%;}
        .sb-logout:hover{color:var(--danger);}
        .sb-toggle{position:absolute;right:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;background:var(--navy-mid);border:1px solid rgba(201,168,76,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:none;font-size:.65rem;color:var(--gold);z-index:10;}

        .db-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
        .db-topbar{height:60px;background:var(--navy-dark);border-bottom:1px solid rgba(201,168,76,.08);display:flex;align-items:center;justify-content:space-between;padding:0 2rem;flex-shrink:0;}
        .topbar-title{font-family:var(--font-d);font-size:1.1rem;font-weight:300;color:var(--white);}
        .topbar-right{display:flex;align-items:center;gap:1rem;}
        .admin-chip{padding:.3rem .9rem;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;border:1px solid rgba(201,168,76,.3);color:var(--gold);background:rgba(201,168,76,.07);}
        .alert-pip-wrap{position:relative;}
        .alert-pip{position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:50%;background:var(--danger);animation:pulse 1.5s infinite;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

        .db-content{flex:1;overflow-y:auto;padding:2rem;}

        /* Cards */
        .card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.1);overflow:hidden;}
        .card-accent::before{content:'';display:block;width:100%;height:3px;background:var(--gold);}

        /* Stat grid */
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;}
        .stat-card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.1);padding:1.2rem;position:relative;overflow:hidden;}
        .stat-top-bar{position:absolute;top:0;left:0;right:0;height:3px;}
        .stat-icon{font-size:1.3rem;margin-bottom:.5rem;}
        .stat-value{font-family:var(--font-d);font-size:1.9rem;font-weight:700;color:var(--gold);line-height:1;}
        .stat-label{font-size:.68rem;color:var(--muted);letter-spacing:.06em;margin-top:.3rem;}
        .stat-trend{font-size:.65rem;color:var(--muted);margin-top:.3rem;}

        /* Badges */
        .badge{display:inline-flex;align-items:center;padding:.18rem .55rem;font-size:.58rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;border-radius:999px;border:1px solid;}
        .badge-success{background:rgba(39,174,96,.1);color:var(--success);border-color:rgba(39,174,96,.25);}
        .badge-warning{background:rgba(230,126,34,.1);color:var(--warning);border-color:rgba(230,126,34,.25);}
        .badge-danger{background:rgba(192,57,43,.1);color:var(--danger);border-color:rgba(192,57,43,.25);}
        .badge-gold{background:rgba(201,168,76,.1);color:var(--gold);border-color:rgba(201,168,76,.2);}
        .badge-muted{background:rgba(138,155,181,.07);color:var(--muted);border-color:rgba(138,155,181,.15);}
        .badge-info{background:rgba(41,128,185,.1);color:var(--info);border-color:rgba(41,128,185,.25);}

        /* Section headers */
        .section-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.2rem;}
        .section-eyebrow{font-size:.58rem;color:var(--gold);letter-spacing:.3em;text-transform:uppercase;display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;}
        .section-eyebrow::before{content:'';display:block;width:18px;height:1px;background:var(--gold);opacity:.6;}
        .section-title{font-family:var(--font-d);font-size:1.3rem;font-weight:300;color:var(--white);}
        .section-action{font-size:.7rem;color:var(--gold);cursor:none;background:none;border:none;letter-spacing:.08em;}

        /* Buttons */
        .btn{padding:.6rem 1.3rem;font-family:var(--font-b);font-size:.68rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;cursor:none;border:none;transition:all .22s;display:inline-flex;align-items:center;gap:.45rem;}
        .btn-primary{background:var(--gold);color:var(--navy);}
        .btn-primary:hover{background:var(--gold-light);}
        .btn-ghost{background:transparent;border:1px solid rgba(201,168,76,.3);color:var(--gold);}
        .btn-ghost:hover{background:rgba(201,168,76,.07);}
        .btn-success{background:rgba(39,174,96,.12);border:1px solid rgba(39,174,96,.3);color:var(--success);}
        .btn-danger{background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.3);color:var(--danger);}
        .btn-sm{padding:.35rem .85rem;font-size:.62rem;}

        /* Tables */
        .data-table{width:100%;border-collapse:collapse;}
        .data-table th{font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);padding:.7rem 1rem;border-bottom:1px solid rgba(201,168,76,.08);text-align:left;font-weight:400;}
        .data-table td{padding:.72rem 1rem;border-bottom:1px solid rgba(201,168,76,.04);font-size:.8rem;color:var(--white);}
        .data-table tr:hover td{background:rgba(201,168,76,.03);}

        /* Divider */
        .divider{height:1px;background:rgba(201,168,76,.1);margin:1rem 0;}

        /* Alert strips */
        .alert-strip{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-left:3px solid;margin-bottom:.75rem;font-size:.82rem;}
        .alert-danger{background:rgba(192,57,43,.06);border-color:var(--danger);}
        .alert-warning{background:rgba(230,126,34,.06);border-color:var(--warning);}
        .alert-info{background:rgba(41,128,185,.06);border-color:var(--info);}
        .alert-title{font-weight:500;font-size:.8rem;margin-bottom:.1rem;}
        .alert-sub{font-size:.7rem;color:var(--muted);}
        .alert-time{font-size:.62rem;color:rgba(138,155,181,.4);margin-left:auto;}

        /* Pending user cards */
        .pending-card{background:var(--navy-mid);border:1px solid rgba(230,126,34,.2);padding:1.2rem;margin-bottom:.75rem;display:flex;align-items:center;gap:1rem;}
        .pending-avatar{width:40px;height:40px;border-radius:50%;background:rgba(201,168,76,.1);border:1.5px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-size:.95rem;font-weight:700;color:var(--gold);flex-shrink:0;}
        .pending-body{flex:1;}
        .pending-name{font-size:.88rem;font-weight:500;color:var(--white);}
        .pending-email{font-size:.72rem;color:var(--muted);}
        .pending-date{font-size:.65rem;color:rgba(138,155,181,.5);margin-top:2px;}
        .pending-actions{display:flex;gap:.5rem;}

        /* Search bar */
        .search-bar{display:flex;align-items:center;gap:.75rem;background:var(--navy-dark);border:1px solid rgba(201,168,76,.12);padding:.6rem 1rem;margin-bottom:1rem;}
        .search-icon{font-size:.9rem;color:var(--muted);}
        .search-input{background:none;border:none;color:var(--white);font-family:var(--font-b);font-size:.82rem;font-weight:300;outline:none;flex:1;cursor:none;}
        .search-input::placeholder{color:var(--muted);}

        /* Filter tabs */
        .filter-tabs{display:flex;gap:.5rem;margin-bottom:1.2rem;}
        .filter-tab{padding:.4rem .85rem;font-size:.65rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;cursor:none;border:1px solid rgba(201,168,76,.12);background:transparent;color:var(--muted);transition:all .2s;}
        .filter-tab.active{background:rgba(201,168,76,.1);border-color:rgba(201,168,76,.3);color:var(--gold);}

        /* Farm health bar */
        .bar-track{height:5px;background:rgba(138,155,181,.1);border-radius:2px;overflow:hidden;}
        .bar-fill{height:100%;border-radius:2px;}

        /* Sensor grid */
        .sensor-overview-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;}
        .sensor-farm-card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.1);padding:1.1rem;}
        .sensor-farm-name{font-size:.85rem;font-weight:500;margin-bottom:.8rem;color:var(--white);}
        .sensor-status-row{display:flex;justify-content:space-between;align-items:center;padding:.35rem 0;border-bottom:1px solid rgba(201,168,76,.04);font-size:.75rem;}

        /* Confirm dialog */
        .confirm-overlay{position:fixed;inset:0;background:rgba(7,15,30,.85);z-index:1000;display:flex;align-items:center;justify-content:center;}
        .confirm-box{background:var(--navy-mid);border-top:3px solid var(--gold);padding:2rem;max-width:380px;width:90%;}
        .confirm-title{font-family:var(--font-d);font-size:1.2rem;margin-bottom:.6rem;}
        .confirm-body{font-size:.82rem;color:var(--muted);margin-bottom:1.5rem;line-height:1.6;}
        .confirm-actions{display:flex;gap:.75rem;}

        /* Finance charts area */
        .finance-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;}
        .finance-cell{background:var(--navy-mid);border:1px solid rgba(201,168,76,.1);padding:1.2rem;text-align:center;}
        .finance-val{font-family:var(--font-d);font-size:1.5rem;font-weight:700;margin-bottom:.3rem;}
        .finance-lbl{font-size:.65rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;}

        /* Form */
        .form-field{margin-bottom:1rem;}
        .form-label{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.4rem;}
        .form-input,.form-select{width:100%;background:var(--navy-dark);border:1px solid rgba(201,168,76,.15);color:var(--white);padding:.75rem 1rem;font-family:var(--font-b);font-size:.85rem;font-weight:300;outline:none;cursor:none;}
        .form-input:focus,.form-select:focus{border-color:rgba(201,168,76,.4);}

        @media(max-width:900px){
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .finance-grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* Cursor */}
      <div className="c-dot"  ref={cursorDot}  />
      <div className="c-ring" ref={cursorRing} />

      <div className="db-layout">
        {/* ── SIDEBAR ── */}
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="sb-header">
            {sidebarOpen && <div className="sb-admin-badge">◆ Admin Panel</div>}
            <div className="sb-logo">
              {sidebarOpen ? <span style={{ color:'var(--gold)' }}>POLTRI<span style={{ color:'var(--white)' }}>FARM</span></span> : <span style={{ color:'var(--gold)' }}>P</span>}
            </div>
          </div>

          {sidebarOpen && (
            <div className="sb-profile">
              <div className="sb-avatar">{adminUser.name?.slice(0,2).toUpperCase() || 'AD'}</div>
              <div className="sb-info">
                <div className="sb-name">{adminUser.name || 'Administrator'}</div>
                <div className="sb-role">◆ Admin</div>
              </div>
            </div>
          )}

          <nav className="sb-nav">
            {sidebarOpen && <div className="sb-section-label">Control Panel</div>}
            {NAV.map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </div>
            ))}
          </nav>

          <div className="sb-footer">
            <button className="sb-logout" onClick={handleLogout}>
              <span>⎋</span>
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>

          <button className="sb-toggle" onClick={() => setSidebar(v => !v)}
            style={{ position:'absolute', right:'-12px', top:'50%', transform:'translateY(-50%)', width:24, height:24, background:'var(--navy-mid)', border:'1px solid rgba(201,168,76,.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'none', fontSize:'.65rem', color:'var(--gold)', zIndex:10 }}>
            {sidebarOpen ? '‹' : '›'}
          </button>
        </aside>

        {/* ── MAIN ── */}
        <main className="db-main">
          {/* Topbar */}
          <div className="db-topbar">
            <div className="topbar-title">
              {NAV.find(n => n.id === activeTab)?.label || 'System Overview'}
            </div>
            <div className="topbar-right">
              <span className="admin-chip">◆ Administrator</span>
              {pendingUsers.length > 0 && (
                <div className="alert-pip-wrap" style={{ position:'relative' }}>
                  <span style={{ fontSize:'1.2rem', cursor:'none' }} onClick={() => setActiveTab('users')}>👥</span>
                  <span className="alert-pip" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="db-content">

            {/* ══ SYSTEM OVERVIEW ══ */}
            {activeTab === 'overview' && (
              <>
                {/* Pending banner */}
                {pendingUsers.length > 0 && (
                  <div style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.8rem 1rem', background:'rgba(230,126,34,.07)', border:'1px solid rgba(230,126,34,.2)', marginBottom:'1.5rem' }}>
                    <span>⚠</span>
                    <span style={{ fontSize:'.82rem' }}><strong>{pendingUsers.length}</strong> account{pendingUsers.length>1?'s':''} awaiting approval.</span>
                    <button className="btn btn-warning btn-sm" style={{ marginLeft:'auto', background:'rgba(230,126,34,.1)', border:'1px solid rgba(230,126,34,.3)', color:'var(--warning)' }} onClick={() => setActiveTab('users')}>Review →</button>
                  </div>
                )}

                {/* System stats */}
                <div className="section-hd"><div><div className="section-eyebrow">System</div><div className="section-title">Platform Overview</div></div></div>
                <div className="stats-grid">
                  {SYSTEM_STATS.map(s => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-top-bar" style={{ background:s.color }} />
                      <div className="stat-icon">{s.icon}</div>
                      <div className="stat-value" style={{ color:s.color }}>{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-trend">{s.trend}</div>
                    </div>
                  ))}
                </div>

                {/* System alerts */}
                <div className="section-hd" style={{ marginTop:'2rem' }}>
                  <div><div className="section-eyebrow">Alerts</div><div className="section-title">System-wide Notifications</div></div>
                </div>
                {SYSTEM_ALERTS.map((a, i) => (
                  <div key={i} className={`alert-strip alert-${a.type}`}>
                    <span>{a.type==='danger'?'🔴':a.type==='warning'?'🟡':'ℹ'}</span>
                    <div>
                      <div className="alert-title">{a.farm}</div>
                      <div className="alert-sub">{a.msg}</div>
                    </div>
                    <span className="alert-time">{a.time}</span>
                  </div>
                ))}

                {/* Farm performance table */}
                <div className="section-hd" style={{ marginTop:'2rem' }}>
                  <div><div className="section-eyebrow">Performance</div><div className="section-title">All Farms at a Glance</div></div>
                  <button className="section-action" onClick={() => setActiveTab('farms')}>Full report →</button>
                </div>
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr><th>Farm</th><th>Farmer</th><th>Birds</th><th>Eggs/Day</th><th>Revenue</th><th>Health</th><th>Uptime</th></tr>
                    </thead>
                    <tbody>
                      {FARM_PERFORMANCE.map(f => (
                        <tr key={f.farm}>
                          <td style={{ fontWeight:500 }}>{f.farm}</td>
                          <td style={{ color:'var(--muted)', fontSize:'.75rem' }}>{f.farmer}</td>
                          <td>{f.birds?.toLocaleString() || '—'}</td>
                          <td>{f.eggs || '—'}</td>
                          <td style={{ fontFamily:'var(--font-d)', color:'var(--gold)' }}>{fmt(f.revenue)}</td>
                          <td><span className={`badge badge-${f.health==='good'?'success':f.health==='warning'?'warning':f.health==='pending'?'muted':'danger'}`}>{f.health}</span></td>
                          <td style={{ color: f.uptime==='—'?'var(--muted)':'var(--success)', fontSize:'.78rem' }}>{f.uptime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ USER MANAGEMENT ══ */}
            {activeTab === 'users' && (
              <>
                <div style={{ marginBottom:'1.5rem' }}>
                  <div className="section-eyebrow">Management</div>
                  <div className="section-title">User Management</div>
                </div>

                {/* Pending approvals */}
                {pendingUsers.length > 0 && (
                  <div style={{ marginBottom:'2rem' }}>
                    <div style={{ fontFamily:'var(--font-d)', fontSize:'1rem', marginBottom:'1rem', color:'var(--warning)' }}>
                      ⏳ Pending Approvals ({pendingUsers.length})
                    </div>
                    {pendingUsers.map(u => (
                      <div className="pending-card" key={u.id}>
                        <div className="pending-avatar">{u.name.slice(0,2).toUpperCase()}</div>
                        <div className="pending-body">
                          <div className="pending-name">{u.name}</div>
                          <div className="pending-email">{u.email}</div>
                          <div className="pending-date">Registered: {u.createdAt} · Role requested: {u.role}</div>
                        </div>
                        <div className="pending-actions">
                          <button className="btn btn-success btn-sm" onClick={() => setConfirm({ type:'approve', userId:u.id, name:u.name })}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type:'ban', userId:u.id, name:u.name })}>Reject</button>
                        </div>
                      </div>
                    ))}
                    <div className="divider" />
                  </div>
                )}

                {/* Search + filter */}
                <div className="search-bar">
                  <span className="search-icon">🔍</span>
                  <input className="search-input" placeholder="Search users by name or email…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                </div>
                <div className="filter-tabs">
                  {['all','farmer','admin','pending'].map(f => (
                    <button key={f} className={`filter-tab ${userFilter===f?'active':''}`} onClick={() => setUserFilter(f)}>
                      {f.charAt(0).toUpperCase()+f.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Farm</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td style={{ fontWeight:500 }}>{u.name}</td>
                          <td style={{ color:'var(--muted)', fontSize:'.75rem' }}>{u.email}</td>
                          <td style={{ color:'var(--muted)', fontSize:'.75rem' }}>{u.farmName || '—'}</td>
                          <td>
                            <select
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
                              style={{ background:'var(--navy-dark)', border:'1px solid rgba(201,168,76,.15)', color:'var(--gold)', padding:'.2rem .5rem', fontSize:'.7rem', cursor:'none' }}
                            >
                              <option value="farmer">Farmer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td><span className={`badge badge-${u.approved?'success':'warning'}`}>{u.approved?'Active':'Pending'}</span></td>
                          <td style={{ color:'var(--muted)', fontSize:'.72rem' }}>{u.createdAt}</td>
                          <td style={{ display:'flex', gap:'.4rem' }}>
                            {u.approved
                              ? <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ type:'ban', userId:u.id, name:u.name })}>Ban</button>
                              : <button className="btn btn-success btn-sm" onClick={() => setConfirm({ type:'approve', userId:u.id, name:u.name })}>Approve</button>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ FARM ANALYTICS ══ */}
            {activeTab === 'farms' && (
              <>
                <div style={{ marginBottom:'1.5rem' }}>
                  <div className="section-eyebrow">Analytics</div>
                  <div className="section-title">Farm-by-Farm Performance</div>
                </div>
                <div className="finance-grid" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
                  {[
                    { val: farmerUsers.filter(u=>u.approved).length, lbl:'Active Farms', color:'var(--gold)' },
                    { val: FARM_PERFORMANCE.reduce((s,f)=>s+(f.birds||0),0).toLocaleString(), lbl:'Total Birds', color:'var(--success)' },
                    { val: FARM_PERFORMANCE.reduce((s,f)=>s+(f.eggs||0),0), lbl:'Eggs Today', color:'var(--info)' },
                    { val: fmt(FARM_PERFORMANCE.reduce((s,f)=>s+(f.revenue||0),0)), lbl:'Total Revenue', color:'var(--success)' },
                  ].map(s => (
                    <div className="finance-cell" key={s.lbl}>
                      <div className="finance-val" style={{ color:s.color }}>{s.val}</div>
                      <div className="finance-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <table className="data-table">
                    <thead><tr><th>Farm</th><th>Farmer</th><th>Birds</th><th>Eggs/Day</th><th>Revenue</th><th>Health</th><th>Sensor Uptime</th></tr></thead>
                    <tbody>
                      {FARM_PERFORMANCE.map(f => (
                        <tr key={f.farm}>
                          <td style={{ fontWeight:500 }}>{f.farm}</td>
                          <td style={{ color:'var(--muted)', fontSize:'.75rem' }}>{f.farmer}</td>
                          <td>{f.birds?.toLocaleString() || '—'}</td>
                          <td>{f.eggs || '—'}</td>
                          <td style={{ fontFamily:'var(--font-d)', color:'var(--success)' }}>{fmt(f.revenue)}</td>
                          <td><span className={`badge badge-${f.health==='good'?'success':f.health==='warning'?'warning':'muted'}`}>{f.health}</span></td>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
                              <div className="bar-track" style={{ flex:1 }}>
                                <div className="bar-fill" style={{ width: f.uptime!=='—'?f.uptime:'0%', background: parseFloat(f.uptime||0) > 98 ? 'var(--success)':'var(--warning)' }} />
                              </div>
                              <span style={{ fontSize:'.72rem', color:'var(--muted)', width:'38px' }}>{f.uptime}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ SENSOR NETWORK ══ */}
            {activeTab === 'sensors' && (
              <>
                <div style={{ marginBottom:'1.5rem' }}>
                  <div className="section-eyebrow">IoT Network</div>
                  <div className="section-title">System-wide Sensor Status</div>
                </div>
                <div className="stats-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'2rem' }}>
                  {[
                    { val: SENSOR_OVERVIEW.reduce((s,f)=>s+f.online,0), lbl:'Sensors Online',  color:'var(--success)' },
                    { val: SENSOR_OVERVIEW.reduce((s,f)=>s+f.offline,0),lbl:'Sensors Offline', color:'var(--danger)'  },
                    { val: SENSOR_OVERVIEW.reduce((s,f)=>s+f.critical,0),lbl:'Critical',       color:'var(--danger)'  },
                    { val: SENSOR_OVERVIEW.reduce((s,f)=>s+f.warning,0), lbl:'Warnings',       color:'var(--warning)' },
                  ].map(s => (
                    <div className="stat-card" key={s.lbl}>
                      <div className="stat-top-bar" style={{ background:s.color }} />
                      <div className="stat-value" style={{ color:s.color }}>{s.val}</div>
                      <div className="stat-label">{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div className="sensor-overview-grid">
                  {SENSOR_OVERVIEW.map(f => (
                    <div className="sensor-farm-card card" key={f.farm}>
                      <div style={{ height:3, background:'var(--gold)', margin:'-1px -1px 0' }} />
                      <div style={{ padding:'1rem' }}>
                        <div className="sensor-farm-name">{f.farm}</div>
                        {[
                          { label:'Online',   val:f.online,   color:'var(--success)' },
                          { label:'Offline',  val:f.offline,  color:'var(--danger)'  },
                          { label:'Critical', val:f.critical, color:'var(--danger)'  },
                          { label:'Warnings', val:f.warning,  color:'var(--warning)' },
                        ].map(row => (
                          <div className="sensor-status-row" key={row.label}>
                            <span style={{ color:'var(--muted)' }}>{row.label}</span>
                            <span style={{ color:row.val>0?row.color:'var(--muted)', fontWeight:500 }}>{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ══ FINANCIAL REPORTS ══ */}
            {activeTab === 'finance' && (
              <>
                <div style={{ marginBottom:'1.5rem' }}>
                  <div className="section-eyebrow">Finance</div>
                  <div className="section-title">Platform Financial Reports</div>
                </div>
                <div className="finance-grid">
                  {[
                    { val:'KSh 100,000', lbl:'Total Platform Revenue (Mar)', color:'var(--success)' },
                    { val:'KSh 21,350',  lbl:'Total Platform Expenses',      color:'var(--danger)'  },
                    { val:'KSh 78,650',  lbl:'Net Platform Profit',          color:'var(--gold)'    },
                  ].map(s => (
                    <div className="finance-cell card" key={s.lbl}>
                      <div className="finance-val" style={{ color:s.color }}>{s.val}</div>
                      <div className="finance-lbl">{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:'1.2rem' }}>
                  <div className="section-eyebrow">By Farm</div>
                  <div className="section-title">Revenue Breakdown</div>
                </div>
                <div className="card">
                  <table className="data-table">
                    <thead><tr><th>Farm</th><th>Farmer</th><th>Revenue</th><th>Expenses</th><th>Net Profit</th><th>Margin</th></tr></thead>
                    <tbody>
                      {FARM_PERFORMANCE.filter(f=>f.revenue).map(f => {
                        const exp = Math.round(f.revenue * 0.35);
                        const net = f.revenue - exp;
                        const margin = Math.round((net/f.revenue)*100);
                        return (
                          <tr key={f.farm}>
                            <td style={{ fontWeight:500 }}>{f.farm}</td>
                            <td style={{ color:'var(--muted)', fontSize:'.75rem' }}>{f.farmer}</td>
                            <td style={{ fontFamily:'var(--font-d)', color:'var(--success)' }}>{fmt(f.revenue)}</td>
                            <td style={{ fontFamily:'var(--font-d)', color:'var(--danger)' }}>{fmt(exp)}</td>
                            <td style={{ fontFamily:'var(--font-d)', color:'var(--gold)' }}>{fmt(net)}</td>
                            <td><span className={`badge badge-${margin>50?'success':'warning'}`}>{margin}%</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ FARM ONBOARDING ══ */}
            {activeTab === 'onboarding' && (
              <>
                <div style={{ marginBottom:'1.5rem' }}>
                  <div className="section-eyebrow">Onboarding</div>
                  <div className="section-title">Register New Farm</div>
                </div>
                <div style={{ maxWidth:560 }}>
                  <div style={{ background:'var(--navy-mid)', border:'1px solid rgba(201,168,76,.15)', padding:'2rem' }}>
                    {[
                      { label:'Farm Name',       placeholder:'e.g. Sunrise Poultry Farm' },
                      { label:'Farmer Full Name', placeholder:'First and Last name' },
                      { label:'Email Address',    placeholder:'farmer@email.com' },
                      { label:'Phone Number',     placeholder:'+254 700 000 000' },
                      { label:'Physical Location',placeholder:'County / Town' },
                    ].map(f => (
                      <div className="form-field" key={f.label}>
                        <label className="form-label">{f.label}</label>
                        <input className="form-input" placeholder={f.placeholder} />
                      </div>
                    ))}
                    <div className="form-field">
                      <label className="form-label">Primary Flock Type</label>
                      <select className="form-select">
                        <option>Broiler</option><option>Layer</option><option>Dual Purpose</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label">Initial Bird Count (approximate)</label>
                      <input className="form-input" type="number" placeholder="e.g. 500" />
                    </div>
                    <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
                      <button className="btn btn-primary">Create Farm Account</button>
                      <button className="btn btn-ghost">Send Invite Email</button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>{/* /content */}
        </main>
      </div>

      {/* ── CONFIRM DIALOG ── */}
      {confirmAction && (
        <div className="confirm-overlay" onClick={() => setConfirm(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div className="confirm-title">
              {confirmAction.type === 'approve' ? '✓ Approve Account' : '✕ Reject / Ban Account'}
            </div>
            <div className="confirm-body">
              {confirmAction.type === 'approve'
                ? `Grant full platform access to ${confirmAction.name}? They will be able to sign in immediately.`
                : `Revoke access for ${confirmAction.name}? They will be unable to sign in until re-approved.`
              }
            </div>
            <div className="confirm-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
              <button
                className={`btn btn-sm ${confirmAction.type==='approve'?'btn-success':'btn-danger'}`}
                onClick={() => confirmAction.type==='approve' ? handleApprove(confirmAction.userId) : handleBan(confirmAction.userId)}
              >
                {confirmAction.type === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
