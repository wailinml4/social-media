import formatTime from './formatTime.js'
import mongoose from 'mongoose'

interface CommentUser {
  _id: mongoose.Types.ObjectId | string
  fullName?: string
  email?: string
  profilePicture?: string | null
}

export interface CommentDoc {
  _id: mongoose.Types.ObjectId | string
  content?: string
  createdAt?: string | Date
  user: CommentUser
}

const transformComment = (comment: CommentDoc) => {
  const user = comment.user
  return {
    _id: comment._id,
    id: comment._id,
    text: comment.content,
    time: formatTime(comment.createdAt),
    likes: 0,
    user: {
      _id: user._id,
      id: user._id,
      name: user.fullName,
      handle: user.email?.split('@')[0] || 'user',
      avatar: user.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.fullName || 'user'),
    },
    replies: [],
  }
}

export default transformComment
