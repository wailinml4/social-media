import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../../ui/Avatar'

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

const PostAuthor = ({ author, time, onTimeClick, showDropdown = false, dropdownContent }) => {
  const authorName = author?.fullName || author?.name
  const authorHandle = author?.email?.split('@')[0] || author?.handle
  const authorId = author?._id || author?.authorId
  const relativeTime = formatRelativeTime(time)

  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          src={author.profilePicture || author.avatar}
          alt={authorName}
          name={authorName}
          size="md"
          to={`/profile/${authorId}`}
        />
        <div className="min-w-0">
          <Link
            to={`/profile/${authorId}`}
            className="block text-base font-semibold text-white hover:underline truncate"
          >
            {authorName}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-text-dim">
            <span className="truncate">@{authorHandle}</span>
            {relativeTime ? (
              <>
                <span className="text-white/30">·</span>
                <button type="button" onClick={onTimeClick} className="truncate hover:underline">
                  {relativeTime}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {showDropdown && dropdownContent}
    </div>
  )
}

export default PostAuthor
