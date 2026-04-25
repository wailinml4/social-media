import React from 'react';

const PostAuthorInfo = ({ avatar, name, handle }) => {
  return (
    <div className="flex items-start gap-3">
      <img
        src={avatar}
        alt={name}
        className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-full border border-white/10 object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{name}</span>
          <span className="text-[11px] text-text-dim">@{handle.replace('@', '')}</span>
        </div>
      </div>
    </div>
  );
};

export default PostAuthorInfo;
