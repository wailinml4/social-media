import React from 'react'
import type { MouseEvent } from 'react'
import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  onClick?: (e: MouseEvent) => void
  count?: number
}

const ShareButton = ({ onClick, count = 0 }: ShareButtonProps) => {
  return (
    <button
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className="flex items-center gap-2 group transition-colors hover:text-green-400"
    >
      <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
        <Share2 className="w-5 h-5" />
      </div>
      <span className="text-sm text-white/80">{count}</span>
    </button>
  )
}

export default ShareButton
