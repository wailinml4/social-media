import React from 'react';

import { X } from 'lucide-react';

const CreatePostHeader = ({ onClose }) => {
  return (
    <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white">Create Post</h2>
        <p className="mt-1 text-xs text-text-dim">Share a quick update.</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-white"
        aria-label="Close create post modal"
      >
        <X className="h-4.5 w-4.5" />
      </button>
    </div>
  );
};

export default CreatePostHeader;
