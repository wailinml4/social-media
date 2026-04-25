import React from 'react';
import { MessageCircle } from 'lucide-react';

const CommentButton = ({ count, onClick }) => {
  return (
    <button onClick={onClick} className="flex items-center group transition-colors hover:text-blue-400">
      <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
        <MessageCircle className="w-5 h-5" />
      </div>
    </button>
  );
};

export default CommentButton;
