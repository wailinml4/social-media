import React from 'react';
import { ImagePlus, MapPin, SmilePlus } from 'lucide-react';

const PostFooterActions = ({ 
  onMediaClick, 
  onEmojiClick, 
  onLocationClick, 
  onPostClick, 
  hasPostContent,
  isPosting = false
}) => {
  return (
    <div className="relative border-t border-white/5 bg-bg-dark px-4 py-3 sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white/45">
          <button
            type="button"
            onClick={onMediaClick}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/5 hover:text-white"
            aria-label="Upload media"
          >
            <ImagePlus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onEmojiClick}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/5 hover:text-white"
            aria-label="Toggle emoji picker"
          >
            <SmilePlus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onLocationClick}
            className="hidden h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/5 hover:text-white sm:flex"
            aria-label="Add location"
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onPostClick}
          disabled={!hasPostContent || isPosting}
          className={`inline-flex min-w-[92px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
            hasPostContent
              ? 'bg-white text-black hover:bg-white/92'
              : 'bg-white/8 text-white/28'
          } ${isPosting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default PostFooterActions;
