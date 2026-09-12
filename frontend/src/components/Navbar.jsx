import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ScanLine, 
  Calculator, 
  TrendingUp, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon,
  Leaf
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useLanguage from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/crop-recommendation', label: t('nav.cropRecommend'), icon: Sprout },
    { to: '/disease-detection', label: t('nav.diseaseDetect'), icon: ScanLine },
    { to: '/cost-estimation', label: t('nav.costEstimate'), icon: Calculator },
    { to: '/price-forecasting', label: t('nav.priceForecast'), icon: TrendingUp },
  ];

  const activeClass = 'text-agri-800 bg-agri-100/70 font-semibold border-b-2 border-agri-600';
  const inactiveClass = 'text-earth-muted hover:text-agri-700 hover:bg-cream-200/60';

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-sm border-b border-cream-300 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to={isAuthenticated ? '/welcome' : '/'} className="flex items-center space-x-2.5 group">
            <div className="p-2 bg-agri-600 rounded-lg text-cream-50 shadow-card group-hover:bg-agri-700 transition">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="font-serif text-xl font-bold tracking-tight text-earth-dark">
                Agri<span className="text-agri-600">Tech</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-sage-100 text-agri-800 border border-sage-200 rounded-md">
                {t('nav.platform')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? activeClass : inactiveClass
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-agri-600" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Auth / User Controls + Language Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher size="sm" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/welcome"
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm bg-cream-200/70 hover:bg-cream-300/80 text-earth-dark border border-cream-300 transition"
                >
                  <UserIcon className="w-4 h-4 text-agri-600" />
                  <span className="font-medium max-w-[120px] truncate">
                    {user?.full_name || user?.email || 'Farmer'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-earth-muted hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-earth-dark hover:text-agri-700 transition"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-cream-50 bg-agri-600 hover:bg-agri-700 rounded-lg shadow-card hover:shadow-card-hover transition"
                >
                  {t('nav.createAccount')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher size="sm" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-earth-muted hover:text-earth-dark rounded-lg hover:bg-cream-200/70 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-300 bg-cream-50 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-agri-100/70 text-agri-800' : 'text-earth-dark hover:bg-cream-200/70'
                  }`
                }
              >
                <Icon className="w-5 h-5 text-agri-600" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-cream-300">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-earth-muted">
                  Signed in as <span className="font-semibold text-earth-dark">{user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-earth-dark bg-cream-200/70 border border-cream-300 rounded-lg font-medium hover:bg-cream-300/80"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-cream-50 bg-agri-600 rounded-lg font-medium hover:bg-agri-700 shadow-card"
                >
                  {t('nav.createAccount')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
