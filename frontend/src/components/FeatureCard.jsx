import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ScanLine, 
  Calculator, 
  TrendingUp, 
  Bot, 
  ArrowRight 
} from 'lucide-react';

const iconMap = {
  Sprout,
  ScanLine,
  Calculator,
  TrendingUp,
  Bot,
};

export const FeatureCard = ({ feature, onActionClick }) => {
  const Icon = iconMap[feature.icon] || Sprout;

  const content = (
    <div className="group relative h-full flex flex-col p-6 bg-white rounded-xl border border-cream-300 shadow-card hover:shadow-card-hover hover:border-sage-400 transition-card">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-agri-50 text-agri-600 border border-agri-200">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sage-100 text-agri-800 border border-sage-200">
          Active Tool
        </span>
      </div>

      <h3 className="font-serif text-lg font-bold text-earth-dark group-hover:text-agri-700 transition">
        {feature.title}
      </h3>

      <p className="mt-2 text-sm text-earth-muted flex-grow leading-relaxed">
        {feature.description}
      </p>

      <div className="mt-6 pt-4 border-t border-cream-200 flex items-center justify-between text-sm font-semibold text-agri-600 group-hover:text-agri-700">
        <span>Explore tool</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
      </div>
    </div>
  );

  if (feature.path.startsWith('#')) {
    return (
      <button 
        type="button"
        onClick={() => onActionClick && onActionClick(feature.id)}
        className="text-left w-full h-full focus:outline-none"
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={feature.path} className="block h-full focus:outline-none">
      {content}
    </Link>
  );
};

export default FeatureCard;
