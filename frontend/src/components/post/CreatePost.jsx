import React, { useState } from 'react';

import { BarChart2, Film, Image, Smile } from 'lucide-react';

import Button from '../ui/Button';

import { profileData } from '../../data/profile';

const CreatePost = ({ onPost, className = 'hidden sm:flex' }) => {
  const [text, setText] = useState('');

  const handlePost = () => {
    if (!text.trim()) return;
    if (onPost) onPost(text);
    setText('');
  };

  return (
    <div className={`${className} px-4 py-4 border-b border-white/10 gap-4`}>
      <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
        <img src={profileData.user.avatar} alt="User" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 pt-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is happening?!"
          className="w-full bg-transparent text-xl focus:outline-none placeholder-gray-500 mb-4 text-white resize-none min-h-[50px]"
          rows={1}
        />
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <div className="flex gap-1 text-primary">
            <button className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors" title="Image">
              <Image className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors" title="Video">
              <Film className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors" title="Poll">
              <BarChart2 className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors" title="Emoji">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={handlePost}
            disabled={!text.trim()}
            className="px-6 shadow-[0_0_15px_rgba(10,132,255,0.2)]"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
