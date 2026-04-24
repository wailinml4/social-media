import React from 'react';

const ProfileStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 mb-0 px-4 md:px-6">
      {Object.entries(stats).map(([key, value]) => (
        <div
          key={key}
          className="stat-card-anim flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/30 hover:bg-white/[0.06] transition-all cursor-pointer group shadow-lg"
        >
          <span className="text-xl font-bold text-white group-hover:text-primary transition-colors">{value}</span>
          <span className="text-[11px] uppercase tracking-wider text-text-dim font-bold">{key}</span>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
