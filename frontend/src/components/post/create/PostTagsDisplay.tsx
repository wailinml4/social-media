import React from 'react'

interface PostTagsDisplayProps {
  taggedUsers: string
  location: string
}

const PostTagsDisplay = ({ taggedUsers, location }: PostTagsDisplayProps) => {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/38">
      {taggedUsers.trim() && <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/70">With {taggedUsers.trim()}</span>}
      {location.trim() && <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/70">At {location.trim()}</span>}
    </div>
  )
}

export default PostTagsDisplay
