import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="bg-[#123B3B] text-[#F7F4ED] p-4 shadow-md">
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#E69A52]">
          DevCampus
        </Link>
        
        <div className="flex items-center gap-6 font-semibold">
          {user ? (
            <>
              <Link to="/" className="hover:text-[#E69A52] transition">Feed</Link>
              
              {/* Sirf tab hide hoga jab user strictly teacher ya admin ho */}
              {(user?.role?.toLowerCase() !== 'teacher' && user?.role?.toLowerCase() !== 'admin') && (
                <Link to="/student-dashboard" className="hover:text-[#E69A52] transition">Project</Link>
              )}
            
              
              <Link to="/profile" className="text-[#F7F4ED] hover:text-[#E69A52] transition">
                My Profile
              </Link>
              
              <button onClick={handleLogout} className="text-[#F7F4ED] hover:text-red-400 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#E69A52] transition">Login</Link>
              <Link to="/register" className="bg-[#E69A52] text-white px-4 py-2 rounded hover:bg-[#d58b43] transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}