import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User } from '../../types/index.js'
import { searchUsers } from '../../services/userService.js'
import defaultAvatar from '../../assets/default-avatar.svg'

interface SearchBarProps {
  className?: string
}

const SearchBar = ({ className = '' }: SearchBarProps) => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setTimeout(() => {
        setResults([])
        setLoading(false)
        setError(null)
      }, 0)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await searchUsers({ query: query.trim(), limit: 6 })
        setResults(data.users || [])
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Search failed')
        toast.error('Unable to search users')
      } finally {
        setLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const memoizedResults = useMemo(() => results, [results])

  const handleSelectUser = (userId: string) => {
    setQuery('')
    setResults([])
    navigate(`/profile/${userId}`)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setError(null)
  }

  return (
    <div className={`trending-sidebar-card relative ${className}`}>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-text-dim transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          placeholder="Search users"
          className="w-full rounded-full border border-white/10 bg-white/[0.05] py-3 pl-11 pr-10 text-sm text-white placeholder:text-white/28 focus:border-primary/50 focus:bg-white/[0.08] focus:outline-none transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query.trim() !== '' && (
        <div className="mt-2 max-h-72 overflow-y-auto spatial-panel p-2 shadow-2xl">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">Searching...</div>
          ) : error ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-red-400">{error}</div>
          ) : memoizedResults.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">No users found.</div>
          ) : (
            <div className="space-y-2">
              {memoizedResults.map((user: User) => (
                <button
                  type="button"
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-3 py-3 text-left transition-all duration-200 hover:bg-white/10 hover:border-white/10 group"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                    <img src={user.profilePicture || defaultAvatar} alt={user.fullName} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
                    <p className="truncate text-sm text-white/50">@{user.email?.split('@')[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
