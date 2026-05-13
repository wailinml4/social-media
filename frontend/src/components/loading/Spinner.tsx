import React from 'react'
import { Loader } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  inline?: boolean
  className?: string
}

const sizeMap = {
  sm: 14,
  md: 20,
  lg: 28,
}

const Spinner = ({ size = 'md', label, inline = false, className = '' }: SpinnerProps) => {
  const px = sizeMap[size] || sizeMap.md
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
      className={`${inline ? 'inline-flex items-center' : 'flex items-center justify-center'} gap-2 ${className}`}
    >
      <Loader className="text-white/80 animate-spin" size={px} />
      {label ? <span className="text-sm text-white/70">{label}</span> : null}
    </div>
  )
}

export default Spinner
