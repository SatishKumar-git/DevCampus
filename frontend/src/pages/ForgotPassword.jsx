import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

 const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Backend ko asali request bhej rahe hain
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link email par bhej diya gaya hai.');
        setEmail(''); 
      } else {
        setError(data.error || 'Kuch gadbad ho gayi, wapas try karein.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Server se connect nahi ho paya. Kya backend chalu hai?');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F4ED] font-sans">
      <div className="flex flex-col justify-center w-full max-w-md p-8 mx-auto text-[#123B3B]">
        <div className="flex items-center justify-center mb-10">
          <span className="flex items-center justify-center w-10 h-10 bg-[#E69A52] text-[#123B3B] font-bold rounded">D</span>
          <span className="ml-3 text-2xl font-bold tracking-widest">devcampus.</span>
        </div>

        <h2 className="mb-2 text-4xl font-bold text-center">
          Reset <span className="italic font-normal text-gray-600">Password.</span>
        </h2>
        <p className="mb-8 text-center text-gray-500">
          Apna registered email address dalein aur hum aapko password reset karne ka link bhejenge.
        </p>

        {message && <p className="p-3 mb-6 text-sm text-green-700 bg-green-100 rounded">{message}</p>}
        {error && <p className="p-3 mb-6 text-sm text-red-600 bg-red-100 rounded">{error}</p>}

        <form onSubmit={handleReset} className="space-y-6">
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
          
          <button 
            type="submit" 
            className="w-full p-4 font-bold text-white transition-colors rounded bg-[#123B3B] hover:bg-[#0c2929]"
          >
            Send Reset Link →
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm font-semibold hover:text-[#E69A52] transition-colors">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}