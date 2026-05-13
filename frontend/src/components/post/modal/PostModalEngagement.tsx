import React from 'react'
import PostActions from '../card/PostActions.jsx'

interface PostModalEngagementProps {
  postId: string
  isOwnPost: boolean
  likesCount: number
  commentsCount: number
  liked: boolean
  saved: boolean
  isLiking: boolean
  isBookmarking: boolean
  onLike: () => void
  onBookmark: () => void
  onShare: () => void
  onDelete: () => void
  onEdit: () => void
  onComment?: () => void
  shareCount?: number
}

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
  onComment,
  shareCount = 0,
  onDelete,
  onEdit,
}: PostModalEngagementProps) => {
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
        onComment={onComment || (() => {})}
        shareCount={shareCount}
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
