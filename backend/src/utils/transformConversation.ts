import formatTime from './formatTime.js'
import mongoose from 'mongoose'

export interface ConversationParticipant {
  _id: mongoose.Types.ObjectId | string
  fullName?: string
  email?: string
  profilePicture?: string | null
  isOnline?: boolean
  lastSeen?: string | Date | null
}

interface ConversationAttachment {
  type?: 'image' | 'video' | 'audio' | string
  url?: string
}

export interface ConversationLastMessage {
  _id: mongoose.Types.ObjectId | string
  content?: string | null
  attachments?: ConversationAttachment[]
  sender?: ConversationParticipant | mongoose.Types.ObjectId | string | null
  createdAt?: string | Date
}

export interface ConversationDoc {
  _id: mongoose.Types.ObjectId | string
  participants: ConversationParticipant[]
  lastMessage?: ConversationLastMessage | null
  unreadCount: Map<string, number> | Record<string, number>
  createdAt?: string | Date
  updatedAt?: string | Date
}

const transformConversation = (conversation: ConversationDoc) => {
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
    participants: conversation.participants.map((participant: ConversationParticipant) => ({
      _id: participant._id,
      id: participant._id,
      name: participant.fullName,
      handle: participant.email?.split('@')[0] || 'user',
      avatar: participant.profilePicture || null,
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
    unreadCount: conversation.unreadCount instanceof Map ? Object.fromEntries(conversation.unreadCount) : conversation.unreadCount,
    createdAt: formatTime(conversation.createdAt),
    updatedAt: formatTime(conversation.updatedAt),
  }

  return transformed
}

export default transformConversation
