import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  logoutUser,
  getCurrentUserData,
  getFlocks,
  addFlock,
  getTransactions,
  addTransaction,
  getSensorReadings,
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

/* ─── MOCK FALLBACK DATA (used until Firebase is wired up) ─────────────────── */
const MOCK_USER = {
  name: "Gilbert Nyange",
  email: "gilbert@farm.com",
  farmName: "Nyange Poultry Farm",
};
const MOCK_FLOCKS = [
  {
    id: "1",
    batchName: "Batch A",
    type: "Broiler",
    count: 480,
    age: 34,
    health: "good",
    shed: "Shed A",
    mortality: 3,
    feedConsumed: "280 kg",
    avgWeight: "1.8 kg",
  },
  {
    id: "2",
    batchName: "Batch B",
    type: "Layer",
    count: 320,
    age: 82,
    health: "warning",
    shed: "Shed B",
    mortality: 7,
    feedConsumed: "560 kg",
    eggCount: 284,
  },
  {
    id: "3",
    batchName: "Batch C",
    type: "Broiler",
    count: 200,
    age: 12,
    health: "good",
    shed: "Shed C",
    mortality: 0,
    feedConsumed: "48 kg",
    avgWeight: "0.3 kg",
  },
  {
    id: "4",
    batchName: "Batch D",
    type: "Layer",
    count: 150,
    age: 58,
    health: "critical",
    shed: "Shed A",
    mortality: 14,
    feedConsumed: "390 kg",
    eggCount: 42,
  },
];
const MOCK_SENSORS = [
  {
    id: "s1",
    name: "Temperature",
    icon: "🌡️",
    value: "29",
    unit: "°C",
    status: "warning",
    location: "Shed A",
    min: 20,
    max: 35,
    current: 29,
  },
  {
    id: "s2",
    name: "Humidity",
    icon: "💧",
    value: "68",
    unit: "%",
    status: "normal",
    location: "Shed A",
    min: 50,
    max: 80,
    current: 68,
  },
  {
    id: "s3",
    name: "Water Level",
    icon: "🪣",
    value: "18",
    unit: "%",
    status: "critical",
    location: "Trough",
    min: 20,
    max: 100,
    current: 18,
  },
  {
    id: "s4",
    name: "Feed Weight",
    icon: "🌾",
    value: "42",
    unit: "kg",
    status: "warning",
    location: "Feeder",
    min: 50,
    max: 200,
    current: 42,
  },
  {
    id: "s5",
    name: "Ammonia (NH₃)",
    icon: "⚗️",
    value: "12",
    unit: "ppm",
    status: "normal",
    location: "Shed B",
    min: 0,
    max: 25,
    current: 12,
  },
  {
    id: "s6",
    name: "Egg Count",
    icon: "🥚",
    value: "284",
    unit: "eggs",
    status: "normal",
    location: "Nest B",
    min: 0,
    max: 400,
    current: 284,
  },
];
const MOCK_TXS = [
  {
    id: "t1",
    type: "income",
    category: "Egg Sales",
    description: "Market tray sales",
    amount: 8400,
    date: "2026-03-15",
  },
  {
    id: "t2",
    type: "expense",
    category: "Feed",
    description: "Starter feed — 5 bags",
    amount: 3750,
    date: "2026-03-14",
  },
  {
    id: "t3",
    type: "income",
    category: "Bird Sales",
    description: "60 broilers @ 350",
    amount: 21000,
    date: "2026-03-10",
  },
  {
    id: "t4",
    type: "expense",
    category: "Veterinary",
    description: "Newcastle vaccination",
    amount: 1200,
    date: "2026-03-12",
  },
  {
    id: "t5",
    type: "expense",
    category: "Utilities",
    description: "Electricity — March",
    amount: 2100,
    date: "2026-03-08",
  },
];
const MOCK_REMINDERS = [
  {
    id: "r1",
    title: "Newcastle Booster — Batch B",
    due: "2026-03-25",
    type: "vaccine",
    urgent: true,
  },
  {
    id: "r2",
    title: "Shed A Deep Clean",
    due: "2026-03-22",
    type: "sanitation",
    urgent: true,
  },
  {
    id: "r3",
    title: "Gumboro Dose — Batch C",
    due: "2026-04-01",
    type: "vaccine",
    urgent: false,
  },
  {
    id: "r4",
    title: "Feed Stock Replenishment",
    due: "2026-03-28",
    type: "feed",
    urgent: false,
  },
];
const MOCK_INVENTORY = [
  {
    id: "f1",
    name: "Broiler Starter",
    type: "Feed",
    supplier: "KenFeed Ltd",
    stock: 120,
    unit: "kg",
    reorderAt: 80,
    costPerUnit: 75,
    lastRestocked: "2026-03-14",
    batch: "Batch C",
  },
  {
    id: "f2",
    name: "Layer Mash",
    type: "Feed",
    supplier: "Unga Feeds",
    stock: 42,
    unit: "kg",
    reorderAt: 100,
    costPerUnit: 68,
    lastRestocked: "2026-03-10",
    batch: "Batch B",
  },
  {
    id: "f3",
    name: "Broiler Finisher",
    type: "Feed",
    supplier: "KenFeed Ltd",
    stock: 198,
    unit: "kg",
    reorderAt: 100,
    costPerUnit: 80,
    lastRestocked: "2026-03-12",
    batch: "Batch A",
  },
  {
    id: "f4",
    name: "Grit & Minerals",
    type: "Supplement",
    supplier: "AgroVet Centre",
    stock: 18,
    unit: "kg",
    reorderAt: 20,
    costPerUnit: 120,
    lastRestocked: "2026-02-28",
    batch: "All",
  },
  {
    id: "f5",
    name: "Marek's Vaccine",
    type: "Medication",
    supplier: "Intervet Kenya",
    stock: 3,
    unit: "vials",
    reorderAt: 5,
    costPerUnit: 450,
    lastRestocked: "2026-03-01",
    batch: "Batch C",
  },
  {
    id: "f6",
    name: "Disinfectant",
    type: "Sanitation",
    supplier: "Farm Care Kenya",
    stock: 8,
    unit: "litres",
    reorderAt: 5,
    costPerUnit: 350,
    lastRestocked: "2026-03-05",
    batch: "All",
  },
  {
    id: "f7",
    name: "Newcastle Vaccine",
    type: "Medication",
    supplier: "Intervet Kenya",
    stock: 2,
    unit: "vials",
    reorderAt: 4,
    costPerUnit: 380,
    lastRestocked: "2026-02-20",
    batch: "Batch B",
  },
  {
    id: "f8",
    name: "Feeders (trough)",
    type: "Equipment",
    supplier: "AgriSupplies Co.",
    stock: 6,
    unit: "pcs",
    reorderAt: 3,
    costPerUnit: 1800,
    lastRestocked: "2026-01-15",
    batch: "All",
  },
];
const FEED_CONSUMPTION = [
  {
    date: "2026-03-15",
    batch: "Batch A",
    feedType: "Broiler Finisher",
    kg: 28,
    cost: 2240,
  },
  {
    date: "2026-03-15",
    batch: "Batch B",
    feedType: "Layer Mash",
    kg: 18,
    cost: 1224,
  },
  {
    date: "2026-03-14",
    batch: "Batch C",
    feedType: "Broiler Starter",
    kg: 12,
    cost: 900,
  },
  {
    date: "2026-03-14",
    batch: "Batch A",
    feedType: "Broiler Finisher",
    kg: 30,
    cost: 2400,
  },
  {
    date: "2026-03-13",
    batch: "Batch B",
    feedType: "Layer Mash",
    kg: 17,
    cost: 1156,
  },
];

