import React from 'react';
import { AtSign, ImagePlus, MapPin, SmilePlus } from 'lucide-react';

const PostActionButtons = ({ 
  onMediaClick, 
  onEmojiClick, 
  onTagClick, 
  onLocationClick, 
  locationLabel 
}) => {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onMediaClick}
        className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/75 transition-all duration-200 hover:bg-white/10 hover:text-white"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        Media
      </button>
      <button
        type="button"
        onClick={onEmojiClick}
        className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/55 transition-all duration-200 hover:bg-white/10 hover:text-white"
      >
        <SmilePlus className="h-3.5 w-3.5" />
        Emoji
      </button>
      <button
        type="button"
        onClick={onTagClick}
        className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/55 transition-all duration-200 hover:bg-white/10 hover:text-white"
      >
        <AtSign className="h-3.5 w-3.5" />
        Tag
      </button>
      <button
        type="button"
        onClick={onLocationClick}
        className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/55 transition-all duration-200 hover:bg-white/10 hover:text-white"
      >
        <MapPin className="h-3.5 w-3.5" />
        {locationLabel}
      </button>
    </div>
  );
};

export default PostActionButtons;
