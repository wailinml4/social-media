import React from 'react';

const NotificationSkeleton = () => {
  return (
    <div className="px-4 py-4 border-b border-white/10 animate-pulse flex gap-4 w-full">
      {/* Icon placeholder */}
      <div className="flex-shrink-0 flex justify-end min-w-[40px] pt-1">
        <div className="w-7 h-7 rounded-full bg-white/5"></div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Avatars */}
        <div className="flex gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10"></div>
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10"></div>
        </div>

        {/* Text lines */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-4 bg-white/5 rounded w-3/4"></div>
        </div>

        {/* Optional post preview */}
        <div className="h-3 bg-white/5 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
