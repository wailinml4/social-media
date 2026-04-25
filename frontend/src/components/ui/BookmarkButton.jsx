import React from 'react';
import { Bookmark } from 'lucide-react';

const BookmarkButton = ({ saved, isBookmarking, onBookmark }) => {
  return (
    <button
      onClick={onBookmark}
      disabled={isBookmarking}
      className={`flex items-center gap-2 group transition-colors ${saved ? 'text-primary' : 'hover:text-primary'} ${isBookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
        <Bookmark className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
      </div>
    </button>
  );
};

export default BookmarkButton;
