import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="flex justify-center w-full min-h-screen pb-20 sm:pb-0">
      <div className="w-full max-w-[600px] border-r border-white/10 min-h-screen relative flex flex-col bg-bg-dark">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-white/5 animate-pulse" />

        {/* Profile Info */}
        <div className="px-4 md:px-6 -mt-16 md:-mt-20 relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#050505] bg-white/5 animate-pulse" />
            <div className="h-10 w-24 bg-white/5 rounded-full animate-pulse mb-2" />
          </div>

          <div className="mb-6 space-y-3">
            <div className="h-8 bg-white/10 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-4/5 animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-white/5 rounded w-20 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8 px-4 md:px-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-8 mb-2" />
              <div className="h-3 bg-white/5 rounded w-12" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-6 mb-6">
          <div className="flex gap-6 border-b border-white/10 pb-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-white/5 rounded w-16 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 px-4 pb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
