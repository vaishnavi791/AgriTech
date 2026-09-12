import React from 'react';
import { Languages } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

export const LanguageSwitcher = ({ className = '', size = 'md' }) => {
  const { language, setLanguage } = useLanguage();

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-lg bg-cream-200/80 border border-cream-300 shadow-sm transition-colors ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <div className="flex items-center pl-2 pr-1.5 text-earth-muted">
        <Languages className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4 text-agri-700'} />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          language === 'en'
            ? 'bg-agri-600 text-cream-50 shadow-sm'
            : 'text-earth-muted hover:text-earth-dark hover:bg-cream-100'
        }`}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={language === 'hi'}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
          language === 'hi'
            ? 'bg-agri-600 text-cream-50 shadow-sm'
            : 'text-earth-muted hover:text-earth-dark hover:bg-cream-100'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
