import React from 'react'
import type { MouseEvent } from 'react'
import { Bookmark } from 'lucide-react'

interface BookmarkButtonProps {
  saved: boolean
  isBookmarking?: boolean
  onBookmark?: (e: MouseEvent) => void
}

const BookmarkButton = ({ saved, isBookmarking, onBookmark }: BookmarkButtonProps) => {
  return (
    <button
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
        onBookmark?.(e)
      }}
      disabled={isBookmarking}
      className={`flex items-center gap-2 group transition-colors ${saved ? 'text-primary' : 'hover:text-primary'} ${isBookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
        <Bookmark className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
      </div>
    </button>
  )
}

export default BookmarkButton
