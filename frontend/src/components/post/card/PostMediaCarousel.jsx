import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PostMediaCarousel = ({ images, className = '', onDoubleClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const mediaItems = images
    ?.map(item => {
      if (!item) return null
      if (typeof item === 'string') {
        return {
          url: item,
          type: /\.(mp4|webm|ogg|mov)$/i.test(item) ? 'video' : 'image',
        }
      }

      return {
        url: item.url,
        type: item.type || (/\.(mp4|webm|ogg|mov)$/i.test(item.url) ? 'video' : 'image'),
        altText: item.altText || '',
      }
    })
    .filter(Boolean)

  if (!mediaItems || mediaItems.length === 0) return null

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : 0))
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev < mediaItems.length - 1 ? prev + 1 : mediaItems.length - 1))
  }

  const currentItem = mediaItems[currentIndex]
  const isVideo = currentItem.type === 'video'

  return (
    <div
      className={`relative overflow-hidden max-h-[600px] ${className}`}
      onDoubleClick={onDoubleClick}
    >
      {isVideo ? (
        <video src={currentItem.url} controls className="w-full h-full object-cover" />
      ) : (
        <img
          src={currentItem.url}
          alt={currentItem.altText || 'Post media'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      )}

      {mediaItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-1 rounded-full text-white text-xs">
            {currentIndex + 1} / {mediaItems.length}
          </div>
        </>
      )}
    </div>
  )
}

export default PostMediaCarousel
