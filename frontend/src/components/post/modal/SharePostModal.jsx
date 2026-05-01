import React, { useEffect, useMemo, useRef, useState } from 'react'
import { X, Search, Send } from 'lucide-react'
import toast from 'react-hot-toast'

import { useModal } from '../../../context/ModalContext'
import { useConversations } from '../../../context/ConversationContext'
import { useMessages } from '../../../context/MessageContext'
import { useAuth } from '../../../context/AuthContext'
import { searchUsers } from '../../../services/userService'

const SharePostModal = () => {
  const { isShareModalOpen, sharedPost, closeShareModal } = useModal()
  const { conversations, createNewConversation } = useConversations()
  const { sendMessage } = useMessages()
  const { user } = useAuth()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [isSharing, setIsSharing] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isShareModalOpen) {
      setQuery('')
      setResults([])
      setError(null)
      setIsSearching(false)
      return
    }

    inputRef.current?.focus()
  }, [isShareModalOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      setIsSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true)
        setError(null)
        const data = await searchUsers({ query: query.trim(), limit: 8 })
        setResults(data.users || [])
      } catch (err) {
        console.error(err)
        setError(err.message || 'Unable to search users')
        toast.error('Unable to search users')
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const buildSharedMessage = (post) => {
    const authorName = post?.author?.fullName || post?.name || 'Unknown author'
    const authorHandle = post?.author?.email?.split('@')[0] || post?.author?.handle || 'unknown'
    const excerpt = post?.content ? post.content.slice(0, 120) : ''
    const mediaUrl = post?.images?.[0] || ''

    return {
      postId: post?._id,
      authorName,
      authorHandle,
      authorAvatar: post?.author?.profilePicture || '',
      excerpt,
      mediaUrl,
    }
  }

  const handleShareToConversation = async (conversation) => {
    if (!sharedPost || !conversation) return

    try {
      setIsSharing(true)
      const conversationId = conversation.id || conversation._id
      const messageText = `Shared a post from ${sharedPost.author?.fullName || sharedPost.author?.name || 'someone'}`
      const sharedPostPayload = buildSharedMessage(sharedPost)
      await sendMessage(conversationId, messageText, [], sharedPostPayload)
      toast.success('Post shared successfully')
      closeShareModal()
    } catch (err) {
      console.error('Share failed:', err)
      toast.error(err.message || 'Failed to share post')
    } finally {
      setIsSharing(false)
    }
  }

  const handleUserClick = async (userResult) => {
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
      toast.error(err.message || 'Failed to create conversation')
    } finally {
      setIsSharing(false)
    }
  }

  const conversationOptions = useMemo(() => {
    if (!user) return []
    return conversations
      .map((conversation) => {
        const otherParticipants = conversation.participants.filter(
          (participant) => participant.id !== user._id && participant._id !== user._id
        )
        const title = otherParticipants.length > 0
          ? otherParticipants.map((participant) => participant.name).join(', ')
          : 'Group chat'
        return {
          ...conversation,
          title,
          subtitle: conversation.lastMessage?.content || 'No recent messages',
        }
      })
      .slice(0, 6)
  }, [conversations, user])

  if (!isShareModalOpen) return null

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
        onClick={closeShareModal}
      />
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-2xl bg-white/10">
                {sharedPost?.images?.[0] ? (
                  <img
                    src={sharedPost.images[0]}
                    alt="Post preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/50">
                    Preview
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{sharedPost?.author?.fullName || 'Unknown author'}</p>
                <p className="truncate text-sm text-white/60">@{sharedPost?.author?.email?.split('@')[0] || sharedPost?.author?.handle || 'unknown'}</p>
              </div>
            </div>
            {sharedPost?.content && (
              <p className="mt-3 text-sm leading-relaxed text-white/70 max-h-16 overflow-hidden">{sharedPost.content}</p>
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people to share with"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-5 pb-5">
          {query.trim() ? (
            isSearching ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                Searching...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-red-400">
                {error}
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                No users found.
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((userResult) => (
                  <button
                    type="button"
                    key={userResult._id}
                    onClick={() => handleUserClick(userResult)}
                    disabled={isSharing}
                    className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                      <img
                        src={userResult.profilePicture || `https://i.pravatar.cc/150?u=${userResult._id}`}
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
            <>
              {conversationOptions.length > 0 ? (
                <div className="space-y-2">
                  {conversationOptions.map((conversation) => (
                    <button
                      type="button"
                      key={conversation.id || conversation._id}
                      onClick={() => handleShareToConversation(conversation)}
                      disabled={isSharing}
                      className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{conversation.title}</p>
                          <p className="truncate text-sm text-white/50">{conversation.subtitle}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
                          Share
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                  No recent conversations yet. Search for someone to start a chat.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SharePostModal
