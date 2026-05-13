import React from 'react'
import type { ChangeEvent } from 'react'

interface InputProps {
  label?: string
  type?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  rows?: number
  disabled?: boolean
  error?: string
}

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  rows,
  disabled = false,
  error,
  ...props
}: InputProps) => {
  const baseClasses =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const inputElement =
    type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows || 3}
        disabled={disabled}
        className={`${baseClasses} resize-none ${className}`}
        {...props}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    )

  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-medium text-white/60">{label}</label>}
      {inputElement}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default Input
