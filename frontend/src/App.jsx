import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from './pages/StudentDashboard';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio'; // Naya import kiya
import PendingReviews from './pages/PendingReviews';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#123B3B] text-[#F7F4ED] font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pending-reviews" element={<PendingReviews />} />
          
          {/* Naya Portfolio Route (ID ke sath) */}
          <Route path="/portfolio/:id" element={<Portfolio />} /> 
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;