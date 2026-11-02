import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Profile() {
  const { user } = useContext(AuthContext); 
  const [formData, setFormData] = useState({
    name: '', course: '', year: '', semester: '', bio: '', skills: '', github_link: '', linkedin_link: '', portfolio_link: ''
  });
  const [message, setMessage] = useState('');

  // Smart Role Checking Logic
  const userRole = user?.role?.toLowerCase() || '';
  const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';
  const isStudent = !isTeacherOrAdmin; // Agar teacher ya admin nahi hai, toh usko student manega

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if(res.data) {
            setFormData({
                name: res.data.name || '', 
                course: res.data.course || '', 
                year: res.data.year || '',         // Added year
                semester: res.data.semester || '', // Added semester
                bio: res.data.bio || '',
                skills: res.data.skills || '', 
                github_link: res.data.github_link || '',
                linkedin_link: res.data.linkedin_link || '', 
                portfolio_link: res.data.portfolio_link || ''
            });
        }
      } catch (error) {
        console.error("Profile load error:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:5000/api/profile', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Profile updated successfully! 🎉');
        setTimeout(() => setMessage(''), 3000);
    } catch (error) {
        console.error("Profile update error:", error);
        setMessage('Update failed. Try again.');
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-8 mt-10 mb-10">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-[#123B3B] mb-6">
          My Profile <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2 capitalize">{user?.role || 'User'}</span>
        </h2>
        
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded font-semibold">{message}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" required />
            </div>
            
            {/* Course field sirf student ko dikhega */}
            {isStudent && (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Course</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" required />
              </div>
            )}
          </div>

          {/* Year aur Semester sirf student ko dikhega */}
          {isStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Year</label>
                <select name="year" value={formData.year} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" required>
                  <option value="" disabled>Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" required>
                  <option value="" disabled>Select Semester</option>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Bio / About Me</label>
            <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" placeholder="Write something about yourself..."></textarea>
          </div>

          {/* Baaki details sirf student ko dikhengi */}
          {isStudent && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Skills / Tech Stack</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" placeholder="HTML, CSS, React, PostgreSQL..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">GitHub URL</label>
                  <input type="url" name="github_link" value={formData.github_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" placeholder="https://github.com/yourusername" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">LinkedIn URL</label>
                  <input type="url" name="linkedin_link" value={formData.linkedin_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" placeholder="https://linkedin.com/in/yourprofile" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Portfolio Website (Optional)</label>
                <input type="url" name="portfolio_link" value={formData.portfolio_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" placeholder="https://yourwebsite.com" />
              </div>
            </>
          )}

          {/* Teacher ya Admin ko sirf LinkedIn optional dikhega */}
          {isTeacherOrAdmin && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">LinkedIn URL (Optional)</label>
              <input type="url" name="linkedin_link" value={formData.linkedin_link} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:border-[#E69A52] outline-none text-black bg-white" placeholder="https://linkedin.com/in/yourprofile" />
            </div>
          )}

          <button type="submit" className="bg-[#E69A52] text-white px-6 py-3 rounded font-bold hover:bg-[#d58b43] transition w-full mt-4">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}