import React from 'react'
import LikeButton from '../../ui/LikeButton'
import BookmarkButton from '../../ui/BookmarkButton'
import CommentButton from '../../ui/CommentButton'
import ShareButton from '../../ui/ShareButton'

const PostActions = ({
  likesCount,
  commentsCount,
  shareCount,
  liked,
  saved,
  isLiking,
  isBookmarking,
  onLike,
  onBookmark,
  onComment,
  onShare,
  showComments = true,
  showShare = true,
}) => {
  return (
    <div className="flex w-full items-center justify-between gap-4 text-text-dim mt-4">
      <div className="flex items-center gap-4">
        {showComments && <CommentButton count={commentsCount} onClick={onComment} />}

        <LikeButton liked={liked} likesCount={likesCount} isLiking={isLiking} onLike={onLike} />

        {showShare && <ShareButton onClick={onShare} count={shareCount} />}
      </div>

      <div className="flex items-center gap-2">
        <BookmarkButton saved={saved} isBookmarking={isBookmarking} onBookmark={onBookmark} />
      </div>
    </div>
  )
}

export default PostActions
