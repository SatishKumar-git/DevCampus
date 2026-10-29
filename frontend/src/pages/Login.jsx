import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for Show/Hide
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login Error:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F4ED] font-sans">
      {/* Left Panel - Dark Teal with Amber Accents */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-16 bg-[#123B3B] text-[#F7F4ED] relative overflow-hidden">
        {/* Subtle grid pattern simulation */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#F7F4ED_1px,transparent_1px),linear-gradient(to_bottom,#F7F4ED_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-16">
            <span className="flex items-center justify-center w-10 h-10 bg-[#E69A52] text-[#123B3B] font-bold rounded">D</span>
            <span className="ml-3 text-2xl font-bold tracking-widest">devcampus.</span>
          </div>
          
          <div className="mb-4 text-sm font-semibold tracking-widest text-[#E69A52] uppercase">
            Project Showcase Platform
          </div>
          
          <h1 className="mb-6 text-7xl font-bold leading-tight">
            Your code <br />
            <span className="text-[#E69A52] italic font-medium">deserves a stage.</span>
          </h1>
          
          <p className="max-w-md text-lg text-gray-300">
            DevCampus is the ultimate platform for students and developers to upload projects, explore ideas, and build a strong portfolio.
          </p>
        </div>
      </div>

      {/* Right Panel - Warm Ivory with Form */}
      <div className="flex flex-col justify-center w-full p-8 lg:w-1/2 lg:p-24 text-[#123B3B]">
        <div className="flex justify-between items-center mb-12">
          <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Developer Portal</span>
          <Link to="/register" className="text-sm font-semibold hover:text-[#E69A52] transition-colors">
            Create account ↗
          </Link>
        </div>

        <h2 className="mb-2 text-5xl font-bold">
          Welcome <span className="italic font-normal text-gray-600">back.</span>
        </h2>
        <p className="mb-10 text-gray-500">Enter your details to access your DevCampus dashboard and manage your projects.</p>

        {error && <p className="p-3 mb-6 text-sm text-red-600 bg-red-100 rounded">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-bold">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B] transition-all" 
              placeholder="developer@example.com" 
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold">Password</label>
              <Link to="/forgot-password" className="text-sm font-semibold text-gray-500 hover:text-[#E69A52] transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pr-16 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B] focus:ring-1 focus:ring-[#123B3B] transition-all" 
                placeholder="Enter your password" 
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-sm font-bold text-gray-500 transform -translate-y-1/2 right-4 top-1/2 hover:text-[#123B3B] transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full p-4 font-bold text-white transition-colors rounded bg-[#123B3B] hover:bg-[#0c2929]"
          >
            Login to your account →
          </button>
        </form>
      </div>
    </div>
  );
}