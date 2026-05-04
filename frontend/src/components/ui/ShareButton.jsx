import React from 'react'
import { Share2 } from 'lucide-react'

const ShareButton = ({ onClick, count = 0 }) => {
  return (
    <button
      onClick={e => {
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
