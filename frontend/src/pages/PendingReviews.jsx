import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PendingReviews() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSem, setFilterSem] = useState('');
  
  // Marks State
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sirf wo projects dikhayenge jinke marks abhi assign nahi hue hain
      const pending = res.data.filter(p => p.marks === null || p.marks === undefined);
      setProjects(pending);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMarks = async (projectId) => {
    const marks = marksData[projectId];
    
    // Validation: 1 se 10 ke beech limit set kar di hai
    if (!marks || marks < 1 || marks > 10) {
      alert("Please enter valid marks between 1 and 10.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/projects/${projectId}/marks`, 
        { marks: parseInt(marks) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Marks successfully assigned! ✅");
      // Page refresh hoga aur graded project list se hat jayega
      fetchProjects();
    } catch (err) {
      console.error("Assign Marks Error:", err);
      alert("Failed to assign marks. " + (err.response?.data?.error || ""));
    }
  };

  // Filter Logic
  const filteredProjects = projects.filter(p => {
    const matchCourse = filterCourse === '' || p.student_course?.toLowerCase() === filterCourse.toLowerCase();
    const matchYear = filterYear === '' || p.student_year === filterYear;
    const matchSem = filterSem === '' || p.student_semester === filterSem;
    return matchCourse && matchYear && matchSem;
  });

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-[#123B3B]">Loading Pending Reviews...</div>;

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-[#123B3B] mb-2">Pending Reviews</h1>
        <p className="text-gray-600 mb-8">Filter by class to evaluate and grade projects.</p>

        {/* 🎛️ Teacher Filters Area */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-4">
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="p-3 border border-gray-300 rounded text-gray-800 bg-white focus:outline-none focus:border-[#E69A52]">
            <option value="">All Courses</option>
            <option value="BCA">BCA</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MCA">MCA</option>
          </select>

          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="p-3 border border-gray-300 rounded text-gray-800 bg-white focus:outline-none focus:border-[#E69A52]">
            <option value="">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <select value={filterSem} onChange={(e) => setFilterSem(e.target.value)} className="p-3 border border-gray-300 rounded text-gray-800 bg-white focus:outline-none focus:border-[#E69A52]">
            <option value="">All Semesters</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
            <option value="4th Semester">4th Semester</option>
            <option value="5th Semester">5th Semester</option>
            <option value="6th Semester">6th Semester</option>
          </select>
        </div>

        {/* 📋 Project List */}
        {filteredProjects.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 text-lg">No pending projects match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#123B3B] mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{project.student_name}</p>
                  
                  <div className="mb-4 text-xs font-bold text-[#E69A52] bg-orange-50 inline-block px-2 py-1 rounded">
                    {project.student_course} • {project.student_year} • {project.student_semester}
                  </div>

                  <div className="flex gap-4 mb-6">
                    {project.github_link && <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold">GitHub Repo</a>}
                    {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline font-semibold">Live Demo</a>}
                  </div>
                </div>

                {/* Marks Assigning Input (1 to 10 limit) */}
                <div className="flex items-center gap-3 border-t pt-4 mt-auto">
                  <input 
                    type="number" 
                    placeholder="Marks /10" 
                    min="1"
                    max="10"
                    value={marksData[project.id] || ''}
                    onChange={(e) => setMarksData({...marksData, [project.id]: e.target.value})}
                    className="border border-gray-400 rounded px-3 py-2 w-28 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#E69A52] placeholder-gray-500"
                  />
                  <button 
                    onClick={() => handleAssignMarks(project.id)}
                    className="bg-[#123B3B] hover:bg-[#0c2929] text-white text-sm font-bold px-4 py-2 rounded transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}