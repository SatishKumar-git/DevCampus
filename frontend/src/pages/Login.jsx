import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Apne backend ke exact login route path yahan likhein (e.g., /api/auth/login)
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">DevCampus Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="w-full p-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}