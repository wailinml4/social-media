import React from 'react'
import PostMediaCarousel from '../card/PostMediaCarousel'

const PostModalMedia = ({ post }) => {
  const mediaItems = post?.media?.length ? post.media : post?.images || []

  return (
    <div className="w-full md:flex-1 bg-black flex items-center justify-center relative overflow-hidden h-[40vh] md:h-auto">
      {mediaItems.length > 0 ? (
        <PostMediaCarousel images={mediaItems} className="w-full h-full" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-12 text-center">
          <p className="text-xl font-light text-text-dim italic">
            "{post?.description || post?.content}"
          </p>
        </div>
      )}
    </div>
  )
}

export default PostModalMedia
