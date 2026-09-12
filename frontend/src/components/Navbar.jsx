import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

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

          {/* The ONLY navigation control: English / हिंदी language switch */}
          <div className="flex items-center">
            <LanguageSwitcher size="sm" variant={isLanding ? 'glass' : 'light'} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
