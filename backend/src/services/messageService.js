import { Message } from "../models/Message.js"
import { Conversation } from "../models/Conversation.js"
import User from "../models/User.js"
import mongoose from "mongoose"

const formatTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return date.toLocaleDateString()
}

export const createMessageService = async (senderId, conversationId, content, attachments = [], sharedPost = null) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  if (!conversation.participants.includes(senderId)) {
    const error = new Error('User is not a participant in this conversation')
    error.statusCode = 403
    throw error
  }

  const message = await Message.create({
    sender: senderId,
    conversation: conversationId,
    content,
    attachments,
    sharedPost,
    deliveredAt: new Date(),
  })

  // Update conversation's lastMessage
  conversation.lastMessage = message._id
  conversation.updatedAt = new Date()
  await conversation.save()

  // Increment unread count for all participants except sender
  for (const participantId of conversation.participants) {
    if (participantId.toString() !== senderId) {
      const currentCount = conversation.unreadCount.get(participantId.toString()) || 0
      conversation.unreadCount.set(participantId.toString(), currentCount + 1)
    }
  }
  await conversation.save()

  // Populate sender data
  await message.populate('sender', 'fullName email profilePicture')

  const transformedMessage = transformMessage(message)

  // Generate last message text for conversation list
  let lastMessageText = ''
  if (message.content) {
    lastMessageText = message.content
  } else if (message.attachments && message.attachments.length > 0) {
    const firstAttachment = message.attachments[0]
    if (firstAttachment.type === 'image') {
      lastMessageText = 'Sent a photo'
    } else if (firstAttachment.type === 'video') {
      lastMessageText = 'Sent a video'
    } else if (firstAttachment.type === 'audio') {
      lastMessageText = 'Sent an audio'
    } else {
      lastMessageText = 'Sent a file'
    }
  }

  return {
    message: transformedMessage,
    conversation: {
      _id: conversation._id,
      id: conversation._id,
      lastMessage: {
        ...transformedMessage,
        content: lastMessageText,
      },
      unreadCount: Object.fromEntries(conversation.unreadCount),
      updatedAt: formatTime(conversation.updatedAt),
    },
  }
}

export const getMessageByIdService = async (messageId) => {
  const message = await Message.findById(messageId)
    .populate('sender', 'fullName email profilePicture')
    .populate('readBy', 'fullName email profilePicture')

  if (!message) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  return transformMessage(message)
}

export const getConversationMessagesService = async (conversationId, page = 1, limit = 50) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  const skip = (page - 1) * limit
  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'fullName email profilePicture')
    .populate('readBy', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Message.countDocuments({ conversation: conversationId })

  const transformedMessages = messages.map(transformMessage).reverse()

  return {
    messages: transformedMessages,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const updateMessageService = async (messageId, userId, data) => {
  const message = await Message.findById(messageId)

  if (!message) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  // Verify user is the sender
  const userObjectId = new mongoose.Types.ObjectId(userId)
  const senderId = message.sender._id || message.sender.id
  if (!senderId.equals(userObjectId)) {
    const error = new Error('You can only edit your own messages')
    error.statusCode = 403
    throw error
  }

  const updatedMessage = await Message.findByIdAndUpdate(
    new mongoose.Types.ObjectId(messageId),
    { $set: data },
    { new: true }
  )
    .populate('sender', 'fullName email profilePicture')
    .populate('readBy', 'fullName email profilePicture')

  return transformMessage(updatedMessage)
}

export const deleteMessageService = async (messageId, userId) => {
  const message = await Message.findById(messageId)

  if (!message) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  // Verify user is the sender
  const userObjectId = new mongoose.Types.ObjectId(userId)
  const senderId = message.sender._id || message.sender.id
  if (!senderId.equals(userObjectId)) {
    const error = new Error('You can only delete your own messages')
    error.statusCode = 403
    throw error
  }

  const conversationId = message.conversation

  await Message.findByIdAndDelete(messageId)

  // Update conversation's lastMessage if this was the last message
  const conversation = await Conversation.findById(conversationId)
  if (conversation && conversation.lastMessage?.toString() === messageId) {
    const lastMessage = await Message.findOne({ conversation: conversationId })
      .sort({ createdAt: -1 })
    conversation.lastMessage = lastMessage?._id || null
    await conversation.save()
  }

  return { conversationId, message: 'Message deleted successfully' }
}

export const markMessageAsReadService = async (messageId, userId) => {
  const message = await Message.findById(messageId)

  if (!message) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  if (!message.readBy.includes(userId)) {
    message.readBy.push(userId)
    message.readAt = new Date()
    await message.save()
  }

  // Update conversation unread count
  const conversation = await Conversation.findById(message.conversation)
  if (conversation) {
    const currentCount = conversation.unreadCount.get(userId.toString()) || 0
    conversation.unreadCount.set(userId.toString(), Math.max(0, currentCount - 1))
    await conversation.save()
  }

  await message.populate('sender', 'fullName email profilePicture')
  await message.populate('readBy', 'fullName email profilePicture')

  return transformMessage(message)
}

export const markConversationMessagesAsReadService = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  // Mark all messages from other users as read
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
      $set: { readAt: new Date() },
    }
  )

  // Reset unread count
  conversation.unreadCount.set(userId.toString(), 0)
  await conversation.save()

  return { message: 'All messages marked as read' }
}

const transformMessage = (message) => {
  return {
    _id: message._id,
    id: message._id,
    sender: {
      _id: message.sender._id,
      id: message.sender._id,
      name: message.sender.fullName,
      handle: message.sender.email?.split('@')[0] || 'user',
      avatar: message.sender.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + message.sender.fullName,
    },
    conversation: message.conversation,
    content: message.content,
    attachments: message.attachments || [],
    sharedPost: message.sharedPost || null,
    readBy: message.readBy.map((user) => ({
      _id: user._id,
      id: user._id,
      name: user.fullName,
    })),
    deliveredAt: message.deliveredAt ? formatTime(message.deliveredAt) : null,
    readAt: message.readAt ? formatTime(message.readAt) : null,
    createdAt: formatTime(message.createdAt),
    createdAtFull: message.createdAt ? message.createdAt.toISOString() : null,
  }
}
