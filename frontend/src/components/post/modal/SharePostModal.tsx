import React, { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { X, Search, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useModal } from '../../../context/ModalContext.jsx'
import { useConversations } from '../../../context/ConversationContext.jsx'
import { useMessages } from '../../../context/MessageContext.jsx'
import { useAuth } from '../../../context/AuthContext.jsx'
import { usePosts } from '../../../context/PostContext.jsx'
import { searchUsers } from '../../../services/userService.js'
import type { User } from '../../../types/index.js'
import defaultAvatar from '../../../assets/default-avatar.svg'

const SharePostModal = () => {
  const { isShareModalOpen, sharedPost, closeShareModal } = useModal()
  const { createNewConversation } = useConversations()
  const { sendMessage } = useMessages()
  const { user } = useAuth()
  const { patchPostState } = usePosts()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isShareModalOpen) {
      setTimeout(() => setQuery(''), 0)
      setTimeout(() => setResults([]), 0)
      setTimeout(() => setError(null), 0)
      setTimeout(() => setIsSearching(false), 0)
      return
    }

    inputRef.current?.focus()
  }, [isShareModalOpen])

  useEffect(() => {
    if (!query.trim()) {
      setTimeout(() => setResults([]), 0)
      setTimeout(() => setError(null), 0)
      setTimeout(() => setIsSearching(false), 0)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true)
        setError(null)
        const data = await searchUsers({ query: query.trim(), limit: 8 })
        const users = data.users || []
        setResults(users)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Unable to search users')
        toast.error('Unable to search users')
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const buildSharedMessage = (post: {
    _id?: string
    author?: { fullName?: string; email?: string; handle?: string; profilePicture?: string }
    name?: string
    description?: string
    content?: string
    media?: { url?: string }[]
    images?: string[]
  }) => {
    const authorName = post?.author?.fullName || post?.name || 'Unknown author'
    const authorHandle = post?.author?.email?.split('@')[0] || post?.author?.handle || 'unknown'
    const excerpt = post?.description ? post.description.slice(0, 120) : post?.content ? post.content.slice(0, 120) : ''
    const mediaUrl = post?.media?.[0]?.url || post?.images?.[0] || ''

    return {
      postId: post?._id,
      authorName,
      authorHandle,
      authorAvatar: post?.author?.profilePicture || '',
      excerpt,
      mediaUrl,
    }
  }

  const handleShareToConversation = async (conversation: { id?: string; _id?: string }) => {
    if (!sharedPost || !conversation) return

    try {
      setIsSharing(true)
      const conversationId = conversation.id || conversation._id
      if (!conversationId) {
        throw new Error('Invalid conversation ID')
      }
      const messageText = `Shared a post from ${sharedPost.author?.fullName || sharedPost.author?.name || 'someone'}`
      const sharedPostPayload = buildSharedMessage(sharedPost)
      await sendMessage(conversationId, messageText, [], sharedPostPayload)
      const postId = sharedPost?._id || sharedPost?.id || sharedPost?.postId
      if (postId) {
        const newShareCount = (sharedPost?.shareCount || 0) + 1
        patchPostState(postId, { shareCount: newShareCount })
      }
      toast.success('Post shared successfully')
      closeShareModal()
    } catch (err) {
      console.error('Share failed:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to share post')
    } finally {
      setIsSharing(false)
    }
  }

  const handleUserClick = async (userResult: User) => {
    if (!userResult) return
    if (userResult._id === user?._id) {
      toast.error('Select someone else to share with')
      return
    }

    try {
      setIsSharing(true)
      const conversation = await createNewConversation([userResult._id])
      await handleShareToConversation(conversation)
    } catch (err) {
      console.error('Unable to create conversation:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to create conversation')
    } finally {
      setIsSharing(false)
    }
  }

  // conversationOptions intentionally omitted for now

  if (!isShareModalOpen) return null

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" onClick={closeShareModal} />
      <div
        className="relative w-full max-w-2xl overflow-hidden spatial-panel shadow-2xl"
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Share post in chat</h2>
            <p className="text-sm text-white/60">Select a conversation or find someone to share with.</p>
          </div>
          <button
            type="button"
            onClick={closeShareModal}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition-all duration-200 hover:bg-white/5 hover:text-white"
            aria-label="Close share modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-white/10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-2xl bg-white/10">
                {sharedPost?.media?.[0]?.url || sharedPost?.images?.[0] ? (
                  <img
                    src={sharedPost?.media?.[0]?.url || sharedPost?.images?.[0]}
                    alt="Post preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/50">Preview</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{sharedPost?.author?.fullName || 'Unknown author'}</p>
                <p className="truncate text-sm text-white/60">
                  @{sharedPost?.author?.email?.split('@')[0] || sharedPost?.author?.handle || 'unknown'}
                </p>
              </div>
            </div>
            {(sharedPost?.description || sharedPost?.content) && (
              <p className="mt-3 text-sm leading-relaxed text-white/70 max-h-16 overflow-hidden">
                {sharedPost.description || sharedPost.content}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search people to share with"
              className="w-full rounded-full border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/[0.08] focus:outline-none transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            />
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-5 pb-5">
          {query.trim() ? (
            isSearching ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">Searching...</div>
            ) : error ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-red-400">{error}</div>
            ) : results.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">No users found.</div>
            ) : (
              <div className="space-y-2">
                {results.map(userResult => (
                  <button
                    type="button"
                    key={userResult._id}
                    onClick={() => handleUserClick(userResult)}
                    disabled={isSharing}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left transition-all duration-200 hover:bg-white/10 hover:border-white/10 disabled:cursor-not-allowed disabled:opacity-60 group shadow-sm"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                      <img
                        src={userResult.profilePicture || defaultAvatar}
                        alt={userResult.fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{userResult.fullName}</p>
                      <p className="truncate text-sm text-white/50">@{userResult.email?.split('@')[0]}</p>
                    </div>
                    <Send className="w-4 h-4 text-white/70" />
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
              Start typing to search people to share with.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SharePostModal
