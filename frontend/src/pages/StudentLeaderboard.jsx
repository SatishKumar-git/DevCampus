import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function StudentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSem, setFilterSem] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic for Course, Year, and Semester
  const filteredStudents = leaderboard.filter(student => {
    const matchCourse = filterCourse === '' || student.course?.toLowerCase() === filterCourse.toLowerCase();
    const matchYear = filterYear === '' || student.year === filterYear;
    const matchSem = filterSem === '' || student.semester === filterSem;
    return matchCourse && matchYear && matchSem;
  });

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-[#123B3B]">Loading Leaderboard...</div>;

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-8">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-[#123B3B] mb-2">Student Leaderboard</h1>
        <p className="text-gray-600 mb-8">Track top performing students across different courses and semesters.</p>

        {/* 🎛️ Filters Area (Course, Year, Semester) */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4">
          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)} 
            className="p-3 border border-gray-300 rounded text-gray-800 bg-white focus:outline-none focus:border-[#E69A52]"
          >
            <option value="">All Courses</option>
            <option value="BCA">BCA</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MCA">MCA</option>
          </select>

          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(e.target.value)} 
            className="p-3 border border-gray-300 rounded text-gray-800 bg-white focus:outline-none focus:border-[#E69A52]"
          >
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <select 
            value={filterSem} 
            onChange={(e) => setFilterSem(e.target.value)} 
            className="p-3 border border-gray-300 rounded text-gray-800 bg-white focus:outline-none focus:border-[#E69A52]"
          >
            <option value="">All Semesters</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
            <option value="4th Semester">4th Semester</option>
            <option value="5th Semester">5th Semester</option>
            <option value="6th Semester">6th Semester</option>
          </select>
        </div>

        {/* 📋 Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B3B] text-white">
                <th className="p-4">Rank</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Course / Year / Semester</th>
                <th className="p-4">Graded Projects</th>
                <th className="p-4">Total Score</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">No ranked students found matching these filters.</td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-[#E69A52]">#{index + 1}</td>
                    <td className="p-4 font-semibold text-gray-800">{student.name}</td>
                    <td className="p-4 text-sm text-gray-600">{student.course} • {student.year} • {student.semester}</td>
                    <td className="p-4 text-sm text-gray-600">{student.graded_projects}</td>
                    <td className="p-4 font-bold text-green-600">{student.total_marks} pts</td>
                    <td className="p-4">
                      <Link to={`/portfolio/${student.id}`} className="text-sm font-bold text-[#E69A52] hover:underline">
                        View Portfolio →
                      </Link>
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