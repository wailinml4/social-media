import React from 'react'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`bg-surface border border-white/10 backdrop-blur-md rounded-2xl transition-all duration-300 ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card
