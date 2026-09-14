import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import AuthContext from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`w-full transition-colors ${
        isLanding
          ? 'absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/50 via-black/20 to-transparent border-b border-white/10'
          : 'sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-300 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group focus:outline-none">
            <div
              className={`p-2 rounded-xl transition duration-200 ${
                isLanding
                  ? 'bg-white/15 backdrop-blur-md border border-white/25 text-white group-hover:bg-white/25'
                  : 'bg-agri-600 text-cream-50 shadow-sm group-hover:bg-agri-700'
              }`}
            >
              <Leaf className="w-5 h-5" />
            </div>

            <span
              className={`font-serif text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
                isLanding ? 'text-white' : 'text-earth-dark'
              }`}
            >
              Agri<span className={isLanding ? 'text-sage-300' : 'text-agri-600'}>Tech</span>
            </span>
          </Link>

          {/* Navigation controls */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher
              size="sm"
              variant={isLanding ? 'glass' : 'light'}
            />

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                  isLanding
                    ? 'text-white border border-white/25 hover:bg-white/15'
                    : 'text-earth-dark border border-cream-300 hover:bg-cream-100'
                }`}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;