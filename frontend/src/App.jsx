import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Homepage from './pages/Homepage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './css/App.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <main>
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;