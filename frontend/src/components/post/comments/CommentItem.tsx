import React, { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Smile, Send, MoreHorizontal, Trash2, Edit2, Loader2 } from 'lucide-react'
import Spinner from '../../loading/Spinner'
import Button from '../../ui/Button.jsx'
import type { User } from '../../../types/index.js'

interface CommentUser {
  _id: string
  id?: string
  fullName?: string
  profilePicture?: string
  avatar?: string
  name?: string
  handle?: string
  time?: string
}

interface CommentItemProps {
  comment: {
    _id?: string
    id?: string
    text: string
    user: CommentUser
    userId?: string
    time?: string
    likes?: string[]
    replies?: CommentItemProps['comment'][]
  }
  isReply?: boolean
  onReply: (commentId: string, text: string) => void
  postId: string
  currentUserId: string
  onEdit: (commentId: string, text: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

const CommentItem = ({ comment, isReply = false, onReply, postId, currentUserId, onEdit, onDelete }: CommentItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwnComment = comment.user._id === currentUserId || comment.userId === currentUserId || comment.user?.id === currentUserId

  const handleReplySubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(comment._id || comment.id || '', replyText)
    setReplyText('')
    setShowReplyInput(false)
  }

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editText.trim()) return
    setIsSaving(true)
    try {
      await onEdit(comment._id || comment.id || '', editText)
      setIsEditing(false)
    } catch (err) {
      void err
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditText(comment.text)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setShowMenu(false)
    try {
      await onDelete(comment._id || comment.id || '')
    } catch (err) {
      void err
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={`flex gap-3 ${isReply ? 'ml-10 mt-3' : 'mb-5'} comment-item`}>
      <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full border border-white/10 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-white text-[13px] hover:underline cursor-pointer">{comment.user.name}</span>
          <span className="text-white text-[11px] truncate">@{comment.user.handle}</span>
          <span className="text-gray-600 text-[11px]">·</span>
          <span className="text-white text-[11px]">{comment.time}</span>
          {isOwnComment && (
            <div className="relative ml-auto">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-text-dim hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-surface border border-white/10 rounded-lg shadow-lg overflow-hidden z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? <Spinner size="sm" inline /> : <Trash2 className="w-4 h-4" />}
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[13px] outline-none focus:border-primary transition-colors"
            />
            <button type="button" onClick={handleCancelEdit} className="px-3 py-2 text-sm text-text-dim hover:text-white transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!editText.trim() || isSaving}
              className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" inline />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </form>
        ) : (
          <p className="text-white text-[13px] leading-relaxed mb-1.5">{comment.text}</p>
        )}
        <div className="flex items-center gap-4 text-white text-[11px] font-semibold">
          <button onClick={() => setShowReplyInput(!showReplyInput)} className="hover:text-primary transition-colors">
            Reply
          </button>
          {!isReply && <button className="hover:text-pink-500 transition-colors">Like</button>}
          {(comment.likes?.length || 0) > 0 && <span>{comment.likes} likes</span>}
        </div>

        {showReplyInput && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex items-center gap-2 bg-surface border border-white/10 rounded-2xl p-2">
            <button type="button" className="p-1.5 text-text-dim hover:text-primary transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Add a reply..."
              value={replyText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setReplyText(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-600"
            />
            <Button
              variant="ghost"
              size="sm"
              disabled={!replyText.trim()}
              className={`font-bold transition-all ${replyText.trim() ? 'text-primary' : 'text-gray-600'}`}
            >
              <Send className="w-5 h-5 ml-0.5" />
            </Button>
          </form>
        )}

        {comment.replies &&
          comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply={true}
              onReply={onReply}
              postId={postId}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
      </div>
    </div>
  )
}

export default CommentItem
