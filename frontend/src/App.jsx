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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsOfService from "./pages/TermsOfService";
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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
