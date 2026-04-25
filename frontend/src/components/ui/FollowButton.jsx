import React from 'react';
import { UserPlus, UserMinus } from 'lucide-react';

const FollowButton = ({ isFollowing, isLoading, onFollow, variant = 'primary', size = 'sm' }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  return (
    <button
      onClick={onFollow}
      disabled={isLoading}
      className={`flex-shrink-0 rounded-full font-medium transition-all duration-200 ${sizeClasses[size]} ${
        isFollowing
          ? 'bg-white/5 text-white/60 hover:bg-white/10'
          : variant === 'primary'
          ? 'bg-primary text-white hover:bg-primary/90'
          : variant === 'default'
          ? 'bg-white text-black hover:bg-gray-200'
          : 'bg-white text-black hover:bg-white/90'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        '...'
      ) : isFollowing ? (
        <>
          <UserMinus className={`inline ${iconSizes[size]} mr-1`} />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className={`inline ${iconSizes[size]} mr-1`} />
          Follow
        </>
      )}
    </button>
  );
};

export default FollowButton;
