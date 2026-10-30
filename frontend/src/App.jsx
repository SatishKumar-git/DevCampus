import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Footer import kiya
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from './pages/StudentDashboard';
import Feed from './pages/Feed';

function App() {
  return (
    // 'flex flex-col' add kiya taaki footer niche rahe
    <div className="min-h-screen flex flex-col bg-[#123B3B] text-[#F7F4ED] font-sans">
      <Navbar /> 
      
      {/* flex-grow main content ko poori bachi hui jagah dega */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </main>

      {/* Footer sabse last mein */}
      <Footer />
    </div>
  );
}

export default App;