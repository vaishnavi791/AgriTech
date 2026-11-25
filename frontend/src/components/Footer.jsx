import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-agri-950 text-cream-200 border-t border-agri-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-agri-700 rounded-md text-cream-50 border border-agri-600">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold text-cream-50">AgriTech</span>
            </div>
            <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xs font-semibold text-sage-300 uppercase tracking-wider">{t('footer.features')}</h3>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-cream-300">
              <li>
                <Link to="/crop-recommendation" className="hover:text-cream-50 transition">
                  {t('footer.crop')}
                </Link>
              </li>
              <li>
                <Link to="/disease-detection" className="hover:text-cream-50 transition">
                  {t('footer.disease')}
                </Link>
              </li>
              <li>
                <Link to="/cost-estimation" className="hover:text-cream-50 transition">
                  {t('footer.cost')}
                </Link>
              </li>
              <li>
                <Link to="/price-forecasting" className="hover:text-cream-50 transition">
                  {t('footer.price')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-serif text-xs font-semibold text-sage-300 uppercase tracking-wider">{t('footer.platform')}</h3>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-cream-300">
              <li>{t('footer.react')}</li>
              <li>{t('footer.fastapi')}</li>
              <li>{t('footer.ml')}</li>
              <li>{t('footer.jwt')}</li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h3 className="font-serif text-xs font-semibold text-sage-300 uppercase tracking-wider">{t('footer.support')}</h3>
            <p className="mt-4 text-xs sm:text-sm text-cream-300 leading-relaxed">
              {t('footer.supportDescription')}
            </p>
            <div className="mt-4 text-xs text-cream-400">
              AgriTech Platform &copy; {new Date().getFullYear()}. All rights reserved.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-agri-900 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400">
          <p>{t('footer.community')}</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Rooted in sustainable agriculture.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
