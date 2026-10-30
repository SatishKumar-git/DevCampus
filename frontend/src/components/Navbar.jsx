import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="p-4 shadow-md bg-[#293638]">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-2xl font-bold text-[#E69A52] tracking-wide">
          DevCampus
        </Link>
        
        <div className="space-x-6 text-sm font-medium">
          {user ? (
            <>
              {/* Sirf Student ko Feed aur My Projects dikhega */}
              {user.role === 'STUDENT' && (
                <>
                  <Link to="/" className="transition-colors opacity-80 hover:opacity-100 hover:text-[#E69A52]">Feed</Link>
                  {/* Yeh link ab sahi dashboard par jayega 👇 */}
                  <Link to="/student-dashboard" className="transition-colors opacity-80 hover:opacity-100 hover:text-[#E69A52]">My Projects</Link>
                </>
              )}
              
              {/* Teacher aur Admin ko unka Dashboard link dikhega */}
              {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
                <Link to="/" className="transition-colors opacity-80 hover:opacity-100 hover:text-[#E69A52]">Dashboard</Link>
              )}

              <button 
                onClick={handleLogout} 
                className="px-5 py-2 font-bold text-[#123B3B] transition-all rounded shadow-sm bg-[#E69A52] hover:opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition-colors opacity-80 hover:opacity-100 hover:text-[#E69A52]">Login</Link>
              <Link 
                to="/register" 
                className="px-5 py-2 font-bold text-[#123B3B] transition-all rounded shadow-sm bg-[#E69A52] hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}