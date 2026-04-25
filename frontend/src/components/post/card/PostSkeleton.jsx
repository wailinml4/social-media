import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="px-4 py-5 border-b border-white/10 animate-pulse flex gap-4 w-full">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-white/5"></div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 bg-white/10 rounded w-24"></div>
          <div className="h-4 bg-white/5 rounded w-16"></div>
          <div className="h-4 bg-white/5 rounded w-8"></div>
        </div>

        {/* Text Body */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-white/10 rounded w-full"></div>
          <div className="h-3 bg-white/10 rounded w-full"></div>
          <div className="h-3 bg-white/10 rounded w-4/5"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-10 mt-6">
          <div className="w-8 h-8 rounded-full bg-white/5"></div>
          <div className="w-8 h-8 rounded-full bg-white/5"></div>
          <div className="w-8 h-8 rounded-full bg-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
