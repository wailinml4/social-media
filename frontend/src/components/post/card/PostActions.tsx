import React from 'react'
import LikeButton from '../../ui/LikeButton.jsx'
import BookmarkButton from '../../ui/BookmarkButton.jsx'
import CommentButton from '../../ui/CommentButton.jsx'
import ShareButton from '../../ui/ShareButton.jsx'

interface PostActionsProps {
  likesCount: number
  commentsCount: number
  shareCount: number
  liked: boolean
  saved: boolean
  isLiking: boolean
  isBookmarking: boolean
  onLike: () => void
  onBookmark: () => void
  onComment: () => void
  onShare: () => void
  showComments?: boolean
  showShare?: boolean
  postId?: string
  isOwnPost?: boolean
  onDelete?: () => void
  onEdit?: () => void
  variant?: string
}

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
}: PostActionsProps) => {
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
