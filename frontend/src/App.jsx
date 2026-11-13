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
import Portfolio from './pages/Portfolio';
import PendingReviews from './pages/PendingReviews';
import StudentLeaderboard from './pages/StudentLeaderboard';
import ManageUsers from './pages/ManageUsers';
import ManageLogs from './pages/ManageLogs';

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
          
          {/* Student Dashboard Route */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/portfolio/:id" element={<Portfolio />} /> 
          
          {/* Teacher Portal Routes (PendingReviews ko teacher portal banaya hai) */}
          <Route path="/pending-reviews" element={<PendingReviews />} />
          <Route path="/leaderboard" element={<StudentLeaderboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/logs" element={<ManageLogs />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;