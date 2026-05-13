import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface ValidatedInputProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'textarea'
  placeholder?: string
  registration: UseFormRegisterReturn
  error?: string
  rows?: number
  className?: string
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  type = 'text',
  placeholder,
  registration,
  error,
  rows,
  className = '',
}) => {
  const baseClassName = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20'
  const errorClassName = error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-300'
  const finalClassName = `${baseClassName} ${errorClassName} ${className}`

  if (type === 'textarea') {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea {...registration} placeholder={placeholder} rows={rows || 3} className={finalClassName} />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} {...registration} placeholder={placeholder} className={finalClassName} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default ValidatedInput
