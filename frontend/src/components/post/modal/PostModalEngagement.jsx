import React from 'react'
import PostActions from '../card/PostActions'

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
  onShare,
  onDelete,
  onEdit,
}) => {
  return (
    <>
      <div className="h-px bg-white/5" />

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
        onShare={onShare}
        onDelete={onDelete}
        onEdit={onEdit}
        variant="modal"
      />
    </>
  )
}

export default PostModalEngagement
