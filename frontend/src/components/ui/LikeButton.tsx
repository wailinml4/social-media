import React, { useEffect } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { Heart } from 'lucide-react'
import { getLikeAnimation } from '../../animations/useLikeAnimation.js'

interface LikeButtonProps {
  liked: boolean
  likesCount?: number
  isLiking?: boolean
  onLike?: (e: MouseEvent) => void
  iconRef?: RefObject<SVGSVGElement | null>
}

const LikeButton = ({ liked, likesCount = 0, isLiking, onLike, iconRef }: LikeButtonProps) => {
  useEffect(() => {
    const animate = getLikeAnimation((iconRef as RefObject<HTMLElement | null>) || null, liked)
    if (liked && animate) {
      animate()
    }
  }, [liked, iconRef])

  return (
    <button
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
        onLike?.(e)
      }}
      disabled={isLiking}
      className={`flex items-center gap-2 group transition-colors ${liked ? 'text-pink-500' : 'hover:text-pink-500'} ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors relative">
        <Heart ref={iconRef} className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
      </div>
      <span className="text-sm font-medium text-white/80">{likesCount}</span>
    </button>
  )
}

export default LikeButton
