import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // 1. Yahan Register import kiya hai

function App() {
  return (
    <div className="min-h-screen bg-[#123B3B] text-[#F7F4ED] font-sans">
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* 2. Yahan Route set kiya hai */}
      </Routes>
    </div>
  );
}

export default App;