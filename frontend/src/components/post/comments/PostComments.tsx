import React, { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { Smile, Send } from 'lucide-react'
import Button from '../../ui/Button.jsx'
import CommentItem from './CommentItem.jsx'

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

interface Comment {
  _id?: string
  id?: string
  text: string
  user: CommentUser
  userId?: string
  time?: string
  likes?: string[]
  replies?: Comment[]
}

interface PostCommentsProps {
  comments: Comment[]
  isLoading: boolean
  onAddComment: (text: string) => void
  onReply: (parentId: string, text: string) => void
  postId: string
  currentUserId: string
  onEdit: (commentId: string, text: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

const PostComments = ({ comments, isLoading, onAddComment, onReply, postId, currentUserId, onEdit, onDelete }: PostCommentsProps) => {
  const [commentText, setCommentText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    onAddComment(commentText)
    setCommentText('')
  }

  return (
    <div className="space-y-1 pb-4">
      <h4 className="font-bold text-white text-sm mb-4">Comments</h4>

      {isLoading ? (
        <div className="text-center text-white py-4">Loading comments...</div>
      ) : comments && comments.length > 0 ? (
        comments.map((comment: Comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onReply}
            postId={postId}
            currentUserId={currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="text-center text-white py-4">No comments yet</div>
      )}

      <div className="border-t border-white/10 pt-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-surface border border-white/10 rounded-2xl p-2">
          <button type="button" className="p-1.5 text-text-dim hover:text-primary transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-600"
          />
          <Button
            variant="ghost"
            size="sm"
            disabled={!commentText.trim()}
            className={`font-bold transition-all ${commentText.trim() ? 'text-primary' : 'text-gray-600'}`}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default PostComments
