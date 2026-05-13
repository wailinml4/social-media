import React from 'react'

interface SkeletonProps {
  rows?: number
  className?: string
}

const Skeleton = ({ rows = 3, className = '' }: SkeletonProps) => {
  const items = Array.from({ length: rows })
  return (
    <div aria-busy="true" className={`space-y-3 ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-white/6 w-full last:w-3/4 animate-pulse motion-reduce:animate-none"
        />
      ))}
    </div>
  )
}

export default Skeleton
