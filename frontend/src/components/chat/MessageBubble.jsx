import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { MoreVertical, Trash2, Edit2, Check, X } from 'lucide-react'
import { useMessages } from '../../context/MessageContext'
import { useAuth } from '../../context/AuthContext'
import { useModal } from '../../context/ModalContext'
import { useNavigate } from 'react-router-dom'

const MessageBubble = ({ message, isMe, isLastMessage }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)
  const { editMessage, removeMessage } = useMessages()
  const { user } = useAuth()
  const { openPostModal } = useModal()
  const navigate = useNavigate()

  // Format full date for hover tooltip
  const formatFullDate = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    return `${dayOfWeek} ${time}`
  }

  // Sync editedContent with message.content when message changes
  useEffect(() => {
    setTimeout(() => setEditedContent(message.content), 0)
  }, [message.content])

  const isMyMessage = message.sender.id === user._id || message.sender._id === user._id

  // Calculate read status for own messages
  const hasBeenRead = isMyMessage && message.readBy && message.readBy.length > 0

  const handleEdit = async () => {
    try {
      await editMessage(message.id || message._id, editedContent)
      setIsEditing(false)
      toast.success('Message updated successfully')
    } catch (error) {
      console.error('Failed to edit message:', error)
      toast.error('Failed to update message')
    }
  }

  const handleDelete = async () => {
    try {
      await removeMessage(message.id || message._id)
      setShowMenu(false)
      toast.success('Message deleted successfully')
    } catch (error) {
      console.error('Failed to delete message:', error)
      toast.error('Failed to delete message')
    }
  }

  return (
    <div className={`message-bubble flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
      >
        {/* Display attachments without bubble */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="mb-2 last:mb-0">
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-full rounded-lg max-h-64 object-cover"
                    title={formatFullDate(message.createdAtFull)}
                  />
                ) : attachment.type === 'video' ? (
                  <video
                    src={attachment.url}
                    controls
                    className="max-w-full rounded-lg max-h-64"
                    title={formatFullDate(message.createdAtFull)}
                  />
                ) : attachment.type === 'audio' ? (
                  <audio
                    src={attachment.url}
                    controls
                    className="w-full"
                    title={formatFullDate(message.createdAtFull)}
                  />
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                    title={formatFullDate(message.createdAtFull)}
                  >
                    <span className="truncate">{attachment.name}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {message.sharedPost && (
          <button
            type="button"
            onClick={() => {
              const post = {
                _id: message.sharedPost.postId || message.sharedPost.id || message.sharedPost._id,
                id: message.sharedPost.postId || message.sharedPost.id || message.sharedPost._id,
                author: {
                  fullName: message.sharedPost.authorName,
                  email: `${message.sharedPost.authorHandle || 'unknown'}@example.com`,
                  profilePicture: message.sharedPost.authorAvatar,
                },
                name: message.sharedPost.authorName,
                handle: message.sharedPost.authorHandle,
                avatar: message.sharedPost.authorAvatar,
                description: message.sharedPost.excerpt,
                content: message.sharedPost.excerpt,
                media: message.sharedPost.mediaUrl
                  ? [{ url: message.sharedPost.mediaUrl, type: 'image' }]
                  : [],
                images: message.sharedPost.mediaUrl ? [message.sharedPost.mediaUrl] : [],
                likeCount: message.sharedPost.likeCount || 0,
                commentCount: message.sharedPost.commentCount || 0,
                shareCount: message.sharedPost.shareCount || 0,
                createdAt: message.createdAtFull || undefined,
                time: message.sharedPost.time || '',
              }
              try {
                navigate(`/post/${post._id}`)
              } catch (e) {
                void e
              }
              openPostModal(post)
            }}
            className="mb-2 w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-white/10">
                {message.sharedPost.authorAvatar ? (
                  <img
                    src={message.sharedPost.authorAvatar}
                    alt={message.sharedPost.authorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-white/50">
                    P
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {message.sharedPost.authorName}
                </p>
                <p className="truncate text-sm text-white/50">@{message.sharedPost.authorHandle}</p>
              </div>
            </div>
            {message.sharedPost.excerpt && (
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {message.sharedPost.excerpt}
              </p>
            )}
            {message.sharedPost.mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <img
                  src={message.sharedPost.mediaUrl}
                  alt="Shared post"
                  className="w-full object-cover"
                />
              </div>
            )}
          </button>
        )}

        {/* Display text content with bubble */}
        {message.content && (
          <div
            className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed backdrop-blur-sm shadow-sm relative group ${
              isMe
                ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-sm'
                : 'bg-surface text-white rounded-bl-sm border border-white/10'
            }`}
            title={formatFullDate(message.createdAtFull)}
          >
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  className="flex-1 bg-white/20 rounded px-2 py-1 text-white placeholder-white/50 outline-none"
                  autoFocus
                />
                <button onClick={handleEdit} className="hover:bg-white/20 p-1 rounded">
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {message.content}
                {isMyMessage && (
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {showMenu && isMyMessage && (
          <div className="absolute top-0 right-0 mt-8 bg-surface border border-white/10 rounded-lg shadow-lg overflow-hidden z-10">
            <button
              onClick={() => {
                setIsEditing(true)
                setShowMenu(false)
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 text-white text-sm w-full"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 text-red-400 text-sm w-full"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
        <div className="flex items-center gap-1 mt-1 mx-1">
          {isMe && isLastMessage && hasBeenRead && (
            <span className="text-[10px] text-text-dim">Seen</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
