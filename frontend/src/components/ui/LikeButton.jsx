import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useLikeAnimation } from '../../animations/useLikeAnimation';

const LikeButton = ({ liked, likesCount, isLiking, onLike, iconRef }) => {
  const animateLike = iconRef ? useLikeAnimation(iconRef, liked) : null;

  useEffect(() => {
    if (liked && animateLike) {
      animateLike();
    }
  }, [liked, animateLike]);

  return (
    <button
      onClick={onLike}
      disabled={isLiking}
      className={`flex items-center group transition-colors ${liked ? 'text-pink-500' : 'hover:text-pink-500'} ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors relative">
        <Heart
          ref={iconRef}
          className="w-5 h-5"
          fill={liked ? "currentColor" : "none"}
        />
      </div>
    </button>
  );
};

export default LikeButton;