const RESOURCES = [
  {
    title: "Newcastle Disease: Prevention & Control",
    source: "FAO",
    url: "https://www.fao.org/poultry",
    tag: "Disease",
  },
  {
    title: "Optimal Layer Feed Formulation Guide",
    source: "Kenya Poultry Assoc.",
    url: "https://kenyapoultry.org",
    tag: "Nutrition",
  },
  {
    title: "Biosecurity Best Practices for Small Farms",
    source: "FAO",
    url: "https://www.fao.org",
    tag: "Biosecurity",
  },
  {
    title: "Understanding Egg Production Cycles",
    source: "World Poultry",
    url: "https://www.worldpoultry.net",
    tag: "Production",
  },
  {
    title: "Heat Stress Management in Broilers",
    source: "Poultry Science",
    url: "https://www.sciencedirect.com",
    tag: "Environment",
  },
  {
    title: "When to Sell Broilers for Maximum ROI",
    source: "AgriMarket Kenya",
    url: "https://agrimarket.co.ke",
    tag: "Finance",
  },
];
const AI_PREDICTIONS = [
  {
    condition: "Newcastle Disease (suspected)",
    confidence: 74,
    severity: "high",
    actions: [
      "Isolate affected birds immediately",
      "Contact veterinarian urgently",
      "Review vaccination records",
    ],
  },
  {
    condition: "Infectious Bronchitis",
    confidence: 18,
    severity: "medium",
    actions: ["Monitor closely 24–48h", "Improve ventilation"],
  },
];

/* ─── HELPERS ───────────────────────────────────────────────────────────────── */
const fmt = (n) => `KSh ${Number(n).toLocaleString()}`;
const healthColor = (h) =>
  ({ good: "#27AE60", warning: "#E67E22", critical: "#C0392B" }[h] ||
  "#8A9BB5");
const statusColor = (s) =>
  ({ normal: "#27AE60", warning: "#E67E22", critical: "#C0392B" }[s] ||
  "#8A9BB5");
const barPct = (s) =>
  Math.min(Math.max(((s.current - s.min) / (s.max - s.min)) * 100, 2), 100);

