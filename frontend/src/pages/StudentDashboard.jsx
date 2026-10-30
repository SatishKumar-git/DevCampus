import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Yeh naya state batayega ki hum Edit kar rahe hain ya Add
  const [editProjectId, setEditProjectId] = useState(null);

  const [formData, setFormData] = useState({
    title: '', description: '', tech_stack: '', github_link: '', live_url: ''
  });

  // Database se projects laane ka function
  const fetchMyProjects = async () => {
    try {
      const token = localStorage.getItem('token') || (user && user.token);
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/projects/my-projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
        setProjects(data); 
      }
    } catch (error) {
      console.error("Server connection error:", error);
    }
  };

  useEffect(() => {
    fetchMyProjects();
    if (location.state && location.state.autoOpenForm) {
      setIsModalOpen(true);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Modal close karne ka function (sath me form clear bhi karega)
  const closeModal = () => {
    setIsModalOpen(false);
    setEditProjectId(null); // Edit mode band
    setFormData({ title: '', description: '', tech_stack: '', github_link: '', live_url: '' });
  };

  // Edit Button pe click karne ka function
  const handleEditClick = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack,
      github_link: project.github_link || '',
      live_url: project.live_url || ''
    });
    setEditProjectId(project.id); // Set kiya ki is ID ko edit karna hai
    setIsModalOpen(true); // Form open kar diya pre-filled data ke sath
  };

  // Delete Button pe click karne ka function
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Kya aap sach mein is project ko delete karna chahte hain?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token') || (user && user.token);
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert("🗑️ Project successfully delete ho gaya!");
        fetchMyProjects(); 
      } else {
        alert("Delete fail ho gaya.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server se connect nahi ho paya!");
    }
  };

  // Add aur Edit dono ko handle karega
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || (user && user.token);
      if (!token) return alert("Please login again!");

      // Agar editProjectId hai toh PUT request jayegi, nahi toh POST
      const url = editProjectId 
        ? `http://localhost:5000/api/projects/${editProjectId}` 
        : 'http://localhost:5000/api/projects';
      
      const method = editProjectId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(editProjectId ? "✏️ Project successfully update ho gaya!" : "🎉 Project successfully upload ho gaya!");
        closeModal();
        fetchMyProjects(); // List refresh
      } else {
        alert("Error: " + (data.error || "Action fail ho gaya."));
      }
    } catch (error) {
      console.error("Upload/Update error:", error);
      alert("Server se connect nahi ho paya!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4">
          <div>
            <h1 className="text-4xl font-bold text-[#123B3B]">
              My <span className="italic text-gray-500 font-light">Projects.</span>
            </h1>
            <p className="text-gray-500 mt-2">Manage all your uploaded projects here.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#E69A52] text-[#123B3B] font-bold px-6 py-3 rounded shadow hover:bg-orange-400 transition">
            + Add Project
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        {projects.length === 0 ? (
          <div className="bg-white p-12 rounded shadow-sm border border-gray-200 text-center border-dashed">
            <p className="text-gray-500">You haven't uploaded any projects yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 text-[#E69A52] font-bold hover:underline">
              Upload Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between hover:shadow-lg transition">
                <div>
                  <h3 className="text-xl font-bold text-[#123B3B] mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                  <div className="text-sm font-semibold text-[#E69A52] mb-4">{project.tech_stack}</div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="space-x-3">
                    {project.github_link && <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">GitHub</a>}
                    {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">Live</a>}
                  </div>
                  
                  {/* EDIT Aur DELETE Buttons */}
                  <div className="space-x-3">
                    <button 
                      onClick={() => handleEditClick(project)} 
                      className="text-sm text-gray-500 hover:text-blue-500 font-bold"
                    >
                      Edit ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)} 
                      className="text-sm text-gray-500 hover:text-red-500 font-bold"
                    >
                      Delete 🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
              
              {/* Heading change hogi Edit ke time pe */}
              <h2 className="text-2xl font-bold text-[#123B3B] mb-6">
                {editProjectId ? "Edit Project" : "Upload New Project"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Project Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mt-1 bg-white text-gray-900 focus:outline-none focus:border-[#E69A52] focus:ring-1 focus:ring-[#E69A52]" placeholder="e.g. Car Rental System" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full p-2 border border-gray-300 rounded mt-1 bg-white text-gray-900 focus:outline-none focus:border-[#E69A52] focus:ring-1 focus:ring-[#E69A52]" placeholder="Briefly explain your project..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">Tech Stack</label>
                  <input type="text" name="tech_stack" value={formData.tech_stack} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded mt-1 bg-white text-gray-900 focus:outline-none focus:border-[#E69A52] focus:ring-1 focus:ring-[#E69A52]" placeholder="e.g. React, Node.js, PostgreSQL" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-bold text-gray-700">GitHub Link</label>
                    <input type="url" name="github_link" value={formData.github_link} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 bg-white text-gray-900 focus:outline-none focus:border-[#E69A52] focus:ring-1 focus:ring-[#E69A52]" placeholder="https://github.com/..." />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-bold text-gray-700">Live URL (Optional)</label>
                    <input type="url" name="live_url" value={formData.live_url} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 bg-white text-gray-900 focus:outline-none focus:border-[#E69A52] focus:ring-1 focus:ring-[#E69A52]" placeholder="https://..." />
                  </div>
                </div>
                
                {/* Button ka text bhi change hoga */}
                <button type="submit" className="w-full bg-[#123B3B] text-white font-bold py-3 rounded mt-4 hover:bg-[#1a5050] transition">
                  {editProjectId ? "Update Project" : "Submit Project"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}