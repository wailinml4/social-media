import React from 'react'
import { X } from 'lucide-react'
import Avatar from '../../ui/Avatar'
import FollowButton from '../../ui/FollowButton'

const formatRelativeTime = value => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return `${seconds}s`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`

  const weeks = Math.floor(days / 7)
  return `${weeks}w`
}

const PostModalHeader = ({
  post,
  onClose,
  isOwnPost,
  isFollowing,
  isFollowingLoading,
  onFollow,
}) => {
  const relativeTime = formatRelativeTime(post?.createdAt || post?.time)
  const authorHandle = post?.handle
    ? `@${post.handle}`
    : post?.author?.email?.split('@')[0]
      ? `@${post.author.email.split('@')[0]}`
      : ''

  return (
    <div className="p-4 border-b border-white/10 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar src={post?.avatar} alt={post?.name} name={post?.name} size="md" border />
        <div className="min-w-0">
          <span className="font-bold text-white text-sm hover:underline cursor-pointer truncate block max-w-[160px]">
            {post?.name}
          </span>
          <p className="text-text-dim text-xs truncate max-w-[180px]">
            {authorHandle}
            {relativeTime ? (
              <>
                <span className="text-white/30 mx-1">·</span>
                <span>{relativeTime}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isOwnPost && (
          <FollowButton
            isFollowing={isFollowing}
            isLoading={isFollowingLoading}
            onFollow={onFollow}
            variant="primary"
          />
        )}
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors hidden md:inline-flex"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

export default PostModalHeader
