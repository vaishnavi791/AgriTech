import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export const PredictionCard = ({
  title,
  subtitle,
  badgeText = 'AI Result',
  confidence,
  children,
  onReset,
  resetLabel = 'Run New Analysis',
}) => {
  return (
    <div className="bg-white rounded-xl border border-cream-300 shadow-card overflow-hidden">
      {/* Header Banner - Solid Earthy Green without harsh gradients */}
      <div className="bg-agri-700 px-6 py-4.5 text-cream-50 flex flex-wrap items-center justify-between gap-3 border-b border-agri-800">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-sage-300" />
            <h3 className="font-serif text-lg font-bold text-cream-50">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-sage-100 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-2">
          {confidence !== undefined && confidence !== null && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-agri-800/80 text-cream-100 border border-agri-600/60">
              {typeof confidence === 'number' ? `${(confidence > 1 ? confidence : confidence * 100).toFixed(1)}% Match` : confidence}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sage-200 text-agri-900 border border-sage-300">
            {badgeText}
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 space-y-6">{children}</div>

      {/* Footer / Reset Action */}
      {onReset && (
        <div className="px-6 py-3.5 bg-cream-50 border-t border-cream-300 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-earth-charcoal hover:text-agri-700 hover:bg-cream-200/80 border border-cream-300 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{resetLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
