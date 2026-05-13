import Notification from '../models/Notification.js'
import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import Conversation from '../models/Conversation.js'
import formatTime from '../utils/formatTime.js'
import extractSender, { SenderPreview } from '../utils/extractSender.js'
import mongoose from 'mongoose'

interface CreateNotificationInput {
  recipientId: string
  senderId: string
  type: string
  postId?: string | null
  commentId?: string | null
  conversationId?: string | null
  message?: string | null
}

interface PaginationInput {
  page?: number
  limit?: number
}

interface IdUserInput {
  notificationId?: string
  userId?: string
}

type PopulatedNotif = {
  _id: mongoose.Types.ObjectId
  sender: SenderPreview
  conversation: { _id: mongoose.Types.ObjectId } | null
  type: string
  isRead: boolean
  message: string | null
  post: mongoose.Types.ObjectId | null
  comment: mongoose.Types.ObjectId | null
  createdAt?: Date
}

type PopulatedNotifFull = {
  _id: mongoose.Types.ObjectId
  sender: SenderPreview
  conversation: { _id: mongoose.Types.ObjectId } | null
  type: string
  isRead: boolean
  message: string | null
  post: {
    _id: mongoose.Types.ObjectId
    description?: string
    content?: string
    media?: { url: string; type?: string }[]
    images?: string[]
  } | null
  comment: { _id: mongoose.Types.ObjectId; content?: string } | null
  createdAt?: Date
}

export const createNotificationService = async ({
  recipientId,
  senderId,
  type,
  postId = null,
  commentId = null,
  conversationId = null,
  message = null,
}: CreateNotificationInput) => {
  if (recipientId.toString() === senderId.toString()) {
    return null
  }

  const recipient = await User.findById(recipientId)
  if (!recipient) {
    const error = new Error('Recipient not found')
    error.statusCode = 404
    throw error
  }

  const sender = await User.findById(senderId)
  if (!sender) {
    const error = new Error('Sender not found')
    error.statusCode = 404
    throw error
  }

  if (postId) {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Post not found')
      error.statusCode = 404
      throw error
    }
  }

  if (commentId) {
    const comment = await Comment.findById(commentId)
    if (!comment) {
      const error = new Error('Comment not found')
      error.statusCode = 404
      throw error
    }
  }

  if (conversationId) {
    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      const error = new Error('Conversation not found')
      error.statusCode = 404
      throw error
    }
  }

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    post: postId,
    comment: commentId,
    conversation: conversationId,
    message,
  })

  const populated = await Notification.findById(notification._id)
    .populate('sender', 'fullName email profilePicture')
    .populate('conversation', '_id')
    .lean<PopulatedNotif>()

  if (!populated) {
    return null
  }

  const senderInfo = extractSender(populated.sender)

  const transformedNotification = {
    _id: populated._id,
    id: populated._id,
    type: populated.type,
    isRead: populated.isRead,
    time: formatTime(populated.createdAt),
    sender: senderInfo,
    post: populated.post,
    comment: populated.comment,
    conversation: populated.conversation
      ? {
          _id: populated.conversation._id,
          id: populated.conversation._id,
        }
      : null,
    message: populated.message || null,
  }

  return transformedNotification
}

export const getAllNotificationsService = async ({ recipientId, page = 1, limit = 20 }: PaginationInput & { recipientId: string }) => {
  const skip = (Number(page) - 1) * Number(limit)
  const notifications = await Notification.find({ recipient: recipientId })
    .populate('sender', 'fullName email profilePicture')
    .populate('post', 'description content media images')
    .populate('comment', 'content')
    .populate('conversation', '_id')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<PopulatedNotifFull[]>()

  const total = await Notification.countDocuments({ recipient: recipientId })
  const unreadCount = await Notification.countDocuments({ recipient: recipientId, isRead: false })

  const transformedNotifications = notifications.map(notification => {
    const postContent = notification.post?.description || notification.post?.content || ''
    const postMedia =
      notification.post?.media ||
      (notification.post?.images || []).map((url: string) => ({
        url,
        type: /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image',
      }))
    const senderInfo = extractSender(notification.sender)

    return {
      _id: notification._id,
      id: notification._id,
      type: notification.type,
      isRead: notification.isRead,
      time: formatTime(notification.createdAt),
      sender: senderInfo,
      post: notification.post
        ? {
            _id: notification.post._id,
            content: postContent,
            description: notification.post.description,
            media: postMedia,
          }
        : null,
      comment: notification.comment
        ? {
            _id: notification.comment._id,
            content: notification.comment.content,
          }
        : null,
      conversation: notification.conversation ? { _id: notification.conversation._id, id: notification.conversation._id } : null,
      message: notification.message || null,
    }
  })

  return {
    notifications: transformedNotifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      unreadCount,
    },
  }
}

export const markAsReadService = async ({ notificationId, userId }: IdUserInput) => {
  const notification = await Notification.findById(notificationId)
  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  if (notification.recipient.toString() !== userId) {
    const error = new Error('You can only mark your own notifications as read')
    error.statusCode = 403
    throw error
  }

  notification.isRead = true
  await notification.save()

  const populated = await Notification.findById(notification._id)
    .populate('sender', 'fullName email profilePicture')
    .populate('conversation', '_id')
    .lean<PopulatedNotif>()

  if (!populated) {
    throw new Error('Failed to reload notification after marking read')
  }

  const senderInfo = extractSender(populated.sender)

  const transformedNotification = {
    _id: populated._id,
    id: populated._id,
    type: populated.type,
    isRead: populated.isRead,
    time: formatTime(populated.createdAt),
    sender: senderInfo,
    post: populated.post,
    comment: populated.comment,
    conversation: populated.conversation ? { _id: populated.conversation._id, id: populated.conversation._id } : null,
    message: populated.message || null,
  }

  return transformedNotification
}

export const markAllAsReadService = async ({ userId }: { userId: string }) => {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true })

  return { message: 'All notifications marked as read' }
}

export const deleteNotificationService = async ({ notificationId, userId }: IdUserInput) => {
  const notification = await Notification.findById(notificationId)
  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  if (notification.recipient.toString() !== userId) {
    const error = new Error('You can only delete your own notifications')
    error.statusCode = 403
    throw error
  }

  await Notification.findByIdAndDelete(notificationId)

  return { message: 'Notification deleted successfully' }
}

export const deleteAllNotificationsService = async ({ userId }: { userId: string }) => {
  await Notification.deleteMany({ recipient: userId })
  return { message: 'All notifications deleted successfully' }
}
