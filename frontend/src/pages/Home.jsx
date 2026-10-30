import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';


export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Agar user login nahi hai, toh yeh normal landing page dikhega
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-5xl font-bold text-[#E69A52] mb-6">Welcome to DevCampus</h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-8">
          The ultimate platform to showcase your projects, review code, and manage the developer community.
        </p>
        <Link to="/login" className="px-6 py-3 font-bold text-[#123B3B] transition-colors rounded bg-[#E69A52] hover:bg-orange-400">
          Get Started
        </Link>
      </div>
    );
  }

  // ==========================================
  // 1. ADMIN PANEL VIEW
  // ==========================================
  if (user.role === 'ADMIN') {
    return (
      <div className="container p-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#E69A52]">Admin Dashboard</h1>
          <span className="px-3 py-1 text-sm font-bold text-red-800 bg-red-200 rounded-full">Admin Privileges</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#293638] rounded shadow-lg border-t-4 border-red-500">
            <h2 className="text-2xl font-bold text-[#F7F4ED] mb-2">Manage Users</h2>
            <p className="text-gray-400">View, block, or delete user accounts from the platform.</p>
            <button className="mt-4 text-[#E69A52] hover:underline font-bold">Go to Users →</button>
          </div>

          <div className="p-6 bg-[#293638] rounded shadow-lg border-t-4 border-red-500">
            <h2 className="text-2xl font-bold text-[#F7F4ED] mb-2">System Logs</h2>
            <p className="text-gray-400">Monitor website activity and error reports.</p>
            <button className="mt-4 text-[#E69A52] hover:underline font-bold">View Logs →</button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. TEACHER / MENTOR PANEL VIEW
  // ==========================================
  if (user.role === 'TEACHER') {
    return (
      <div className="container p-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#E69A52]">Teacher Portal</h1>
          <span className="px-3 py-1 text-sm font-bold text-blue-800 bg-blue-200 rounded-full">Review Mode</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#293638] rounded shadow-lg border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold text-[#F7F4ED] mb-2">Pending Reviews</h2>
            <p className="text-gray-400">Evaluate and grade projects submitted by your students.</p>
            <button className="mt-4 text-[#E69A52] hover:underline font-bold">Start Reviewing →</button>
          </div>

          <div className="p-6 bg-[#293638] rounded shadow-lg border-t-4 border-blue-500">
            <h2 className="text-2xl font-bold text-[#F7F4ED] mb-2">Student Leaderboard</h2>
            <p className="text-gray-400">Track top performing students in your courses.</p>
            <button className="mt-4 text-[#E69A52] hover:underline font-bold">View Leaderboard →</button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. STUDENT PANEL VIEW (Default)
  // ==========================================
  return (
    <div className="container p-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-[#E69A52]">My Workspace</h1>
        <span className="px-3 py-1 text-sm font-bold text-green-800 bg-green-200 rounded-full">Student</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Project Card (Updated) */}
        <div
          onClick={() => navigate('/student-dashboard', { state: { autoOpenForm: true } })}
          className="p-6 bg-[#293638] rounded shadow-lg border-t-4 border-[#E69A52] cursor-pointer hover:bg-[#344648] transition-colors"
        >
          <h2 className="text-2xl font-bold text-[#F7F4ED] mb-2">Upload Project</h2>
          <p className="text-gray-400">Share your latest code and host it for the community.</p>
          <button className="mt-4 text-[#E69A52] font-bold">Create New +</button>
        </div>

        {/* My Portfolio Card (Updated) */}
        <div
          onClick={() => navigate('/my-portfolio')}
          className="p-6 bg-[#293638] rounded shadow-lg border-t-4 border-[#E69A52] cursor-pointer hover:bg-[#344648] transition-colors"
        >
          <h2 className="text-2xl font-bold text-[#F7F4ED] mb-2">My Portfolio</h2>
          <p className="text-gray-400">View all your submitted projects and feedback.</p>
          <button className="mt-4 text-[#E69A52] font-bold">View Portfolio →</button>
        </div>

        {/* Global Feed Card (Remains Same) */}
        <div className="bg-[#2d3a3a] p-6 rounded-lg border-t-2 border-[#E69A52]">
          <h2 className="text-2xl font-bold text-white mb-2">Global Feed</h2>
          <p className="text-gray-400 mb-6">Explore what other students are building.</p>

          {/* Yahan humne Link tag laga diya hai */}
          <Link to="/feed" className="text-[#E69A52] font-bold hover:underline cursor-pointer">
            Browse Feed →
          </Link>
        </div>
      </div>
    </div>
  );
}