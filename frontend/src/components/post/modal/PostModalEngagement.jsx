import React from 'react';
import PostActions from '../card/PostActions';

const PostModalEngagement = ({
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
}) => {
  return (
    <>
      <div className="h-px bg-white/5" />

      {/* Engagement Stats */}
      <div className="modal-detail-item flex items-center gap-5 text-[13px]">
        <div><span className="font-bold text-white">{likesCount}</span> <span className="text-text-dim">Likes</span></div>
        <div><span className="font-bold text-white">{commentsCount}</span> <span className="text-text-dim">Comments</span></div>
      </div>

      {/* Action Buttons */}
      <PostActions
        postId={postId}
        isOwnPost={isOwnPost}
        likesCount={likesCount}
        commentsCount={commentsCount}
        liked={liked}
        saved={saved}
        isLiking={isLiking}
        isBookmarking={isBookmarking}
        onLike={onLike}
        onBookmark={onBookmark}
        onDelete={onDelete}
        onEdit={onEdit}
        variant="modal"
      />
    </>
  );
};

export default PostModalEngagement;
