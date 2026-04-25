import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Edit3, Trash2 } from 'lucide-react';
import LikeButton from '../../ui/LikeButton';
import BookmarkButton from '../../ui/BookmarkButton';
import CommentButton from '../../ui/CommentButton';
import ShareButton from '../../ui/ShareButton';
import Dropdown from '../../ui/Dropdown';

const PostActions = ({
  postId,
  isOwnPost,
  likesCount,
  commentsCount,
  liked,
  saved,
  isLiking,
  isBookmarking,
  onLike,
  onBookmark,
  onDelete,
  onEdit,
  showComments = true,
  showShare = true,
  variant = 'card',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowDropdown(false);
    }
  };

  const handleEdit = () => {
    onEdit();
    setShowDropdown(false);
  };

  const isCard = variant === 'card';

  return (
    <div className="flex items-center justify-between text-text-dim mt-4">
      <div className="flex items-center gap-6">
        {showComments && (
          <div className="flex-1 flex justify-center">
            <CommentButton count={commentsCount} />
          </div>
        )}

        <div className="flex-1 flex justify-center">
          <LikeButton
            liked={liked}
            likesCount={likesCount}
            isLiking={isLiking}
            onLike={onLike}
          />
        </div>

        {showShare && (
          <div className="flex-1 flex justify-center">
            <ShareButton />
          </div>
        )}

        <div className="flex-1 flex justify-center">
          <BookmarkButton
            saved={saved}
            isBookmarking={isBookmarking}
            onBookmark={onBookmark}
          />
        </div>
      </div>

      {isOwnPost && (
        <Dropdown
          isOpen={showDropdown}
          onToggle={(open) => setShowDropdown(open)}
          trigger={
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`p-2 hover:bg-white/5 rounded-full transition-colors ${isCard ? 'text-text-dim' : 'hidden md:block'}`}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          }
        >
          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/5 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </Dropdown>
      )}
    </div>
  );
};

export default PostActions;
