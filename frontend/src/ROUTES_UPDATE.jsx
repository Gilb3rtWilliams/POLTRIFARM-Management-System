/**
 * POLTRIFARM — Routes Update
 *
 * Add ALL of these to your App.jsx Routes block.
 * File placement:
 *
 *   Legal pages  → src/pages/PrivacyPolicy.jsx etc.  (already delivered)
 *   Service docs → src/pages/FlockManagementDoc.jsx etc.
 *   Shared files → src/components/ServiceDocPage.jsx
 *                  src/css/ServiceDocs.css
 *                  src/css/Legal.css
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

// ── Auth ──────────────────────────────────────────────
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";

// ── Dashboards ────────────────────────────────────────
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ── Service documentation pages ───────────────────────
import FlockManagementDoc from "./pages/FlockManagementDoc";
import ProductionAnalyticsDoc from "./pages/ProductionAnalyticsDoc";
import HealthBiosecurityDoc from "./pages/HealthBiosecurityDoc";
import FeedInventoryDoc from "./pages/FeedInventoryDoc";
import FinancialReportingDoc from "./pages/FinancialReportingDoc";
import MultiFarmControlDoc from "./pages/MultiFarmControlDoc";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Auth */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Legal */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        {/* Protected Dashboards */}
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/**
 * ── HOMEPAGE LINKS ─────────────────────────────────────────────────────────
 *
 * In your Homepage.jsx, the "Learn more →" links on the Services section
 * cards should point to these routes. Update each service card's href:
 *
 *  Flock Management     → /services/flock-management
 *  Production Analytics → /services/production-analytics
 *  Health & Biosecurity → /services/health-biosecurity
 *  Feed & Inventory     → /services/feed-inventory
 *  Financial Reporting  → /services/financial-reporting
 *  Multi-Farm Control   → /services/multi-farm-control
 *
 * In your Footer.jsx, the legal links should point to:
 *
 *  Privacy Policy  → /privacy
 *  Terms of Service→ /terms
 *  Cookie Policy   → /cookies
 *
 * ── FILE STRUCTURE ──────────────────────────────────────────────────────────
 *
 *  src/
 *  ├── components/
 *  │   └── ServiceDocPage.jsx      ← shared template for all 6 service pages
 *  ├── css/
 *  │   ├── ServiceDocs.css         ← shared CSS for all 6 service pages
 *  │   └── Legal.css               ← shared CSS for all 3 legal pages
 *  └── pages/
 *      ├── PrivacyPolicy.jsx
 *      ├── TermsOfService.jsx
 *      ├── CookiePolicy.jsx
 *      ├── FlockManagementDoc.jsx
 *      ├── ProductionAnalyticsDoc.jsx
 *      ├── HealthBiosecurityDoc.jsx
 *      ├── FeedInventoryDoc.jsx
 *      ├── FinancialReportingDoc.jsx
 *      └── MultiFarmControlDoc.jsx
 */
