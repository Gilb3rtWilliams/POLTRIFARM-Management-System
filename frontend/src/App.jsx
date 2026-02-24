import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Homepage from './pages/Homepage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import UserLogin     from './pages/UserLogin';
import UserRegister  from './pages/UserRegister';
import AdminLogin    from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister'; 
import './css/App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <main>
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            {/* Add protected routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;