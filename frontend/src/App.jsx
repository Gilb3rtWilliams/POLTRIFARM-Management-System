import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Homepage from "./pages/Homepage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ── Legal pages ───────────────────────────────────────
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

// ── Service documentation pages ───────────────────────
import FlockManagementDoc from "./pages/FlockManagementDoc";
import ProductionAnalyticsDoc from "./pages/ProductionAnalyticsDoc";
import HealthBiosecurityDoc from "./pages/HealthBiosecurityDoc";
import FeedInventoryDoc from "./pages/FeedInventoryDoc";
import FinancialReportingDoc from "./pages/FinancialReportingDoc";
import MultiFarmControlDoc from "./pages/MultiFarmControlDoc";

import "react-toastify/dist/ReactToastify.css";
import "./css/App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <main>
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Protected Routes */}
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Service Documentation ← NEW */}
            <Route path="/flock-management" element={<FlockManagementDoc />} />
            <Route
              path="/production-analytics"
              element={<ProductionAnalyticsDoc />}
            />
            <Route
              path="/health-biosecurity"
              element={<HealthBiosecurityDoc />}
            />
            <Route path="/feed-inventory" element={<FeedInventoryDoc />} />
            <Route
              path="/financial-reporting"
              element={<FinancialReportingDoc />}
            />
            <Route
              path="/multi-farm-control"
              element={<MultiFarmControlDoc />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
