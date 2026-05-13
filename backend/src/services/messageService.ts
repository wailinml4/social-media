import Message from '../models/Message.js'
import Conversation from '../models/Conversation.js'
import Post from '../models/Post.js'
import { createNotificationService } from './notificationService.js'
import mongoose from 'mongoose'
import formatTime from '../utils/formatTime.js'
import transformMessage, { MessageDoc, MessageAttachment, SharedPostDoc } from '../utils/transformMessage.js'

type SharedPostInput = (SharedPostDoc & { _id?: mongoose.Types.ObjectId | string; id?: mongoose.Types.ObjectId | string }) | null

type MessageOwnerLean = {
  _id: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId | string
  conversation: mongoose.Types.ObjectId | string
}

export const createMessageService = async ({
  senderId,
  conversationId,
  content,
  attachments = [],
  sharedPost = null,
}: {
  senderId: string
  conversationId: string
  content?: string
  attachments?: MessageAttachment[]
  sharedPost?: SharedPostInput
}) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  const participantIds = conversation.participants.map(p => String(p))
  if (!participantIds.includes(senderId)) {
    const error = new Error('User is not a participant in this conversation')
    error.statusCode = 403
    throw error
  }

  const created = await Message.create({
    sender: senderId,
    conversation: conversationId,
    content,
    attachments,
    sharedPost: sharedPost ?? undefined,
    deliveredAt: new Date(),
  })

  if (sharedPost) {
    const postId = sharedPost._id || sharedPost.id || sharedPost.postId
    if (postId) {
      await Post.findByIdAndUpdate(postId, { $inc: { shareCount: 1 } })
    }
  }

  conversation.lastMessage = created._id
  conversation.updatedAt = new Date()
  await conversation.save()

  const recipientIds = participantIds.filter(id => id !== senderId)

  for (const participantId of recipientIds) {
    const currentCount = conversation.unreadCount.get(participantId) || 0
    conversation.unreadCount.set(participantId, currentCount + 1)
  }
  await conversation.save()

  const messagePreview = created.content
    ? created.content.slice(0, 120)
    : created.attachments && created.attachments.length > 0
      ? created.attachments[0].type === 'image'
        ? 'Sent a photo'
        : created.attachments[0].type === 'video'
          ? 'Sent a video'
          : created.attachments[0].type === 'audio'
            ? 'Sent an audio'
            : 'Sent a file'
      : 'Sent a new message'

  const notificationResults = await Promise.all(
    recipientIds.map(async (recipientId: string) => {
      const notification = await createNotificationService({
        recipientId,
        senderId,
        type: 'message',
        conversationId,
        message: messagePreview,
      })
      return notification ? { recipientId, notification } : null
    }),
  ).then(results => results.filter(Boolean))

  const message = await Message.findById(created._id).populate('sender', 'fullName email profilePicture').lean<MessageDoc>()

  if (!message) {
    throw new Error('Failed to load message after creation')
  }

  const transformedMessage = transformMessage(message)

  let lastMessageText = ''
  if (created.content) {
    lastMessageText = created.content
  } else if (created.attachments && created.attachments.length > 0) {
    const firstAttachment = created.attachments[0]
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
    notifications: notificationResults,
  }
}

export const getMessageByIdService = async ({ messageId }: { messageId: string }) => {
  const message = await Message.findById(messageId)
    .populate('sender', 'fullName email profilePicture')
    .populate('readBy', 'fullName email profilePicture')
    .lean<MessageDoc>()

  if (!message) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  return transformMessage(message)
}

export const getConversationMessagesService = async ({
  conversationId,
  page = 1,
  limit = 50,
}: {
  conversationId: string
  page?: number
  limit?: number
}) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  const skip = (Number(page) - 1) * Number(limit)
  const messages = await Message.find({ conversation: conversationId })
    .populate('sender', 'fullName email profilePicture')
    .populate('readBy', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<MessageDoc[]>()

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

export const updateMessageService = async ({
  messageId,
  userId,
  data,
}: {
  messageId: string
  userId: string
  data: { content?: string }
}) => {
  const messageDoc = await Message.findById(messageId).lean<MessageOwnerLean>()

  if (!messageDoc) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  if (String(messageDoc.sender) !== userId) {
    const error = new Error('You can only edit your own messages')
    error.statusCode = 403
    throw error
  }

  const updated = await Message.findByIdAndUpdate(new mongoose.Types.ObjectId(messageId), { $set: data }, { new: true })
    .populate('sender', 'fullName email profilePicture')
    .populate('readBy', 'fullName email profilePicture')
    .lean<MessageDoc>()

  if (!updated) {
    throw new Error('Failed to update message')
  }

  return transformMessage(updated)
}

export const deleteMessageService = async ({ messageId, userId }: { messageId: string; userId: string }) => {
  const messageDoc = await Message.findById(messageId).lean<MessageOwnerLean>()

  if (!messageDoc) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  if (String(messageDoc.sender) !== userId) {
    const error = new Error('You can only delete your own messages')
    error.statusCode = 403
    throw error
  }

  const conversationId = messageDoc.conversation

  await Message.findByIdAndDelete(messageId)

  const conversation = await Conversation.findById(conversationId)
  if (conversation && conversation.lastMessage?.toString() === messageId) {
    const lastMessage = await Message.findOne({ conversation: conversationId }).sort({ createdAt: -1 })
    conversation.lastMessage = lastMessage?._id || null
    await conversation.save()
  }

  return { conversationId, message: 'Message deleted successfully' }
}

export const markMessageAsReadService = async ({ messageId, userId }: { messageId: string; userId: string }) => {
  const message = await Message.findById(messageId)

  if (!message) {
    const error = new Error('Message not found')
    error.statusCode = 404
    throw error
  }

  const readByIds = (message.readBy || []).map(r => String(r))
  if (!readByIds.includes(userId)) {
    message.readBy = message.readBy || []
    message.readBy.push(userId)
    message.readAt = new Date()
    await message.save()
  }

  const conversation = await Conversation.findById(message.conversation)
  if (conversation) {
    const currentCount = conversation.unreadCount.get(userId.toString()) || 0
    conversation.unreadCount.set(userId.toString(), Math.max(0, currentCount - 1))
    await conversation.save()
  }

  const populated = await Message.findById(messageId)
    .populate('sender', 'fullName email profilePicture')
    .populate('readBy', 'fullName email profilePicture')
    .lean<MessageDoc>()

  if (!populated) {
    throw new Error('Message not found after update')
  }

  return transformMessage(populated)
}

export const markConversationMessagesAsReadService = async ({ conversationId, userId }: { conversationId: string; userId: string }) => {
  const conversation = await Conversation.findById(conversationId)

  if (!conversation) {
    const error = new Error('Conversation not found')
    error.statusCode = 404
    throw error
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
      $set: { readAt: new Date() },
    },
  )

  conversation.unreadCount.set(userId.toString(), 0)
  await conversation.save()

  return { message: 'All messages marked as read' }
}
