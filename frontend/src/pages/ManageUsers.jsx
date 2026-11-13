import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Users load karne mein error aayi hai.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Kya aap sach mein user "${name}" ko delete karna chahte hain?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMsg(`User "${name}" successfully delete ho gaya.`);
      setUsers(users.filter(user => user.id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Delete user error:", err);
      setError("User delete karne mein fail ho gaye.");
    }
  };

  // Search filter for Name or Email
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-[#123B3B]">Loading Users...</div>;

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-[#123B3B] mb-2">Manage Users</h1>
        <p className="text-gray-600 mb-6">View, search, and manage registered students and teachers.</p>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{successMsg}</div>}

        {/* 🔍 Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <input
            type="text"
            placeholder="Search by student or teacher name / email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-gray-800 bg-white focus:outline-none focus:border-[#E69A52]"
          />
        </div>

        {/* 📋 Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B3B] text-white">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Course / Details</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">Koi users nahi mile.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-800">{user.name}</td>
                    <td className="p-4 text-sm text-gray-600">{user.email}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {user.course ? (
                        <span>
                          {user.course} 
                          {user.year ? ` • ${user.year}` : ''} 
                          {user.semester ? ` • ${user.semester}` : ''}
                        </span>
                      ) : (
                        <span className="text-orange-600 font-medium">Teacher / Faculty</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {(user.created_at || user.createdAt) 
                        ? new Date(user.created_at || user.createdAt).toLocaleDateString() 
                        : 'N/A'}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
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