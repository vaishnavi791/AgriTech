import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ScanLine, 
  Calendar 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { PRIORITY_FEATURES } from '../utils/constants';
import FeatureCard from '../components/FeatureCard';

export const Welcome = () => {
  const { user } = useAuth();
  const userName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'Farmer';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-agri-900 border border-agri-800 rounded-xl p-6 sm:p-10 text-cream-100 shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-sage-300">
            <Calendar className="w-4 h-4" />
            <span>{today}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-cream-50 tracking-tight">
            Welcome back, <span className="text-sage-300">{userName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
            Here is your agriculture intelligence dashboard. Choose an advisory tool below to evaluate soil nutrients, diagnose leaf diseases, or forecast mandi prices.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/crop-recommendation"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-agri-600 hover:bg-agri-700 text-cream-50 text-xs sm:text-sm font-semibold rounded-lg shadow-card transition"
            >
              <Sprout className="w-4 h-4" />
              <span>Recommend Crop</span>
            </Link>
            <Link
              to="/disease-detection"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-agri-800 hover:bg-agri-700 text-cream-100 border border-agri-700 text-xs sm:text-sm font-semibold rounded-lg transition"
            >
              <ScanLine className="w-4 h-4" />
              <span>Detect Disease</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Features Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-earth-dark">Agricultural Decision Suite</h2>
          <p className="text-xs sm:text-sm text-earth-muted">Access your five core advisory tools powered by machine learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRIORITY_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
