import Post from '../models/Post.js'
import Comment, { IComment } from '../models/Comment.js'
import { createNotificationService } from './notificationService.js'
import formatTime from '../utils/formatTime.js'
import transformComment from '../utils/transformComment.js'
import mongoose from 'mongoose'

interface PopulatedCommentUser {
  _id: mongoose.Types.ObjectId
  fullName?: string
  email?: string
  profilePicture?: string
}

type CommentLean = {
  _id: mongoose.Types.ObjectId
  content: string
  user: PopulatedCommentUser
  post: mongoose.Types.ObjectId | string
  parent?: mongoose.Types.ObjectId | string | null
  createdAt?: Date
}

export const createCommentService = async ({
  postId,
  userId,
  content,
  parentId = null,
}: {
  postId: string
  userId: string
  content: string
  parentId?: string | null
}) => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }

  if (parentId) {
    const parentComment = await Comment.findById(parentId)
    if (!parentComment) {
      const error = new Error('Parent comment not found')
      error.statusCode = 404
      throw error
    }
    if (parentComment.post.toString() !== postId) {
      const error = new Error('Parent comment does not belong to this post')
      error.statusCode = 400
      throw error
    }
  }

  const comment = await Comment.create({
    user: userId,
    post: postId,
    content,
    parent: parentId,
  })

  post.commentCount = (post.commentCount || 0) + 1
  await post.save()

  if (post.author.toString() !== userId) {
    try {
      const notificationType = parentId ? 'reply' : 'comment'
      await createNotificationService({
        recipientId: String(post.author),
        senderId: userId,
        type: notificationType,
        postId,
        commentId: String(comment._id),
      })
    } catch (error) {
      console.error('Failed to create comment notification:', error)
    }
  }

  const populated = await Comment.findById(comment._id).populate('user', 'fullName email profilePicture').lean<CommentLean>()

  if (!populated) {
    throw new Error('Failed to load created comment')
  }

  return transformComment(populated)
}

export const getPostCommentsService = async ({ postId, page = 1, limit = 20 }: { postId: string; page?: number; limit?: number }) => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }

  const skip = (page - 1) * limit
  const comments = await Comment.find({ post: postId, parent: null })
    .populate('user', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<CommentLean[]>()

  const total = await Comment.countDocuments({ post: postId, parent: null })

  const transformedComments = comments.map(comment => ({
    _id: comment._id,
    id: comment._id,
    text: comment.content,
    time: formatTime(comment.createdAt),
    likes: 0,
    user: {
      _id: comment.user._id,
      name: comment.user.fullName,
      handle: comment.user.email?.split('@')[0] || 'user',
      avatar: comment.user.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comment.user.fullName,
    },
    replies: [],
  }))

  return {
    comments: transformedComments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getCommentRepliesService = async ({
  commentId,
  page = 1,
  limit = 10,
}: {
  commentId: string
  page?: number
  limit?: number
}) => {
  const parentComment = await Comment.findById(commentId)
  if (!parentComment) {
    const error = new Error('Comment not found')
    error.statusCode = 404
    throw error
  }

  const skip = (page - 1) * limit
  const replies = await Comment.find({ parent: commentId })
    .populate('user', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<CommentLean[]>()

  const total = await Comment.countDocuments({ parent: commentId })

  const transformedReplies = replies.map(reply => ({
    _id: reply._id,
    id: reply._id,
    text: reply.content,
    time: formatTime(reply.createdAt),
    likes: 0,
    user: {
      _id: reply.user._id,
      name: reply.user.fullName,
      handle: reply.user.email?.split('@')[0] || 'user',
      avatar: reply.user.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + reply.user.fullName,
    },
    replies: [],
  }))

  return {
    replies: transformedReplies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const updateCommentService = async ({ commentId, userId, content }: { commentId: string; userId: string; content: string }) => {
  const comment = await Comment.findById(commentId)
  if (!comment) {
    const error = new Error('Comment not found')
    error.statusCode = 404
    throw error
  }

  if (comment.user.toString() !== userId) {
    const error = new Error('You can only edit your own comments')
    error.statusCode = 403
    throw error
  }

  comment.content = content
  await comment.save()

  const populated = await Comment.findById(comment._id).populate('user', 'fullName email profilePicture').lean<CommentLean>()

  if (!populated) {
    throw new Error('Failed to reload comment')
  }

  return transformComment(populated)
}

export const deleteCommentService = async ({ commentId, userId }: { commentId: string; userId: string }) => {
  const comment = await Comment.findById(commentId)
  if (!comment) {
    const error = new Error('Comment not found')
    error.statusCode = 404
    throw error
  }

  if (comment.user.toString() !== userId) {
    const error = new Error('You can only delete your own comments')
    error.statusCode = 403
    throw error
  }

  const post = await Post.findById(comment.post)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }

  const replyCount = await Comment.countDocuments({ parent: commentId })
  await Comment.deleteMany({ parent: commentId })

  await Comment.findByIdAndDelete(commentId)

  post.commentCount = Math.max(0, (post.commentCount || 0) - 1 - replyCount)
  await post.save()

  return { message: 'Comment deleted successfully' }
}
