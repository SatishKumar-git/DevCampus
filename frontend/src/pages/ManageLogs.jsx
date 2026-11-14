import { useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // Fixed: using axiosInstance instead of localhost axios

export default function ManageLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fixed: Removed localhost:5000 to use relative path for production single-server setup
      const res = await api.get('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both array or object response formats safely
      const logData = Array.isArray(res.data) ? res.data : (res.data.logs || []);
      setLogs(logData);
    } catch (err) {
      console.error("Fetch logs error:", err);
      setError("System logs load karne mein error aayi hai.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-[#123B3B]">Loading Logs...</div>;

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-[#123B3B] mb-2">System Logs</h1>
        <p className="text-gray-600 mb-6">Monitor recent platform activities and security events.</p>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        {/* 📋 Logs Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B3B] text-white">
                <th className="p-4">Action</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Details</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">Koi logs available nahi hain.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id || Math.random()} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-800">{log.action}</td>
                    <td className="p-4 text-sm text-gray-600">{log.performed_by || log.user_email || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-600">{log.details || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {log.created_at || log.timestamp 
                        ? new Date(log.created_at || log.timestamp).toLocaleString() 
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}