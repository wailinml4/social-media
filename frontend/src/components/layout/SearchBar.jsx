import React from 'react';

import { Search } from 'lucide-react';

const SearchBar = ({ className = '' }) => {
  return (
    <div className={`trending-sidebar-card group relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-dim transition-colors group-focus-within:text-white/70">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        placeholder="Search Nexus"
        className="w-full rounded-full border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.08] focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
