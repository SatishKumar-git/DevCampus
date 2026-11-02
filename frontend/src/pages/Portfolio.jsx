import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Portfolio() {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwner = user && (String(user._id) === String(id) || String(user.id) === String(id));
  const isTeacher = user && user.role?.toLowerCase() === 'teacher';
  const canViewMarks = isOwner || isTeacher;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/portfolio/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPortfolioData(res.data);
      } catch (err) {
        console.error("Portfolio load error:", err);
        setError("Portfolio not found or error loading data.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchPortfolio();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Portfolio...</div>;
  if (error) return <div className="text-center mt-20 text-red-400 text-xl font-bold">{error}</div>;
  if (!portfolioData) return null;

  const { profile, projects } = portfolioData;

  return (
    <div className="container mx-auto max-w-5xl p-8 mt-10 mb-10">
      
      {/* 1. Profile Header Section (Updated with Year & Semester) */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-8 text-[#123B3B]">
        <h1 className="text-4xl font-bold mb-2">{profile?.name || 'Developer'}</h1>
        
        {/* Naya: Course, Year aur Semester display */}
        {(profile?.course || profile?.year || profile?.semester) && (
          <p className="text-lg text-[#E69A52] font-semibold mb-4">
            {profile?.course && `${profile.course}`} 
            {profile?.year && ` • ${profile.year}`} 
            {profile?.semester && ` • ${profile.semester}`}
          </p>
        )}
        
        <p className="text-gray-700 mb-6">{profile?.bio || 'No bio provided.'}</p>
        
        {profile?.skills && (
          <div className="mb-6">
            <span className="font-bold mr-2">Tech Stack:</span>
            <span className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">{profile.skills}</span>
          </div>
        )}

        <div className="flex gap-4">
          {profile?.github_link && (
            <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">GitHub</a>
          )}
          {profile?.linkedin_link && (
            <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">LinkedIn</a>
          )}
          {profile?.portfolio_link && (
            <a href={profile.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Website</a>
          )}
        </div>
      </div>

      {/* 2. Projects Section */}
      <h2 className="text-3xl font-bold text-[#E69A52] mb-6">Projects Showcase</h2>
      
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id || project._id} className="bg-[#293638] p-6 rounded-lg shadow-lg border-t-4 border-[#E69A52]">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              
              <div className="mb-4 text-sm text-[#E69A52] font-semibold">
                Tech: {project.tech_stack || project.techStack}
              </div>

              <div className="flex gap-4 mb-4">
                {(project.github_link || project.githubLink) && (
                  <a href={project.github_link || project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Repo</a>
                )}
                {(project.live_url || project.liveLink) && (
                  <a href={project.live_url || project.liveLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline text-sm">Live Demo</a>
                )}
              </div>

             {/* Marks Section */}
              {canViewMarks && (
                <div className="mt-4 p-3 bg-[#1e2729] rounded border border-gray-600">
                  <p className="text-white font-bold">
                    Marks: <span className={project.marks ? "text-green-400" : "text-yellow-400"}>
                      {/* Yahan /100 ko /10 kar diya gaya hai */}
                      {project.marks !== undefined && project.marks !== null ? `${project.marks}/10` : 'Not Graded Yet'}
                    </span>
                  </p>
                  
                  {/* Teacher wala Assign Marks button yahan se hata diya hai */}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 text-lg">No projects uploaded yet.</p>
      )}
    </div>
  );
}