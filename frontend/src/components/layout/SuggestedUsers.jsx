import React from 'react';

import Button from '../ui/Button';
import Card from '../ui/Card';

import { suggestedUsers } from '../../data/trending';

const SuggestedUser = ({ name, handle, avatar }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3 min-w-0">
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="cursor-pointer truncate text-sm font-semibold text-white hover:underline">{name}</div>
        <div className="truncate text-sm text-text-dim">@{handle}</div>
      </div>
    </div>
    <Button size="sm" className="ml-2 bg-white text-black hover:bg-gray-200">
      Follow
    </Button>
  </div>
);

const SuggestedUsers = () => {
  return (
    <Card className="trending-sidebar-card mb-4 overflow-hidden border-white/10 bg-white/[0.04] shadow-none">
      <div className="px-5 pb-2 pt-5">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">Who to follow</h3>
      </div>

      <div className="px-5">
        {suggestedUsers.map((user, index) => (
          <div key={index} className={index !== suggestedUsers.length - 1 ? 'border-b border-white/10' : ''}>
            <SuggestedUser {...user} />
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-5 py-3 text-sm text-white/64 transition-colors hover:bg-white/[0.03] hover:text-white">
        Show more
      </div>
    </Card>
  );
};

export default SuggestedUsers;
