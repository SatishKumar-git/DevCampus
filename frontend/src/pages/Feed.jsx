import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const { user } = useContext(AuthContext);
  const [feedProjects, setFeedProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const token = localStorage.getItem('token') || (user && user.token);
        if (!token) {
          setError("Projects dekhne ke liye login karna zaroori hai.");
          return;
        }

        // Tumhare routes ke hisaab se 'getAllProjects' ka route '/' hai
        const response = await fetch('http://localhost:5000/api/projects/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        
        if (response.ok) {
          setFeedProjects(data);
        } else {
          setError(data.error || "Projects load nahi ho paye.");
        }
      } catch (err) {
        console.error("Feed fetch error:", err);
        setError("Server se connect nahi ho paya!");
      }
    };

    fetchAllProjects();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F7F4ED] p-8">
      <div className="container mx-auto max-w-6xl">
        
        <div className="mb-8 border-b-2 border-gray-200 pb-4">
          <h1 className="text-4xl font-bold text-[#123B3B]">
            DevCampus <span className="italic text-gray-500 font-light">Feed.</span>
          </h1>
          <p className="text-gray-500 mt-2">Discover what other students are building.</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        {feedProjects.length === 0 && !error ? (
          <div className="bg-white p-12 rounded shadow-sm border border-gray-200 text-center border-dashed">
            <p className="text-gray-500">Abhi tak kisi aur student ne project upload nahi kiya hai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedProjects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between hover:shadow-lg transition">
                
                <div>
                  <h3 className="text-xl font-bold text-[#123B3B] mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                  <div className="text-sm font-semibold text-[#E69A52] mb-4">{project.tech_stack}</div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Database JOIN se aane wala student ka naam aur course */}
                  <div className="mb-3 bg-gray-50 p-2 rounded">
                    <p className="text-sm font-bold text-gray-800">🧑‍🎓 {project.student_name}</p>
                    <p className="text-xs text-gray-500">📚 {project.student_course}</p>
                  </div>

                  <div className="flex space-x-4">
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold">GitHub</a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline font-semibold">Live URL</a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}