import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // Default role Student
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { 
        name, 
        email, 
        course,
        enrollment_number: enrollment,
        role, // Dropdown se select kiya hua role yahan jayega
        password 
      });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
      console.error('Register Error:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F4ED] font-sans">
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-16 bg-[#123B3B] text-[#F7F4ED] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#F7F4ED_1px,transparent_1px),linear-gradient(to_bottom,#F7F4ED_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-16">
            <span className="flex items-center justify-center w-10 h-10 bg-[#E69A52] text-[#123B3B] font-bold rounded">D</span>
            <span className="ml-3 text-2xl font-bold tracking-widest">devcampus.</span>
          </div>
          <div className="mb-4 text-sm font-semibold tracking-widest text-[#E69A52] uppercase">Join The Community</div>
          <h1 className="mb-6 text-7xl font-bold leading-tight">
            Start building <br /><span className="text-[#E69A52] italic font-medium">your legacy.</span>
          </h1>
          <p className="max-w-md text-lg text-gray-300">Create an account to showcase your projects, collaborate with peers, and accelerate your development journey.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center w-full p-8 lg:w-1/2 lg:p-24 text-[#123B3B] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Developer Portal</span>
          <Link to="/login" className="text-sm font-semibold hover:text-[#E69A52] transition-colors">Sign in instead ↗</Link>
        </div>

        <h2 className="mb-2 text-5xl font-bold">Create <span className="italic font-normal text-gray-600">account.</span></h2>
        <p className="mb-8 text-gray-500">Enter your details to get started with DevCampus.</p>

        {error && <p className="p-3 mb-6 text-sm text-red-600 bg-red-100 rounded">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-bold">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B]" placeholder="Satish Kumar" required />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-bold">Account Type</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B] cursor-pointer">
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          
          {/* Agar user Student select karta hai, tabhi Course aur Enrollment dikhega */}
          {role === 'STUDENT' && (
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-bold">Course</label>
                <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} className="w-full p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B]" placeholder="e.g., BCA" required />
              </div>
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-bold">Enrollment No.</label>
                <input type="text" value={enrollment} onChange={(e) => setEnrollment(e.target.value)} className="w-full p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B]" placeholder="e.g., SU2026..." required />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-bold">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B]" placeholder="user@example.com" required />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-bold">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B]" placeholder="Create a strong password" required />
          </div>
          
          <button type="submit" className="w-full p-4 mt-2 font-bold text-white transition-colors rounded bg-[#123B3B] hover:bg-[#0c2929]">
            Register your account →
          </button>
        </form>
      </div>
    </div>
  );
}