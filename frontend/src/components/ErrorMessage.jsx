import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorMessage = ({ message, onDismiss, onRetry }) => {
  if (!message) return null;

  return (
    <div className="flex items-start justify-between p-4 my-3 bg-terracotta-50 border border-red-200 rounded-xl text-terracotta-700 shadow-card">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-terracotta-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-terracotta-700">Notice</p>
          <p className="mt-0.5 text-earth-charcoal leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-terracotta-600 underline hover:text-terracotta-700"
            >
              Try again
            </button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-terracotta-600 hover:text-terracotta-700 transition-colors p-1"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
