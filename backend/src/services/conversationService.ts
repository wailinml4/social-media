import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import User from '../models/User.js'
import formatTime from '../utils/formatTime.js'
import transformConversation, { ConversationParticipant, ConversationLastMessage } from '../utils/transformConversation.js'
import mongoose from 'mongoose'

export const createConversationService = async ({ participants }: { participants: string[] }) => {
  if (!participants || participants.length < 2) {
    const error = new Error('At least 2 participants required')
    error.statusCode = 400
    throw error
  }

  const existingConversation = await Conversation.findOne({ participants: { $all: participants, $size: participants.length } })
    .populate<{ lastMessage: ConversationLastMessage | null }>('lastMessage')
    .populate<{ participants: ConversationParticipant[] }>('participants', 'fullName email profilePicture isOnline lastSeen')

  if (existingConversation) {
    return transformConversation(existingConversation)
  }

  const conversation = await Conversation.create({ participants })

  const populated = await Conversation.findById(conversation._id)
    .populate<{ lastMessage: ConversationLastMessage | null }>('lastMessage')
    .populate<{ participants: ConversationParticipant[] }>('participants', 'fullName email profilePicture isOnline lastSeen')

  if (!populated) {
    const error = new Error('Failed to load created conversation')
    error.statusCode = 500
    throw error
  }

  return transformConversation(populated)
}

export const getConversationByIdService = async ({ conversationId }: { conversationId: string }) => {
  const conversation = await Conversation.findById(conversationId)
    .populate<{ lastMessage: ConversationLastMessage | null }>('lastMessage')
    .populate<{ participants: ConversationParticipant[] }>('participants', 'fullName email profilePicture isOnline lastSeen')

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  return transformConversation(conversation)
}

export const getUserConversationsService = async ({ userId, page = 1, limit = 20 }: { userId: string; page?: number; limit?: number }) => {
  const skip = (Number(page) - 1) * Number(limit)
  const conversations = await Conversation.find({ participants: userId })
    .populate<{ lastMessage: ConversationLastMessage | null }>('lastMessage')
    .populate<{ participants: ConversationParticipant[] }>('participants', 'fullName email profilePicture isOnline lastSeen')
    .sort({ 'lastMessage.createdAt': -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Conversation.countDocuments({ participants: userId })

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

export const updateUnreadCountService = async ({
  conversationId,
  userId,
  delta,
}: {
  conversationId: string
  userId: string
  delta: number
}) => {
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

export const markConversationAsReadService = async ({ conversationId, userId }: { conversationId: string; userId: string }) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  conversation.unreadCount.set(userId.toString(), 0)
  await conversation.save()

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
      $set: { readAt: new Date() },
    },
  )

  return { message: 'Conversation marked as read' }
}
