import Notification from '../models/Notification.js'
import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import Conversation from '../models/Conversation.js'

const formatTime = date => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${days}d`
}

// Safely extract sender info for frontend consumption
const extractSender = sender => {
  if (!sender) {
    return {
      _id: null,
      name: 'Unknown',
      handle: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
    }
  }

  const id = sender._id ?? (typeof sender === 'string' ? sender : null)
  const name = sender.fullName || sender.name || 'Unknown'
  const email = sender.email || null
  const avatar =
    sender.profilePicture ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || id || 'user')}`

  return {
    _id: id,
    name,
    handle: email ? email.split('@')[0] : 'user',
    avatar,
  }
}

export const createNotificationService = async (
  recipientId,
  senderId,
  type,
  postId = null,
  commentId = null,
  conversationId = null,
  message = null,
) => {
  // Don't create notification if sender is the recipient
  if (recipientId.toString() === senderId.toString()) {
    return null
  }

  // Validate recipient exists
  const recipient = await User.findById(recipientId)
  if (!recipient) {
    const error = new Error('Recipient not found')
    error.statusCode = 404
    throw error
  }

  // Validate sender exists
  const sender = await User.findById(senderId)
  if (!sender) {
    const error = new Error('Sender not found')
    error.statusCode = 404
    throw error
  }

  // If post is provided, validate it exists
  if (postId) {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Post not found')
      error.statusCode = 404
      throw error
    }
  }

  // If comment is provided, validate it exists
  if (commentId) {
    const comment = await Comment.findById(commentId)
    if (!comment) {
      const error = new Error('Comment not found')
      error.statusCode = 404
      throw error
    }
  }

  // If conversation is provided, validate it exists
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

  // Populate sender data and conversation reference if available
  await notification.populate('sender', 'fullName email profilePicture')
  await notification.populate('conversation', '_id')

  // Transform to match frontend expectations
  const senderInfo = extractSender(notification.sender)

  const transformedNotification = {
    _id: notification._id,
    id: notification._id,
    type: notification.type,
    isRead: notification.isRead,
    time: formatTime(notification.createdAt),
    sender: senderInfo,
    post: notification.post,
    comment: notification.comment,
    conversation: notification.conversation
      ? {
          _id: notification.conversation._id || notification.conversation,
          id: notification.conversation._id || notification.conversation,
        }
      : null,
    message: notification.message || null,
  }

  return transformedNotification
}

export const getAllNotificationsService = async (recipientId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const notifications = await Notification.find({ recipient: recipientId })
    .populate('sender', 'fullName email profilePicture')
    .populate('post', 'description content media images')
    .populate('comment', 'content')
    .populate('conversation', '_id')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Notification.countDocuments({ recipient: recipientId })
  const unreadCount = await Notification.countDocuments({ recipient: recipientId, isRead: false })

  // Transform notifications to match frontend expectations
  const transformedNotifications = notifications.map(notification => {
    const postContent = notification.post?.description || notification.post?.content || ''
    const postMedia =
      notification.post?.media ||
      (notification.post?.images || []).map(url => ({
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
      conversation: notification.conversation
        ? { _id: notification.conversation._id, id: notification.conversation._id }
        : null,
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

export const markAsReadService = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId)
  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  // Only the recipient can mark as read
  if (notification.recipient.toString() !== userId) {
    const error = new Error('You can only mark your own notifications as read')
    error.statusCode = 403
    throw error
  }

  notification.isRead = true
  await notification.save()

  // Populate sender data and conversation reference
  await notification.populate('sender', 'fullName email profilePicture')
  await notification.populate('conversation', '_id')

  // Transform to match frontend expectations
  const senderInfo = extractSender(notification.sender)

  const transformedNotification = {
    _id: notification._id,
    id: notification._id,
    type: notification.type,
    isRead: notification.isRead,
    time: formatTime(notification.createdAt),
    sender: senderInfo,
    post: notification.post,
    comment: notification.comment,
    conversation: notification.conversation
      ? { _id: notification.conversation._id, id: notification.conversation._id }
      : null,
    message: notification.message || null,
  }

  return transformedNotification
}

export const markAllAsReadService = async userId => {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true })

  return { message: 'All notifications marked as read' }
}

export const deleteNotificationService = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId)
  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  // Only the recipient can delete
  if (notification.recipient.toString() !== userId) {
    const error = new Error('You can only delete your own notifications')
    error.statusCode = 403
    throw error
  }

  await Notification.findByIdAndDelete(notificationId)

  return { message: 'Notification deleted successfully' }
}
