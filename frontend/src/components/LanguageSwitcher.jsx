import React from 'react';
import { Languages } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

export const LanguageSwitcher = ({ className = '', size = 'md', variant = 'light' }) => {
  const { language, setLanguage } = useLanguage();

  const isSmall = size === 'sm';
  const isGlass = variant === 'glass';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl transition-colors ${
        isGlass
          ? 'bg-black/30 backdrop-blur-md border border-white/20 shadow-sm'
          : 'bg-cream-200/80 border border-cream-300 shadow-sm'
      } ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <div className={`flex items-center pl-2 pr-1.5 ${isGlass ? 'text-white/80' : 'text-earth-muted'}`}>
        <Languages className={isSmall ? 'w-3.5 h-3.5' : `w-4 h-4 ${isGlass ? 'text-white' : 'text-agri-700'}`} />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
          language === 'en'
            ? isGlass
              ? 'bg-white text-earth-dark shadow-sm'
              : 'bg-agri-600 text-cream-50 shadow-sm'
            : isGlass
              ? 'text-white/85 hover:text-white hover:bg-white/15'
              : 'text-earth-muted hover:text-earth-dark hover:bg-cream-100'
        }`}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={language === 'hi'}
        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
          language === 'hi'
            ? isGlass
              ? 'bg-white text-earth-dark shadow-sm'
              : 'bg-agri-600 text-cream-50 shadow-sm'
            : isGlass
              ? 'text-white/85 hover:text-white hover:bg-white/15'
              : 'text-earth-muted hover:text-earth-dark hover:bg-cream-100'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
