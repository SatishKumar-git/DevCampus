import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance'; // Fixed: using axiosInstance instead of localhost fetch

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match. Please try again.');
    }

    try {
      // Fixed: Removed localhost:5000 to use relative path for production single-server setup
      const response = await api.post('/api/auth/reset-password', { email, newPassword: password });

      if (response.status === 200 || response.data) {
        setMessage('Password updated successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.error || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F4ED] font-sans">
      <div className="flex flex-col justify-center w-full max-w-md p-8 mx-auto text-[#123B3B]">
        <h2 className="mb-2 text-4xl font-bold text-center">
          New <span className="italic font-normal text-gray-600">Password.</span>
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Enter your email and set a new password below.
        </p>

        {message && <p className="p-3 mb-6 text-sm text-green-700 bg-green-100 rounded">{message}</p>}
        {error && <p className="p-3 mb-6 text-sm text-red-600 bg-red-100 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-bold">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B]" 
              placeholder="developer@example.com" 
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold">New Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B]" 
              placeholder="••••••••" 
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 bg-transparent border border-gray-300 rounded focus:outline-none focus:border-[#123B3B]" 
              placeholder="••••••••" 
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full p-4 font-bold text-white transition-colors rounded bg-[#123B3B] hover:bg-[#0c2929]"
          >
            Update Password →
          </button>
        </form>
      </div>
    </div>
  );
}