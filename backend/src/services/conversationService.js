import { Conversation } from "../models/Conversation.js"
import { Message } from "../models/Message.js"
import User from "../models/User.js"

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

export const createConversationService = async (participants) => {
  if (!participants || participants.length < 2) {
    const error = new Error('At least 2 participants required')
    error.statusCode = 400
    throw error
  }

  // Check if conversation already exists between these participants
  const existingConversation = await Conversation.findOne({
    participants: { $all: participants, $size: participants.length }
  }).populate('lastMessage')

  if (existingConversation) {
    return transformConversation(existingConversation)
  }

  const conversation = await Conversation.create({
    participants,
    unreadCount: {},
  })

  await conversation.populate('lastMessage')
  return transformConversation(conversation)
}

export const getConversationByIdService = async (conversationId) => {
  const conversation = await Conversation.findById(conversationId)
    .populate('lastMessage')
    .populate('participants', 'fullName email profilePicture isOnline lastSeen')

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  return transformConversation(conversation)
}

export const getUserConversationsService = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const conversations = await Conversation.find({
    participants: userId
  })
    .populate('lastMessage')
    .populate('participants', 'fullName email profilePicture isOnline lastSeen')
    .sort({ 'lastMessage.createdAt': -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Conversation.countDocuments({
    participants: userId
  })

  const transformedConversations = conversations.map(transformConversation)

  return {
    conversations: transformedConversations,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const updateUnreadCountService = async (conversationId, userId, delta) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  const currentCount = conversation.unreadCount.get(userId.toString()) || 0
  const newCount = Math.max(0, currentCount + delta)
  conversation.unreadCount.set(userId.toString(), newCount)

  await conversation.save()
  return newCount
}

export const markConversationAsReadService = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  conversation.unreadCount.set(userId.toString(), 0)
  await conversation.save()

  // Mark all messages in conversation as read
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
      $set: { readAt: new Date() },
    }
  )

  return { message: 'Conversation marked as read' }
}

const transformConversation = (conversation) => {
  // Generate last message text based on content or attachments
  let lastMessageText = ''
  if (conversation.lastMessage) {
    if (conversation.lastMessage.content) {
      lastMessageText = conversation.lastMessage.content
    } else if (conversation.lastMessage.attachments && conversation.lastMessage.attachments.length > 0) {
      const firstAttachment = conversation.lastMessage.attachments[0]
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
  }

  const transformed = {
    _id: conversation._id,
    id: conversation._id,
    participants: conversation.participants.map((participant) => ({
      _id: participant._id,
      id: participant._id,
      name: participant.fullName,
      handle: participant.email?.split('@')[0] || 'user',
      avatar: participant.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + participant.fullName,
      isOnline: participant.isOnline || false,
      lastSeen: participant.lastSeen,
    })),
    lastMessage: conversation.lastMessage
      ? {
          _id: conversation.lastMessage._id,
          id: conversation.lastMessage._id,
          content: lastMessageText,
          sender: conversation.lastMessage.sender,
          createdAt: formatTime(conversation.lastMessage.createdAt),
        }
      : null,
    unreadCount: Object.fromEntries(conversation.unreadCount),
    createdAt: formatTime(conversation.createdAt),
    updatedAt: formatTime(conversation.updatedAt),
  }

  return transformed
}
