// ─────────────────────────────────────────────────────────────────────────────
// src/firebase.js
// Firebase v9 modular SDK — Auth + Firestore
//
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com
// 2. Create a project called "poltrifarm"
// 3. Add a Web App — copy your firebaseConfig object and paste it below
// 4. Enable Authentication → Sign-in method → Email/Password
// 5. Enable Firestore Database → Start in test mode (lock rules before launch)
//
// Firestore Collections expected:
//   users/{uid}          → { name, email, role: "farmer"|"admin", farmName, createdAt }
//   farms/{uid}          → { flocks, sensors, financials, reminders }
//   flocks/{flockId}     → { batchName, type, count, age, health, shed, ... }
//   transactions/{txId}  → { type, category, amount, description, date, uid }
//   sensors/{sensorId}   → { name, value, unit, status, location, uid }
//   allFarms (admin only)→ snapshot of all registered farms
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

// ── PASTE YOUR FIREBASE CONFIG HERE ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDsB8w0xSodmwqC0qan1EnaCGrNUK58Qd4",
  authDomain: "poltrifarm.firebaseapp.com",
  projectId: "poltrifarm",
  storageBucket: "poltrifarm.firebasestorage.app",
  messagingSenderId: "401484890897",
  appId: "1:401484890897:web:4bd281c57756064a5582b0",
  measurementId: "G-E764SBN8Y8",
};

// ─────────────────────────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── AUTH HELPERS ─────────────────────────────────────────────────────────────

export const registerUser = async ({
  email,
  password,
  name,
  farmName,
  role = "farmer",
  adminRole = "",
  accessCode = "",
  approved,
}) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  // Determine approval: farmers auto-approved, admins always start pending
  const isApproved = approved !== undefined ? approved : role === "farmer";

  const userDoc = {
    name,
    email,
    role,
    farmName: farmName || "",
    createdAt: serverTimestamp(),
    approved: isApproved,
  };

  // Admin-only fields
  if (role === "admin") {
    userDoc.adminRole = adminRole || "";
    userDoc.accessCode = accessCode || "";
  }

  await setDoc(doc(db, "users", cred.user.uid), userDoc);
  return cred.user;
};

export const loginUser = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists()) throw new Error("User record not found.");
  const data = snap.data();
  if (!data.approved)
    throw new Error("Your admin account is pending approval.");
  return { user: cred.user, role: data.role, userData: data };
};

export const logoutUser = () => signOut(auth);

export const getCurrentUserData = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const onUserAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ── FARMER DATA HELPERS ───────────────────────────────────────────────────────

export const getFlocks = async (uid) => {
  const q = query(
    collection(db, "flocks"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addFlock = async (uid, data) => {
  return addDoc(collection(db, "flocks"), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
};

export const updateFlock = async (flockId, data) => {
  return updateDoc(doc(db, "flocks", flockId), data);
};

export const deleteFlock = async (flockId) => {
  return deleteDoc(doc(db, "flocks", flockId));
};

export const getSensorReadings = async (uid) => {
  const q = query(collection(db, "sensors"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getTransactions = async (uid) => {
  const q = query(
    collection(db, "transactions"),
    where("uid", "==", uid),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addTransaction = async (uid, data) => {
  return addDoc(collection(db, "transactions"), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
};

// ── ADMIN DATA HELPERS ────────────────────────────────────────────────────────

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const approveUser = async (uid) => {
  return updateDoc(doc(db, "users", uid), { approved: true });
};

export const banUser = async (uid) => {
  return updateDoc(doc(db, "users", uid), { approved: false });
};

export const updateUserRole = async (uid, role) => {
  return updateDoc(doc(db, "users", uid), { role });
};

// Live listener — used by admin dashboard for real-time user list
export const listenToAllUsers = (cb) => {
  return onSnapshot(collection(db, "users"), (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
