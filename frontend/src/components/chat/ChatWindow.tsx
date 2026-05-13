import React, { useEffect, useRef, useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MoreVertical, Paperclip, Phone, Send, Smile, Video, X } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Button from '../ui/Button.jsx'
import ChatMessageSkeleton from './ChatMessageSkeleton.jsx'
import MessageBubble from './MessageBubble.jsx'
import { useConversations } from '../../context/ConversationContext.jsx'
import { useMessages } from '../../context/MessageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { uploadImage } from '../../services/uploadService.js'
import defaultAvatar from '../../assets/default-avatar.svg'
import type { Message } from '../../types/index.js'

interface ChatWindowProps {
  isMobileListVisible: boolean
  setIsMobileListVisible: (visible: boolean) => void
}

interface Attachment {
  id: number | string
  file: File
  type: string
  preview: string
}

const ChatWindow = ({ isMobileListVisible, setIsMobileListVisible }: ChatWindowProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentConversation } = useConversations()
  const { messages, isLoadingMessages, isSendingMessage, typingUsers, sendMessage, emitTyping, emitStopTyping, fetchMessages } =
    useMessages()
  const { markAsRead } = useConversations()

  const [inputText, setInputText] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)
  const markedAsReadRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      const conversationId = currentConversation.id || currentConversation._id
      fetchMessages(conversationId).catch((error: Error) => {
        console.error('Failed to fetch messages:', error)
      })
    }
  }, [currentConversation, fetchMessages])

  // Mark conversation as read when opened
  useEffect(() => {
    if (currentConversation) {
      const conversationId = currentConversation.id || currentConversation._id
      // Only mark as read if this is a different conversation than the last one marked
      if (markedAsReadRef.current !== conversationId) {
        markAsRead(conversationId).catch((error: Error) => {
          console.error('Failed to mark conversation as read:', error)
        })
        markedAsReadRef.current = conversationId
      }
    }
  }, [currentConversation, markAsRead])

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!currentConversation || isSendingMessage) return
    if (!inputText.trim() && attachments.length === 0) return

    try {
      // Upload attachments first
      const uploadedAttachments = []
      for (const attachment of attachments) {
        const url = await uploadImage(attachment.file)
        uploadedAttachments.push({
          type: attachment.type,
          url,
          name: attachment.file.name,
          size: attachment.file.size,
          mimeType: attachment.file.type,
        })
      }

      await sendMessage(currentConversation.id || currentConversation._id, inputText.trim(), uploadedAttachments)
      setInputText('')
      setAttachments([])
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)

    // Emit typing indicator
    if (currentConversation) {
      emitTyping(currentConversation.id || currentConversation._id)

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Emit stop typing after 3 seconds of no activity
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(currentConversation.id || currentConversation._id)
      }, 3000)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments = files.map((file: File) => {
      const type = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : file.type.startsWith('audio/')
            ? 'audio'
            : 'file'

      return {
        id: Date.now() + Math.random(),
        file,
        type,
        preview: URL.createObjectURL(file),
      }
    })
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setInputText(prev => prev + emojiData.emoji)
  }

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (!(event.target instanceof Node)) return
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getTypingUsersText = () => {
    if (!currentConversation) return ''
    const typingUserIds = typingUsers[currentConversation.id || currentConversation._id] || []
    if (typingUserIds.length === 0) return ''

    // Get the names of typing users
    const typingUsersNames = typingUserIds
      .map((userId: string) => {
        const typingUser = currentConversation.participants.find(
          (p: { id?: string; _id?: string; name?: string; fullName?: string }) =>
            (p.id === userId || p._id === userId) && p.id !== user?._id && p._id !== user?._id,
        )
        return typingUser ? typingUser.name || typingUser.fullName : null
      })
      .filter(Boolean)

    if (typingUsersNames.length === 0) return ''
    if (typingUsersNames.length === 1) return `${typingUsersNames[0]} is typing...`
    if (typingUsersNames.length === 2) return `${typingUsersNames.join(' and ')} are typing...`
    return `${typingUsersNames.length} people are typing...`
  }

  const activeChat =
    currentConversation && user
      ? {
          user:
            currentConversation.participants.find((p: { id?: string; _id?: string }) => p.id !== user._id && p._id !== user._id) ||
            currentConversation.participants[0],
        }
      : null

  return (
    <div className={`flex-1 flex flex-col bg-bg-dark min-w-0 ${isMobileListVisible ? 'hidden sm:flex' : 'flex'}`}>
      {activeChat ? (
        <>
          {/* Chat Header */}
          <div className="h-[72px] px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-bg-dark/80 backdrop-blur-xl sticky top-0 z-10 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileListVisible(true)}
                className="sm:hidden -ml-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/profile/${activeChat.user?._id || activeChat.user?.id}`)}
                className="relative flex items-center gap-3 min-w-0 text-left"
              >
                <div className="relative">
                  <img
                    src={activeChat.user?.avatar || defaultAvatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border border-white/10"
                  />
                  {activeChat.user?.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bg-dark rounded-full" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-[15px] truncate hover:underline">
                    {activeChat.user?.name || activeChat.user?.fullName}
                  </h3>
                  <p className="text-xs text-text-dim truncate">
                    {activeChat.user?.isOnline ? <span className="text-green-500">Online</span> : 'Last seen recently'}
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 text-text-dim">
              <button className="p-2 hover:bg-white/10 hover:text-primary rounded-full transition-colors hidden sm:block">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 hover:text-primary rounded-full transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 hover:text-primary rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 no-scrollbar"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 100%)',
            }}
          >
            {isLoadingMessages ? (
              <div className="flex flex-col">
                <ChatMessageSkeleton isMe={false} />
                <ChatMessageSkeleton isMe={true} />
                <ChatMessageSkeleton isMe={false} />
              </div>
            ) : messages.length > 0 ? (
              <>
                {messages.map((msg, index: number) => (
                  <MessageBubble
                    key={msg.id || msg._id}
                    message={msg}
                    isMe={msg.sender?.id === user?._id}
                    isLastMessage={index === messages.length - 1}
                  />
                ))}
                {getTypingUsersText() && <div className="text-xs text-text-dim italic mb-2">{getTypingUsersText()}</div>}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-dim">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Smile className="w-8 h-8 text-text-dim" />
                </div>
                <p>Say hello to {activeChat?.user?.name || 'your friend'}</p>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-bg-dark border-t border-white/10 flex-shrink-0">
            {attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((attachment: Attachment) => (
                  <div key={attachment.id} className="relative group">
                    {attachment.type === 'image' ? (
                      <img src={attachment.preview} alt={attachment.file.name} className="h-16 w-16 rounded-lg object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center">
                        <Paperclip className="w-6 h-6 text-text-dim" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(String(attachment.id))}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={handleSendMessage}
              className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-primary/50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,*/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-text-dim hover:text-primary transition-colors flex-shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Start a new message"
                className="flex-1 bg-transparent border-none text-white focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-2 text-[15px] placeholder-gray-500 outline-none"
                rows={1}
              />

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-text-dim hover:text-primary transition-colors flex-shrink-0 relative"
              >
                <Smile className="w-5 h-5" />
              </button>

              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-20 right-16 z-20">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={(!inputText.trim() && attachments.length === 0) || isSendingMessage}
                className="ml-1"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="hidden sm:flex h-full flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
            <Send className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Select a message</h2>
          <p className="text-text-dim max-w-md">Choose from your existing conversations, start a new one, or just keep swimming.</p>
          <Button className="mt-8 px-8">New message</Button>
        </div>
      )}
    </div>
  )
}

export default ChatWindow
