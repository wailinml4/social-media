import React from 'react'
import { MoreHorizontal } from 'lucide-react'
import Card from '../ui/Card.jsx'
import { trendingTopics } from '../../data/trending.js'

interface TrendingTopicsProps {
  className?: string
}

const TrendingTopics = ({ className = '' }: TrendingTopicsProps) => {
  return (
    <Card
      className={`trending-sidebar-card mb-4 overflow-hidden border-white/10 bg-[#050505]/90 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl ${className}`}
    >
      <div className="px-5 pb-3 pt-5">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-text-dim">What&apos;s happening</h3>
      </div>

      {trendingTopics.map((topic, index) => (
        <div
          key={index}
          className={`cursor-pointer px-5 py-3 transition-colors hover:bg-white/[0.035] ${
            index !== trendingTopics.length - 1 ? 'border-b border-white/10' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="mb-1 text-[11px] uppercase tracking-[0.2em] text-white/35">{topic.category}</div>
            <button className="-mt-0.5 text-text-dim transition-colors hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm font-medium text-white">{topic.title}</div>
          <div className="mt-1 text-xs text-text-dim">{topic.posts} posts</div>
        </div>
      ))}

      <div className="border-t border-white/10 px-5 py-3 text-sm text-white/64 transition-colors hover:bg-white/[0.03] hover:text-white">
        Show more
      </div>
    </Card>
  )
}

export default TrendingTopics
