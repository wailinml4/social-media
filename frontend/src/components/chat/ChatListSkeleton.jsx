import React from 'react';

const ChatListSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-white/10 animate-pulse">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex justify-between items-baseline mb-1">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-3 bg-white/5 rounded w-12"></div>
        </div>

        {/* Message row */}
        <div className="flex justify-between items-center">
          <div className="h-3 bg-white/5 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatListSkeleton;
