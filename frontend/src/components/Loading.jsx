import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Processing...', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-7 h-7',
    large: 'w-10 h-10',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.default} animate-spin text-agri-600`} />
      {message && <p className="text-xs sm:text-sm font-medium text-earth-muted">{message}</p>}
    </div>
  );
};

export default Loading;
