import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Component load hote hi projects fetch karna
  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      // LocalStorage se login token nikalna
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login'); // Agar token nahi hai toh login pe bhej do
        return;
      }

      const response = await fetch('http://localhost:5000/api/projects/my-projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      } else {
        setError(data.error || 'Projects load nahi ho paye.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Server se connect nahi ho paya.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] font-sans text-[#123B3B]">
     
      {/* Main Dashboard Content */}
      <main className="max-w-6xl p-8 mx-auto mt-8">
        <h1 className="mb-2 text-3xl font-bold">My <span className="italic font-normal text-gray-600">Projects.</span></h1>
        <p className="mb-8 text-gray-500">Yahan aapke sabhi uploaded projects dikhenge.</p>

        {error && <p className="p-4 mb-6 text-red-600 bg-red-100 rounded">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-500 mt-14">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-200 rounded-lg border-dashed">
            <p className="text-gray-500">Aapne abhi tak koi project upload nahi kiya hai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* API se aaye projects ko map karna */}
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col p-6 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
                <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">{project.description}</p>
                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#E69A52] bg-orange-50 px-2 py-1 rounded">
                    {project.tech_stack}
                  </span>
                </div>
                <div className="flex gap-4 mt-auto">
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noreferrer" className="text-sm font-semibold hover:underline">
                      GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#E69A52] hover:underline">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}