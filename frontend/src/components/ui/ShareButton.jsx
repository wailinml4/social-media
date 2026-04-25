import React from 'react';
import { Share2 } from 'lucide-react';

const ShareButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="flex items-center gap-2 group transition-colors hover:text-green-400">
      <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
        <Share2 className="w-5 h-5" />
      </div>
    </button>
  );
};

export default ShareButton;
