import React from 'react'
import { MessageCircle } from 'lucide-react'

const CommentButton = ({ count = 0, onClick }) => {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className="flex items-center gap-2 group transition-colors hover:text-blue-400"
    >
      <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
        <MessageCircle className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium text-white/80">{count}</span>
    </button>
  )
}

export default CommentButton
