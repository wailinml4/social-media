import React from 'react'
import type { ChangeEvent } from 'react'

interface TagInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const TagInput = ({ value, onChange, placeholder = '@alex, @sam' }: TagInputProps) => {
  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-surface px-3 py-2.5">
      <input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
      />
    </div>
  )
}

export default TagInput
