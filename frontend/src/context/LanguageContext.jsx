import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../utils/translations';

export const LanguageContext = createContext(null);

const STORAGE_KEY = 'agritech_lang';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((newLang) => {
    const validLang = newLang === 'hi' ? 'hi' : 'en';
    setLanguageState(validLang);
    try {
      localStorage.setItem(STORAGE_KEY, validLang);
    } catch {
      // Ignore localStorage errors in restricted environments
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  }, [language, setLanguage]);

  /**
   * Helper function to safely extract translated strings using dot notation.
   * e.g., t('hero.titlePrimary')
   */
  const t = useCallback(
    (keyPath) => {
      if (!keyPath) return '';
      const keys = keyPath.split('.');

      // Try current language dictionary
      let current = translations[language];
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          current = undefined;
          break;
        }
      }

      if (current !== undefined && typeof current === 'string') {
        return current;
      }

      // Fallback to English dictionary
      let fallback = translations.en;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = fallback[k];
        } else {
          fallback = undefined;
          break;
        }
      }

      if (fallback !== undefined && typeof fallback === 'string') {
        return fallback;
      }

      return keyPath;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isHindi: language === 'hi',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