/* ═══════════════════════════════════════════════════════════════════════════════
   FARMER DASHBOARD
═══════════════════════════════════════════════════════════════════════════════ */
export default function FarmerDashboard() {
  const navigate = useNavigate();

  /* -- state -- */
  const [user, setUser] = useState(MOCK_USER);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(true);
  const [flocks, setFlocks] = useState(MOCK_FLOCKS);
  const [sensors, setSensors] = useState(MOCK_SENSORS);
  const [transactions, setTxs] = useState(MOCK_TXS);
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [loading, setLoading] = useState(false);
  const [selectedFlock, setFlock] = useState(null);
  const [addFlockOpen, setAddFlock] = useState(false);
  const [addTxOpen, setAddTx] = useState(false);
  const [scanState, setScanState] = useState("idle"); // idle | analyzing | results
  const [newFlock, setNewFlock] = useState({
    batchName: "",
    type: "Broiler",
    count: "",
    shed: "",
  });
  const [newTx, setNewTx] = useState({
    type: "income",
    category: "",
    description: "",
    amount: "",
    date: "",
  });
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [feedLog, setFeedLog] = useState(FEED_CONSUMPTION);
  const [addFeedOpen, setAddFeed] = useState(false);
  const [newFeedEntry, setNewFeedEntry] = useState({
    feedType: "",
    batch: "",
    kg: "",
    cost: "",
  });
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });

  /* -- Firebase auth check -- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }
      try {
        const data = await getCurrentUserData(firebaseUser.uid);
        if (data) {
          setUser(data);
          if (data.role === "admin") {
            navigate("/admin/dashboard");
            return;
          }
          // Load real data
          const [fl, tx, sn] = await Promise.all([
            getFlocks(firebaseUser.uid),
            getTransactions(firebaseUser.uid),
            getSensorReadings(firebaseUser.uid),
          ]);
          if (fl.length) setFlocks(fl);
          if (tx.length) setTxs(tx);
          if (sn.length) setSensors(sn);
        }
      } catch {
        // Firebase not configured — mock data stays
      }
    });
    return unsub;
  }, [navigate]);

  /* -- cursor -- */
  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", move);
    let raf;
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;
      if (cursorDot.current)
        cursorDot.current.style.transform = `translate(${
          mouse.current.x - 5
        }px,${mouse.current.y - 5}px)`;
      if (cursorRing.current)
        cursorRing.current.style.transform = `translate(${
          pos.current.x - 18
        }px,${pos.current.y - 18}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* -- live sensor simulation -- */
  useEffect(() => {
    const iv = setInterval(() => {
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          current: parseFloat(
            (s.current + (Math.random() - 0.5) * 0.4).toFixed(1),
          ),
          value: (s.current + (Math.random() - 0.5) * 0.4).toFixed(1),
        })),
      );
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  /* -- handlers -- */
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleAddFlock = async () => {
    if (!newFlock.batchName || !newFlock.count) return;
    const f = {
      ...newFlock,
      count: parseInt(newFlock.count),
      age: 0,
      health: "good",
      mortality: 0,
      feedConsumed: "0 kg",
      id: Date.now().toString(),
    };
    setFlocks((prev) => [f, ...prev]);
    try {
      await addFlock(auth.currentUser?.uid, f);
    } catch {}
    setNewFlock({ batchName: "", type: "Broiler", count: "", shed: "" });
    setAddFlock(false);
  };

  const handleAddTx = async () => {
    if (!newTx.category || !newTx.amount) return;
    const tx = {
      ...newTx,
      amount: parseFloat(newTx.amount),
      date: newTx.date || new Date().toISOString().split("T")[0],
      id: Date.now().toString(),
    };
    setTxs((prev) => [tx, ...prev]);
    try {
      await addTransaction(auth.currentUser?.uid, tx);
    } catch {}
    setNewTx({
      type: "income",
      category: "",
      description: "",
      amount: "",
      date: "",
    });
    setAddTx(false);
  };

  const handleAIScan = async () => {
    setScanState("analyzing");
    await new Promise((r) => setTimeout(r, 2800));
    setScanState("results");
  };

  /* -- derived -- */
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const criticalSensors = sensors.filter((s) => s.status === "critical").length;

  /* ── NAV ITEMS ── */
  const NAV = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "flock", icon: "🐔", label: "Flock Management" },
    { id: "sensors", icon: "📡", label: "Sensor Monitoring" },
    { id: "health", icon: "🔬", label: "AI Health Scan" },
    { id: "finance", icon: "💰", label: "Financial Tracking" },
    { id: "reminders", icon: "📅", label: "Reminders" },
    { id: "feed", icon: "🌾", label: "Feed & Inventory" },
    { id: "resources", icon: "📚", label: "Resources" },
  ];

  /* ─────────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --navy:#0B1F3A; --navy-mid:#112A4A; --navy-light:#1A3A5C; --navy-card:#0E1628; --navy-dark:#070F1E;
          --gold:#C9A84C; --gold-light:#E6C97A; --gold-pale:#F5E6B8; --gold-dim:rgba(201,168,76,0.15);
          --white:#F8F5EE; --muted:#8A9BB5; --muted-light:#B0BED0;
          --success:#27AE60; --danger:#C0392B; --warning:#E67E22; --info:#2980B9;
          --font-d:'Cormorant Garamond',serif; --font-b:'DM Sans',sans-serif;
          --r:0px; --ease:cubic-bezier(.4,0,.2,1);
        }
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:var(--font-b);font-weight:300;background:var(--navy);color:var(--white);overflow-x:hidden;cursor:none;}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:var(--navy-dark)} ::-webkit-scrollbar-thumb{background:var(--gold-dim)}

        /* Cursor */
        .c-dot{width:10px;height:10px;background:var(--gold);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;}
        .c-ring{width:36px;height:36px;border:1px solid rgba(201,168,76,.4);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9998;transition:width .25s,height .25s,border-color .25s;}

        /* Layout */
        .db-layout{display:flex;min-height:100vh;}

        /* Sidebar */
        .sidebar{width:260px;background:var(--navy-dark);border-right:1px solid rgba(201,168,76,.1);display:flex;flex-direction:column;transition:width .3s var(--ease);flex-shrink:0;position:relative;z-index:100;}
        .sidebar.collapsed{width:72px;}
        .sb-header{padding:1.5rem 1.2rem 1rem;border-bottom:1px solid rgba(201,168,76,.08);}
        .sb-logo{font-family:var(--font-d);font-size:1.1rem;font-weight:700;letter-spacing:.12em;white-space:nowrap;overflow:hidden;}
        .sb-logo span{color:var(--white);}
        .sb-logo .gold{color:var(--gold);}
        .sb-sub{font-size:.58rem;color:var(--muted);letter-spacing:.25em;text-transform:uppercase;margin-top:2px;white-space:nowrap;overflow:hidden;}
        .sb-profile{display:flex;align-items:center;gap:.7rem;padding:.9rem 1.2rem;border-bottom:1px solid rgba(201,168,76,.08);}
        .sb-avatar{width:36px;height:36px;border-radius:50%;background:var(--navy-light);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-size:.85rem;font-weight:700;color:var(--gold);flex-shrink:0;}
        .sb-info{overflow:hidden;}
        .sb-name{font-size:.78rem;font-weight:500;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .sb-role{font-size:.6rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;}
        .sb-nav{flex:1;padding:.75rem .6rem;overflow-y:auto;}
        .sb-section-label{font-size:.55rem;color:rgba(138,155,181,.4);letter-spacing:.28em;text-transform:uppercase;padding:.5rem .6rem .3rem;white-space:nowrap;overflow:hidden;}
        .nav-item{display:flex;align-items:center;gap:.75rem;padding:.72rem .75rem;border-radius:0;cursor:none;transition:background .2s,color .2s;border-left:3px solid transparent;position:relative;overflow:hidden;white-space:nowrap;}
        .nav-item:hover{background:rgba(201,168,76,.06);color:var(--white);}
        .nav-item.active{background:rgba(201,168,76,.1);border-left-color:var(--gold);color:var(--gold);}
        .nav-icon{font-size:1.05rem;flex-shrink:0;width:22px;text-align:center;}
        .nav-label{font-size:.78rem;font-weight:400;color:inherit;overflow:hidden;}
        .nav-item.active .nav-label{color:var(--gold);}
        .nav-item:not(.active) .nav-label{color:var(--muted);}
        .sb-footer{padding:.9rem 1rem;border-top:1px solid rgba(201,168,76,.08);}
        .sb-logout{display:flex;align-items:center;gap:.75rem;padding:.65rem .75rem;cursor:none;color:var(--muted);transition:color .2s;font-size:.78rem;background:none;border:none;width:100%;text-align:left;}
        .sb-logout:hover{color:var(--danger);}
        .sb-toggle{position:absolute;right:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;background:var(--navy-mid);border:1px solid rgba(201,168,76,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:none;font-size:.65rem;color:var(--gold);z-index:10;transition:background .2s;}
        .sb-toggle:hover{background:var(--navy-light);}

        /* Main */
        .db-main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
        .db-topbar{height:60px;background:var(--navy-dark);border-bottom:1px solid rgba(201,168,76,.08);display:flex;align-items:center;justify-content:space-between;padding:0 2rem;flex-shrink:0;}
        .topbar-title{font-family:var(--font-d);font-size:1.1rem;font-weight:300;color:var(--white);}
        .topbar-right{display:flex;align-items:center;gap:1rem;}
        .topbar-badge{padding:.3rem .8rem;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;border:1px solid rgba(201,168,76,.25);color:var(--gold);background:rgba(201,168,76,.06);}
        .topbar-alert{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(192,57,43,.3);background:rgba(192,57,43,.08);color:var(--danger);font-size:.8rem;cursor:none;position:relative;}
        .alert-pip{position:absolute;top:4px;right:4px;width:7px;height:7px;border-radius:50%;background:var(--danger);animation:pulse 1.5s infinite;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        .db-content{flex:1;overflow-y:auto;padding:2rem;}

        /* Cards */
        .card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.12);overflow:hidden;}
        .card-accent{position:relative;}
        .card-accent::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--gold);}
        .card-accent>*{padding-left:calc(1rem + 4px);}

        /* Stat cards */
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;}
        .stat-card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.12);padding:1.2rem;position:relative;overflow:hidden;}
        .stat-top-bar{position:absolute;top:0;left:0;right:0;height:3px;}
        .stat-icon{font-size:1.4rem;margin-bottom:.6rem;}
        .stat-value{font-family:var(--font-d);font-size:2rem;font-weight:700;color:var(--gold);line-height:1;}
        .stat-label{font-size:.7rem;color:var(--muted);letter-spacing:.08em;margin-top:.3rem;}
        .stat-trend{display:inline-flex;align-items:center;gap:.25rem;font-size:.68rem;padding:.15rem .45rem;border-radius:2px;margin-top:.4rem;}
        .trend-up{background:rgba(39,174,96,.12);color:var(--success);}
        .trend-down{background:rgba(192,57,43,.12);color:var(--danger);}

        /* Section headers */
        .section-hd{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.2rem;}
        .section-eyebrow{font-size:.58rem;color:var(--gold);letter-spacing:.3em;text-transform:uppercase;display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;}
        .section-eyebrow::before{content:'';display:block;width:18px;height:1px;background:var(--gold);opacity:.6;}
        .section-title{font-family:var(--font-d);font-size:1.3rem;font-weight:300;color:var(--white);}
        .section-action{font-size:.7rem;color:var(--gold);cursor:none;background:none;border:none;letter-spacing:.08em;transition:opacity .2s;}
        .section-action:hover{opacity:.7;}

        /* Badges */
        .badge{display:inline-flex;align-items:center;padding:.2rem .6rem;font-size:.6rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;border-radius:999px;border:1px solid;}
        .badge-success{background:rgba(39,174,96,.1);color:var(--success);border-color:rgba(39,174,96,.25);}
        .badge-warning{background:rgba(230,126,34,.1);color:var(--warning);border-color:rgba(230,126,34,.25);}
        .badge-danger{background:rgba(192,57,43,.1);color:var(--danger);border-color:rgba(192,57,43,.25);}
        .badge-gold{background:rgba(201,168,76,.1);color:var(--gold);border-color:rgba(201,168,76,.2);}
        .badge-muted{background:rgba(138,155,181,.08);color:var(--muted);border-color:rgba(138,155,181,.15);}

        /* Divider */
        .divider{height:1px;background:rgba(201,168,76,.1);margin:1rem 0;}

        /* Buttons */
        .btn{padding:.65rem 1.5rem;font-family:var(--font-b);font-size:.7rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;cursor:none;border:none;transition:all .25s;display:inline-flex;align-items:center;gap:.5rem;}
        .btn-primary{background:var(--gold);color:var(--navy);}
        .btn-primary:hover{background:var(--gold-light);}
        .btn-ghost{background:transparent;border:1px solid rgba(201,168,76,.35);color:var(--gold);}
        .btn-ghost:hover{background:rgba(201,168,76,.08);}
        .btn-danger{background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.3);color:var(--danger);}
        .btn-sm{padding:.4rem .9rem;font-size:.62rem;}

        /* Tables */
        .data-table{width:100%;border-collapse:collapse;}
        .data-table th{font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);padding:.7rem 1rem;border-bottom:1px solid rgba(201,168,76,.08);text-align:left;font-weight:400;}
        .data-table td{padding:.75rem 1rem;border-bottom:1px solid rgba(201,168,76,.04);font-size:.82rem;color:var(--white);}
        .data-table tr:hover td{background:rgba(201,168,76,.03);}

        /* Progress bar */
        .bar-track{height:5px;background:rgba(138,155,181,.1);border-radius:2px;overflow:hidden;flex:1;}
        .bar-fill{height:100%;border-radius:2px;transition:width .6s var(--ease);}

        /* Sensor cards */
        .sensor-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;}
        .sensor-card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.12);padding:1.2rem;position:relative;overflow:hidden;cursor:none;}
        .sensor-left-bar{position:absolute;left:0;top:0;bottom:0;width:4px;}
        .sensor-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.8rem;}
        .sensor-meta{display:flex;align-items:center;gap:.5rem;}
        .sensor-name{font-size:.82rem;font-weight:500;color:var(--white);}
        .sensor-loc{font-size:.68rem;color:var(--muted);}
        .sensor-value-block{text-align:right;}
        .sensor-val{font-family:var(--font-d);font-size:1.8rem;font-weight:700;line-height:1;}
        .sensor-unit{font-size:.68rem;color:var(--muted);}
        .sensor-footer{display:flex;justify-content:space-between;align-items:center;margin-top:.7rem;}
        .sensor-range{font-size:.65rem;color:rgba(138,155,181,.5);}

        /* Alert banner */
        .alert-strip{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;border-left:3px solid;margin-bottom:.75rem;font-size:.82rem;}
        .alert-danger{background:rgba(192,57,43,.07);border-color:var(--danger);}
        .alert-warning{background:rgba(230,126,34,.07);border-color:var(--warning);}
        .alert-info{background:rgba(41,128,185,.07);border-color:var(--info);}
        .alert-icon{font-size:1.1rem;}
        .alert-body{flex:1;}
        .alert-title{font-weight:500;font-size:.82rem;margin-bottom:.1rem;}
        .alert-sub{font-size:.72rem;color:var(--muted);}
        .alert-time{font-size:.65rem;color:rgba(138,155,181,.4);}

        /* Reminders */
        .reminder-item{display:flex;align-items:center;gap:.9rem;padding:.85rem 1rem;border-bottom:1px solid rgba(201,168,76,.06);cursor:none;transition:background .2s;}
        .reminder-item:hover{background:rgba(201,168,76,.04);}
        .reminder-icon-box{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;}
        .reminder-body{flex:1;}
        .reminder-title{font-size:.82rem;font-weight:500;color:var(--white);}
        .reminder-due{font-size:.68rem;color:var(--muted);margin-top:2px;}

        /* Resources */
        .resource-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;}
        .resource-card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.1);padding:1.2rem;cursor:none;transition:border-color .25s,background .25s;text-decoration:none;display:block;position:relative;overflow:hidden;}
        .resource-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .3s;}
        .resource-card:hover{border-color:rgba(201,168,76,.3);background:rgba(201,168,76,.03);}
        .resource-card:hover::after{transform:scaleX(1);}
        .resource-tag{font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;}
        .resource-title{font-size:.88rem;font-weight:500;color:var(--white);margin-bottom:.5rem;line-height:1.4;}
        .resource-source{font-size:.7rem;color:var(--muted);}
        .resource-arrow{position:absolute;top:1rem;right:1rem;color:var(--gold);opacity:.5;font-size:.9rem;}

        /* AI Scan */
        .scan-box{background:var(--navy-mid);border:1px solid rgba(201,168,76,.15);padding:2.5rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.2rem;}
        .scan-icon{font-size:3.5rem;}
        .scan-title{font-family:var(--font-d);font-size:1.6rem;font-weight:300;}
        .scan-desc{font-size:.85rem;color:var(--muted);max-width:440px;line-height:1.7;}
        .conf-bar-track{height:4px;background:rgba(201,168,76,.1);border-radius:2px;overflow:hidden;margin:0.5rem 0;}
        .conf-bar-fill{height:4px;background:var(--gold);border-radius:2px;transition:width .8s var(--ease);}

        /* Finance */
        .finance-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(201,168,76,.1);margin-bottom:1.5rem;}
        .finance-cell{background:var(--navy-mid);padding:1.2rem;text-align:center;}
        .finance-val{font-family:var(--font-d);font-size:1.5rem;font-weight:700;margin-bottom:.3rem;}
        .finance-lbl{font-size:.65rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;}

        /* Modal */
        .modal-overlay{position:fixed;inset:0;background:rgba(7,15,30,.8);z-index:1000;display:flex;align-items:flex-end;justify-content:center;}
        .modal-sheet{background:var(--navy-mid);border-top:2px solid var(--gold);padding:2rem;width:100%;max-width:520px;max-height:85vh;overflow-y:auto;animation:slideUp .3s var(--ease);}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .modal-title{font-family:var(--font-d);font-size:1.3rem;font-weight:300;margin-bottom:1.2rem;}
        .form-field{margin-bottom:1rem;}
        .form-label{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.4rem;}
        .form-input,.form-select{width:100%;background:var(--navy-dark);border:1px solid rgba(201,168,76,.15);color:var(--white);padding:.75rem 1rem;font-family:var(--font-b);font-size:.85rem;font-weight:300;outline:none;transition:border-color .25s;cursor:none;}
        .form-input:focus,.form-select:focus{border-color:rgba(201,168,76,.45);}
        .modal-actions{display:flex;gap:.75rem;margin-top:1.5rem;}

        /* Quick actions */
        .quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;}
        .quick-card{background:var(--navy-mid);border:1px solid rgba(201,168,76,.1);padding:1.2rem;text-align:center;cursor:none;transition:border-color .25s,background .25s;}
        .quick-card:hover{border-color:rgba(201,168,76,.3);background:rgba(201,168,76,.04);}
        .quick-icon{font-size:1.8rem;margin-bottom:.5rem;}
        .quick-label{font-size:.72rem;color:var(--muted);}

        /* Flock table rows */
        .flock-health-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:.4rem;}

        /* Disclaimer */
        .disclaimer{background:rgba(41,128,185,.07);border:1px solid rgba(41,128,185,.2);padding:.85rem 1rem;font-size:.78rem;color:var(--muted-light);line-height:1.6;margin-bottom:1.5rem;}
        .disclaimer strong{color:var(--white);}

        /* Responsive */
        @media(max-width:900px){
          .sidebar{position:fixed;height:100vh;z-index:200;}
          .sidebar.collapsed{transform:translateX(-100%);width:260px;}
          .db-main{margin-left:0!important;}
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .quick-grid{grid-template-columns:repeat(2,1fr);}
          .finance-summary{grid-template-columns:1fr;}
        }
      `}</style>

      {/* Cursor */}
      <div className="c-dot" ref={cursorDot} />
      <div className="c-ring" ref={cursorRing} />

      <div className="db-layout">
        {/* ── SIDEBAR ── */}
        <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sb-header">
            <div className="sb-logo">
              {sidebarOpen ? (
                <>
                  <span className="gold">POLTRI</span>
                  <span>FARM</span>
                </>
              ) : (
                <span className="gold">P</span>
              )}
            </div>
            {sidebarOpen && <div className="sb-sub">Management System</div>}
          </div>

          {sidebarOpen && (
            <div className="sb-profile">
              <div className="sb-avatar">
                {user.name?.slice(0, 2).toUpperCase() || "GN"}
              </div>
              <div className="sb-info">
                <div className="sb-name">{user.name || "Farmer"}</div>
                <div className="sb-role">🌾 Farmer</div>
              </div>
            </div>
          )}

          <nav className="sb-nav">
            {sidebarOpen && <div className="sb-section-label">Main Menu</div>}
            {NAV.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
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

          <button className="sb-toggle" onClick={() => setSidebar((v) => !v)}>
            {sidebarOpen ? "‹" : "›"}
          </button>
        </aside>

        {/* ── MAIN ── */}
        <main className="db-main" style={{ marginLeft: sidebarOpen ? 0 : 0 }}>
          {/* Topbar */}
          <div className="db-topbar">
            <div className="topbar-title">
              {NAV.find((n) => n.id === activeTab)?.label || "Dashboard"}
            </div>
            <div className="topbar-right">
              {user.farmName && (
                <span className="topbar-badge">🌾 {user.farmName}</span>
              )}
              {criticalSensors > 0 && (
                <div className="topbar-alert">
                  ⚠
                  <span className="alert-pip" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="db-content">
            {/* ══ DASHBOARD ══ */}
            {activeTab === "dashboard" && (
              <>
                {/* Stats */}
                <div className="stats-grid">
                  {[
                    {
                      icon: "🐔",
                      val: flocks
                        .reduce((s, f) => s + f.count, 0)
                        .toLocaleString(),
                      label: "Total Birds",
                      trend: "↑ 2%",
                      up: true,
                      color: "var(--gold)",
                    },
                    {
                      icon: "🥚",
                      val: "284",
                      label: "Eggs Today",
                      trend: "↑ 12%",
                      up: true,
                      color: "var(--success)",
                    },
                    {
                      icon: "🌡️",
                      val: "29°C",
                      label: "Avg. Shed Temp",
                      trend: "↑ 2°",
                      up: false,
                      color: "var(--warning)",
                    },
                    {
                      icon: "💧",
                      val: "18%",
                      label: "Water Level",
                      trend: "↓ 8%",
                      up: false,
                      color: "var(--danger)",
                    },
                    {
                      icon: "🌾",
                      val: "42 kg",
                      label: "Feed Left",
                      trend: "↓ 6kg",
                      up: false,
                      color: "var(--warning)",
                    },
                    {
                      icon: "💰",
                      val: fmt(netProfit),
                      label: "Net Profit",
                      trend: "↑ 14%",
                      up: true,
                      color:
                        netProfit >= 0 ? "var(--success)" : "var(--danger)",
                    },
                  ].map((s) => (
                    <div className="stat-card" key={s.label}>
                      <div
                        className="stat-top-bar"
                        style={{ background: s.color }}
                      />
                      <div className="stat-icon">{s.icon}</div>
                      <div className="stat-value" style={{ color: s.color }}>
                        {s.val}
                      </div>
                      <div className="stat-label">{s.label}</div>
                      <div
                        className={`stat-trend ${
                          s.up ? "trend-up" : "trend-down"
                        }`}
                      >
                        {s.trend}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active alerts */}
                <div style={{ marginBottom: "2rem" }}>
                  <div className="section-hd">
                    <div>
                      <div className="section-eyebrow">Alerts</div>
                      <div className="section-title">Active Notifications</div>
                    </div>
                  </div>
                  <div className="alert-strip alert-danger">
                    <span className="alert-icon">🪣</span>
                    <div className="alert-body">
                      <div className="alert-title">
                        Water Level Critical — Trough 3
                      </div>
                      <div className="alert-sub">
                        Currently at 18% — refill immediately to avoid
                        dehydration stress.
                      </div>
                    </div>
                    <span className="alert-time">2m ago</span>
                  </div>
                  <div className="alert-strip alert-warning">
                    <span className="alert-icon">🌡️</span>
                    <div className="alert-body">
                      <div className="alert-title">
                        Shed A Temperature Rising
                      </div>
                      <div className="alert-sub">
                        29°C and climbing — check ventilation before threshold
                        breach.
                      </div>
                    </div>
                    <span className="alert-time">8m ago</span>
                  </div>
                  <div className="alert-strip alert-warning">
                    <span className="alert-icon">🌾</span>
                    <div className="alert-body">
                      <div className="alert-title">
                        Feed Running Low — Feeder A
                      </div>
                      <div className="alert-sub">
                        42 kg remaining — below safe replenishment threshold.
                      </div>
                    </div>
                    <span className="alert-time">15m ago</span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="section-hd">
                  <div>
                    <div className="section-eyebrow">Quick Tools</div>
                    <div className="section-title">Quick Actions</div>
                  </div>
                </div>
                <div className="quick-grid">
                  {[
                    { icon: "🔬", label: "AI Health\nScan", tab: "health" },
                    { icon: "📡", label: "Sensor\nMonitor", tab: "sensors" },
                    { icon: "🐔", label: "Add Flock\nRecord", tab: "flock" },
                    { icon: "💰", label: "Log\nTransaction", tab: "finance" },
                  ].map((q) => (
                    <div
                      className="quick-card"
                      key={q.label}
                      onClick={() => setActiveTab(q.tab)}
                    >
                      <div className="quick-icon">{q.icon}</div>
                      <div
                        className="quick-label"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {q.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flock mini-summary */}
                <div className="section-hd">
                  <div>
                    <div className="section-eyebrow">Flocks</div>
                    <div className="section-title">Batch Overview</div>
                  </div>
                  <button
                    className="section-action"
                    onClick={() => setActiveTab("flock")}
                  >
                    Manage all →
                  </button>
                </div>
                <div className="card" style={{ marginBottom: "2rem" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Batch</th>
                        <th>Type</th>
                        <th>Birds</th>
                        <th>Age</th>
                        <th>Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flocks.slice(0, 4).map((f) => (
                        <tr key={f.id}>
                          <td style={{ fontWeight: 500 }}>{f.batchName}</td>
                          <td>
                            <span className="badge badge-muted">{f.type}</span>
                          </td>
                          <td>{f.count?.toLocaleString()}</td>
                          <td>{f.age}d</td>
                          <td>
                            <span
                              className={`badge badge-${
                                f.health === "good"
                                  ? "success"
                                  : f.health === "warning"
                                  ? "warning"
                                  : "danger"
                              }`}
                            >
                              {f.health}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ FLOCK MANAGEMENT ══ */}
            {activeTab === "flock" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <div className="section-eyebrow">Flock</div>
                    <div className="section-title">Flock Management</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setAddFlock(true)}
                  >
                    + Add Batch
                  </button>
                </div>

                {/* Summary row */}
                <div
                  className="stats-grid"
                  style={{ gridTemplateColumns: "repeat(3,1fr)" }}
                >
                  {[
                    {
                      icon: "🐔",
                      val: flocks
                        .reduce((s, f) => s + f.count, 0)
                        .toLocaleString(),
                      label: "Total Birds",
                      color: "var(--gold)",
                    },
                    {
                      icon: "⚠️",
                      val: flocks.filter((f) => f.health !== "good").length,
                      label: "Need Attention",
                      color: "var(--warning)",
                    },
                    {
                      icon: "💀",
                      val: flocks.reduce((s, f) => s + (f.mortality || 0), 0),
                      label: "Total Mortality",
                      color: "var(--danger)",
                    },
                  ].map((s) => (
                    <div className="stat-card" key={s.label}>
                      <div
                        className="stat-top-bar"
                        style={{ background: s.color }}
                      />
                      <div className="stat-icon">{s.icon}</div>
                      <div className="stat-value" style={{ color: s.color }}>
                        {s.val}
                      </div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Full flock table */}
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Batch</th>
                        <th>Type</th>
                        <th>Shed</th>
                        <th>Birds</th>
                        <th>Age</th>
                        <th>Mortality</th>
                        <th>Feed Used</th>
                        <th>Health</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flocks.map((f) => (
                        <tr key={f.id}>
                          <td style={{ fontWeight: 500 }}>{f.batchName}</td>
                          <td>
                            <span className="badge badge-muted">{f.type}</span>
                          </td>
                          <td
                            style={{
                              color: "var(--muted)",
                              fontSize: ".78rem",
                            }}
                          >
                            {f.shed}
                          </td>
                          <td>{f.count?.toLocaleString()}</td>
                          <td>{f.age}d</td>
                          <td style={{ color: "var(--danger)" }}>
                            {f.mortality}
                          </td>
                          <td
                            style={{
                              color: "var(--muted)",
                              fontSize: ".78rem",
                            }}
                          >
                            {f.feedConsumed}
                          </td>
                          <td>
                            <span
                              className={`badge badge-${
                                f.health === "good"
                                  ? "success"
                                  : f.health === "warning"
                                  ? "warning"
                                  : "danger"
                              }`}
                            >
                              {f.health}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setFlock(f)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ SENSORS ══ */}
            {activeTab === "sensors" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <div className="section-eyebrow">IoT Network</div>
                    <div className="section-title">Sensor Monitoring</div>
                  </div>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                      fontSize: ".7rem",
                      color: "var(--success)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--success)",
                        display: "inline-block",
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                    LIVE
                  </span>
                </div>
                <div className="sensor-grid">
                  {sensors.map((s) => {
                    const c = statusColor(s.status);
                    return (
                      <div className="sensor-card" key={s.id}>
                        <div
                          className="sensor-left-bar"
                          style={{ background: c }}
                        />
                        <div className="sensor-top">
                          <div className="sensor-meta">
                            <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
                            <div>
                              <div className="sensor-name">{s.name}</div>
                              <div className="sensor-loc">{s.location}</div>
                            </div>
                          </div>
                          <div className="sensor-value-block">
                            <div className="sensor-val" style={{ color: c }}>
                              {s.value}
                            </div>
                            <div className="sensor-unit">{s.unit}</div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".7rem",
                          }}
                        >
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{ width: `${barPct(s)}%`, background: c }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: ".65rem",
                              color: "var(--muted)",
                              width: "36px",
                              textAlign: "right",
                            }}
                          >
                            {barPct(s).toFixed(0)}%
                          </span>
                        </div>
                        <div className="sensor-footer">
                          <span className="sensor-range">
                            Range: {s.min}–{s.max} {s.unit}
                          </span>
                          <span
                            className={`badge badge-${
                              s.status === "normal"
                                ? "success"
                                : s.status === "warning"
                                ? "warning"
                                : "danger"
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ══ AI HEALTH SCAN ══ */}
            {activeTab === "health" && (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div className="section-eyebrow">AI Analysis</div>
                  <div className="section-title">Poultry Health Scan</div>
                </div>
                <div className="disclaimer">
                  <strong>Decision support only.</strong> This tool is not a
                  veterinary diagnostic instrument. Results are preliminary
                  guidance — always consult a qualified veterinarian for medical
                  decisions.
                </div>

                {scanState === "idle" && (
                  <div className="scan-box">
                    <div className="scan-icon">🔬</div>
                    <div className="scan-title">Capture a Bird Image</div>
                    <div className="scan-desc">
                      Photograph a visible abnormality — lesions, nasal
                      discharge, abnormal feathering, or behaviour changes. Our
                      MobileNetV2 model will analyse for possible conditions.
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={handleAIScan}
                      >
                        📷 Simulate Scan
                      </button>
                      <button className="btn btn-ghost">🖼 Upload Image</button>
                    </div>
                  </div>
                )}

                {scanState === "analyzing" && (
                  <div className="scan-box">
                    <div
                      className="scan-icon"
                      style={{ animation: "pulse 1s infinite" }}
                    >
                      ⏳
                    </div>
                    <div className="scan-title">Analysing…</div>
                    <div className="scan-desc">
                      MobileNetV2 CNN processing. Comparing against poultry
                      disease database.
                    </div>
                    {[
                      "Pre-processing image",
                      "Running CNN inference",
                      "Ranking predictions",
                      "Generating guidance",
                    ].map((s, i) => (
                      <div
                        key={s}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".6rem",
                          fontSize: ".78rem",
                          color: i < 2 ? "var(--success)" : "var(--muted)",
                        }}
                      >
                        <span>{i < 2 ? "✓" : "○"}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {scanState === "results" && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: ".75rem",
                        marginBottom: "1.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span className="badge badge-gold">
                        Analysis Complete
                      </span>
                      <span className="badge badge-muted">
                        Top match: {AI_PREDICTIONS[0].confidence}% confidence
                      </span>
                    </div>
                    {AI_PREDICTIONS.map((pred, i) => (
                      <div
                        className="card card-accent"
                        key={pred.condition}
                        style={{ marginBottom: "1rem", padding: "1.2rem" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: ".7rem",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontWeight: 500,
                                color: "var(--white)",
                                marginBottom: ".3rem",
                              }}
                            >
                              #{i + 1} — {pred.condition}
                            </div>
                            <span
                              className={`badge badge-${
                                pred.severity === "high"
                                  ? "danger"
                                  : pred.severity === "medium"
                                  ? "warning"
                                  : "success"
                              }`}
                            >
                              {pred.severity} severity
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontFamily: "var(--font-d)",
                                fontSize: "1.6rem",
                                fontWeight: 700,
                                color: i === 0 ? "var(--gold)" : "var(--muted)",
                              }}
                            >
                              {pred.confidence}%
                            </div>
                            <div
                              style={{
                                fontSize: ".65rem",
                                color: "var(--muted)",
                              }}
                            >
                              confidence
                            </div>
                          </div>
                        </div>
                        <div className="conf-bar-track">
                          <div
                            className="conf-bar-fill"
                            style={{
                              width: `${pred.confidence}%`,
                              background:
                                i === 0 ? "var(--gold)" : "rgba(201,168,76,.3)",
                            }}
                          />
                        </div>
                        <div style={{ marginTop: ".8rem" }}>
                          <div
                            style={{
                              fontSize: ".65rem",
                              color: "var(--gold)",
                              letterSpacing: ".2em",
                              textTransform: "uppercase",
                              marginBottom: ".5rem",
                            }}
                          >
                            Recommended Actions
                          </div>
                          {pred.actions.map((a) => (
                            <div
                              key={a}
                              style={{
                                display: "flex",
                                gap: ".5rem",
                                fontSize: ".8rem",
                                marginBottom: ".3rem",
                                color: "var(--muted-light)",
                              }}
                            >
                              <span style={{ color: "var(--gold)" }}>›</span>
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setScanState("idle")}
                      >
                        Scan Another Bird
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        Save Report
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ══ FINANCIAL TRACKING ══ */}
            {activeTab === "finance" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <div className="section-eyebrow">Finance</div>
                    <div className="section-title">Financial Tracking</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setAddTx(true)}
                  >
                    + Add Transaction
                  </button>
                </div>

                <div
                  className="finance-summary card"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <div className="finance-cell">
                    <div
                      className="finance-val"
                      style={{ color: "var(--success)" }}
                    >
                      {fmt(totalIncome)}
                    </div>
                    <div className="finance-lbl">Total Income</div>
                  </div>
                  <div className="finance-cell">
                    <div
                      className="finance-val"
                      style={{ color: "var(--danger)" }}
                    >
                      {fmt(totalExpense)}
                    </div>
                    <div className="finance-lbl">Total Expenses</div>
                  </div>
                  <div className="finance-cell">
                    <div
                      className="finance-val"
                      style={{
                        color:
                          netProfit >= 0 ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {netProfit >= 0 ? "+" : ""}
                      {fmt(netProfit)}
                    </div>
                    <div className="finance-lbl">Net Profit</div>
                  </div>
                </div>

                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td
                            style={{
                              color: "var(--muted)",
                              fontSize: ".75rem",
                            }}
                          >
                            {tx.date}
                          </td>
                          <td style={{ fontWeight: 500 }}>{tx.category}</td>
                          <td
                            style={{
                              color: "var(--muted)",
                              fontSize: ".78rem",
                            }}
                          >
                            {tx.description}
                          </td>
                          <td>
                            <span
                              className={`badge badge-${
                                tx.type === "income" ? "success" : "danger"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td
                            style={{
                              fontFamily: "var(--font-d)",
                              fontSize: "1rem",
                              fontWeight: 700,
                              color:
                                tx.type === "income"
                                  ? "var(--success)"
                                  : "var(--danger)",
                            }}
                          >
                            {tx.type === "income" ? "+" : "-"}
                            {fmt(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ REMINDERS ══ */}
            {activeTab === "reminders" && (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div className="section-eyebrow">Schedule</div>
                  <div className="section-title">Vaccination & Reminders</div>
                </div>
                {reminders
                  .sort((a, b) =>
                    a.urgent === b.urgent ? 0 : a.urgent ? -1 : 1,
                  )
                  .map((r) => {
                    const colors = {
                      vaccine: "var(--info)",
                      sanitation: "var(--warning)",
                      feed: "var(--gold)",
                    };
                    const icons = {
                      vaccine: "💉",
                      sanitation: "🧹",
                      feed: "🌾",
                    };
                    return (
                      <div
                        className={`card ${r.urgent ? "card-accent" : ""}`}
                        key={r.id}
                        style={{ marginBottom: ".75rem" }}
                      >
                        <div className="reminder-item">
                          <div
                            className="reminder-icon-box"
                            style={{ background: `${colors[r.type]}18` }}
                          >
                            <span>{icons[r.type] || "📋"}</span>
                          </div>
                          <div className="reminder-body">
                            <div className="reminder-title">{r.title}</div>
                            <div className="reminder-due">Due: {r.due}</div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: ".5rem",
                              alignItems: "center",
                            }}
                          >
                            {r.urgent && (
                              <span className="badge badge-danger">Urgent</span>
                            )}
                            <button className="btn btn-ghost btn-sm">
                              Mark Done
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}

            {/* ══ FEED & INVENTORY ══ */}
            {activeTab === "feed" && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <div className="section-eyebrow">Feed & Inventory</div>
                    <div className="section-title">Stock Management</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setAddFeed(true)}
                  >
                    + Log Feed Usage
                  </button>
                </div>

                {/* Low stock warnings */}
                {inventory.filter((i) => i.stock <= i.reorderAt).length > 0 && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    {inventory
                      .filter((i) => i.stock <= i.reorderAt)
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`alert-strip ${
                            item.stock < item.reorderAt * 0.5
                              ? "alert-danger"
                              : "alert-warning"
                          }`}
                        >
                          <span className="alert-icon">
                            {item.stock < item.reorderAt * 0.5 ? "🔴" : "🟡"}
                          </span>
                          <div className="alert-body">
                            <div className="alert-title">
                              {item.name} — Low Stock
                            </div>
                            <div className="alert-sub">
                              {item.stock} {item.unit} remaining · Reorder at{" "}
                              {item.reorderAt} {item.unit} · Supplier:{" "}
                              {item.supplier}
                            </div>
                          </div>
                          <button className="btn btn-ghost btn-sm">
                            Order Now
                          </button>
                        </div>
                      ))}
                  </div>
                )}

                {/* Summary stats */}
                <div
                  className="stats-grid"
                  style={{
                    gridTemplateColumns: "repeat(4,1fr)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {[
                    {
                      icon: "🌾",
                      val: inventory.filter((i) => i.type === "Feed").length,
                      label: "Feed Types",
                      color: "var(--gold)",
                    },
                    {
                      icon: "⚠️",
                      val: inventory.filter((i) => i.stock <= i.reorderAt)
                        .length,
                      label: "Low Stock Items",
                      color: "var(--warning)",
                    },
                    {
                      icon: "💊",
                      val: inventory.filter((i) => i.type === "Medication")
                        .length,
                      label: "Medications",
                      color: "var(--info)",
                    },
                    {
                      icon: "💰",
                      val: `KSh ${inventory
                        .reduce((s, i) => s + i.stock * i.costPerUnit, 0)
                        .toLocaleString()}`,
                      label: "Stock Value",
                      color: "var(--success)",
                    },
                  ].map((s) => (
                    <div className="stat-card" key={s.label}>
                      <div
                        className="stat-top-bar"
                        style={{ background: s.color }}
                      />
                      <div className="stat-icon">{s.icon}</div>
                      <div
                        className="stat-value"
                        style={{ color: s.color, fontSize: "1.5rem" }}
                      >
                        {s.val}
                      </div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Inventory table */}
                <div style={{ marginBottom: "1.2rem" }}>
                  <div className="section-eyebrow">Inventory</div>
                  <div className="section-title">All Stock Items</div>
                </div>
                <div className="card" style={{ marginBottom: "2rem" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Stock</th>
                        <th>Reorder At</th>
                        <th>Cost/Unit</th>
                        <th>Batch</th>
                        <th>Supplier</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => {
                        const pct = (item.stock / (item.reorderAt * 2)) * 100;
                        const statusV =
                          item.stock < item.reorderAt * 0.5
                            ? "danger"
                            : item.stock <= item.reorderAt
                            ? "warning"
                            : "success";
                        const statusL =
                          item.stock < item.reorderAt * 0.5
                            ? "Critical"
                            : item.stock <= item.reorderAt
                            ? "Low"
                            : "OK";
                        return (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 500 }}>{item.name}</td>
                            <td>
                              <span className="badge badge-muted">
                                {item.type}
                              </span>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                <span>
                                  {item.stock} {item.unit}
                                </span>
                                <div
                                  className="bar-track"
                                  style={{ width: 100 }}
                                >
                                  <div
                                    className="bar-fill"
                                    style={{
                                      width: `${Math.min(pct, 100)}%`,
                                      background:
                                        statusV === "success"
                                          ? "var(--success)"
                                          : statusV === "warning"
                                          ? "var(--warning)"
                                          : "var(--danger)",
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td
                              style={{
                                color: "var(--muted)",
                                fontSize: ".75rem",
                              }}
                            >
                              {item.reorderAt} {item.unit}
                            </td>
                            <td
                              style={{
                                color: "var(--gold)",
                                fontFamily: "var(--font-d)",
                              }}
                            >
                              KSh {item.costPerUnit}
                            </td>
                            <td
                              style={{
                                color: "var(--muted)",
                                fontSize: ".75rem",
                              }}
                            >
                              {item.batch}
                            </td>
                            <td
                              style={{
                                color: "var(--muted)",
                                fontSize: ".75rem",
                              }}
                            >
                              {item.supplier}
                            </td>
                            <td>
                              <span className={`badge badge-${statusV}`}>
                                {statusL}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Feed consumption log */}
                <div className="section-hd">
                  <div>
                    <div className="section-eyebrow">Consumption</div>
                    <div className="section-title">Feed Usage Log</div>
                  </div>
                </div>
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Batch</th>
                        <th>Feed Type</th>
                        <th>Amount</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedLog.map((entry, i) => (
                        <tr key={i}>
                          <td
                            style={{
                              color: "var(--muted)",
                              fontSize: ".75rem",
                            }}
                          >
                            {entry.date}
                          </td>
                          <td style={{ fontWeight: 500 }}>{entry.batch}</td>
                          <td>{entry.feedType}</td>
                          <td>{entry.kg} kg</td>
                          <td
                            style={{
                              fontFamily: "var(--font-d)",
                              color: "var(--danger)",
                            }}
                          >
                            KSh {entry.cost.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ RESOURCES ══ */}
            {activeTab === "resources" && (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div className="section-eyebrow">Learning</div>
                  <div className="section-title">Educational Resources</div>
                </div>
                <div className="resource-grid">
                  {RESOURCES.map((r) => (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="resource-card"
                      key={r.title}
                    >
                      <div className="resource-tag">{r.tag}</div>
                      <div className="resource-title">{r.title}</div>
                      <div className="resource-source">Source: {r.source}</div>
                      <span className="resource-arrow">↗</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* /content */}
        </main>
      </div>

      {/* ── LOG FEED USAGE MODAL ── */}
      {addFeedOpen && (
        <div className="modal-overlay" onClick={() => setAddFeed(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Log Feed Usage</div>
            <div className="divider" />
            <div className="form-field">
              <label className="form-label">Feed Type</label>
              <select
                className="form-select"
                value={newFeedEntry.feedType}
                onChange={(e) =>
                  setNewFeedEntry((v) => ({ ...v, feedType: e.target.value }))
                }
              >
                <option value="">Select feed type</option>
                {inventory
                  .filter((i) => i.type === "Feed")
                  .map((i) => (
                    <option key={i.id}>{i.name}</option>
                  ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Batch</label>
              <select
                className="form-select"
                value={newFeedEntry.batch}
                onChange={(e) =>
                  setNewFeedEntry((v) => ({ ...v, batch: e.target.value }))
                }
              >
                <option value="">Select batch</option>
                {flocks.map((f) => (
                  <option key={f.id}>{f.batchName}</option>
                ))}
              </select>
            </div>
            {[
              {
                label: "Amount (kg)",
                key: "kg",
                placeholder: "e.g. 25",
                type: "number",
              },
              {
                label: "Cost (KSh)",
                key: "cost",
                placeholder: "e.g. 2000",
                type: "number",
              },
            ].map((f) => (
              <div className="form-field" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  type={f.type}
                  placeholder={f.placeholder}
                  value={newFeedEntry[f.key]}
                  onChange={(e) =>
                    setNewFeedEntry((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="modal-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setAddFeed(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (!newFeedEntry.feedType || !newFeedEntry.kg) return;
                  const entry = {
                    date: new Date().toISOString().split("T")[0],
                    batch: newFeedEntry.batch,
                    feedType: newFeedEntry.feedType,
                    kg: parseFloat(newFeedEntry.kg),
                    cost: parseFloat(newFeedEntry.cost) || 0,
                  };
                  setFeedLog((prev) => [entry, ...prev]);
                  // Deduct from inventory
                  setInventory((prev) =>
                    prev.map((item) =>
                      item.name === newFeedEntry.feedType
                        ? { ...item, stock: Math.max(0, item.stock - entry.kg) }
                        : item,
                    ),
                  );
                  setNewFeedEntry({
                    feedType: "",
                    batch: "",
                    kg: "",
                    cost: "",
                  });
                  setAddFeed(false);
                }}
              >
                Log Usage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOCK DETAIL MODAL ── */}
      {selectedFlock && (
        <div className="modal-overlay" onClick={() => setFlock(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              {selectedFlock.batchName} — Details
            </div>
            <div className="divider" />
            {Object.entries({
              Type: selectedFlock.type,
              Shed: selectedFlock.shed,
              "Bird Count": selectedFlock.count?.toLocaleString(),
              Age: `${selectedFlock.age} days`,
              Mortality: selectedFlock.mortality,
              "Feed Consumed": selectedFlock.feedConsumed,
              ...(selectedFlock.avgWeight
                ? { "Avg. Weight": selectedFlock.avgWeight }
                : {}),
              ...(selectedFlock.eggCount !== undefined
                ? { "Today's Eggs": selectedFlock.eggCount }
                : {}),
            }).map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: ".6rem 0",
                  borderBottom: "1px solid rgba(201,168,76,.05)",
                }}
              >
                <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>
                  {k}
                </span>
                <span style={{ fontSize: ".85rem", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div className="modal-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setFlock(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD FLOCK MODAL ── */}
      {addFlockOpen && (
        <div className="modal-overlay" onClick={() => setAddFlock(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Add New Batch</div>
            <div className="divider" />
            {[
              {
                label: "Batch Name",
                key: "batchName",
                placeholder: "e.g. Batch E",
              },
              {
                label: "Bird Count",
                key: "count",
                placeholder: "e.g. 300",
                type: "number",
              },
              { label: "Shed", key: "shed", placeholder: "e.g. Shed D" },
            ].map((f) => (
              <div className="form-field" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={newFlock[f.key]}
                  onChange={(e) =>
                    setNewFlock((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="form-field">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={newFlock.type}
                onChange={(e) =>
                  setNewFlock((v) => ({ ...v, type: e.target.value }))
                }
              >
                {["Broiler", "Layer", "Dual Purpose"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setAddFlock(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddFlock}
              >
                Add Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD TRANSACTION MODAL ── */}
      {addTxOpen && (
        <div className="modal-overlay" onClick={() => setAddTx(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Add Transaction</div>
            <div className="divider" />
            <div className="form-field">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={newTx.type}
                onChange={(e) =>
                  setNewTx((v) => ({ ...v, type: e.target.value }))
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            {[
              {
                label: "Category",
                key: "category",
                placeholder: "e.g. Egg Sales, Feed",
              },
              {
                label: "Description",
                key: "description",
                placeholder: "Brief note",
              },
              {
                label: "Amount (KSh)",
                key: "amount",
                placeholder: "0",
                type: "number",
              },
              {
                label: "Date",
                key: "date",
                placeholder: "YYYY-MM-DD",
                type: "date",
              },
            ].map((f) => (
              <div className="form-field" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={newTx[f.key]}
                  onChange={(e) =>
                    setNewTx((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="modal-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setAddTx(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleAddTx}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
