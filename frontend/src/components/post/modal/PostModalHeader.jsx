import React from 'react';
import { X } from 'lucide-react';
import Avatar from '../../ui/Avatar';
import FollowButton from '../../ui/FollowButton';

const PostModalHeader = ({ post, onClose, isOwnPost, isFollowing, isFollowingLoading, onFollow }) => {
  return (
    <div className="p-4 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar
          src={post?.avatar}
          alt={post?.name}
          name={post?.name}
          size="md"
          border
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm hover:underline cursor-pointer truncate max-w-[120px]">{post?.name}</span>
            {!isOwnPost && (
              <FollowButton
                isFollowing={isFollowing}
                isLoading={isFollowingLoading}
                onFollow={onFollow}
                variant="primary"
              />
            )}
          </div>
          <p className="text-text-dim text-xs truncate">{post?.handle}</p>
        </div>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors hidden md:block">
        <X className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
};

export default PostModalHeader;
