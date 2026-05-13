import formatTime from './formatTime.js'
import extractSender, { SenderPreview } from './extractSender.js'
import mongoose from 'mongoose'

export interface MessageAttachment {
  type?: 'image' | 'video' | 'audio' | string
  url?: string
  name?: string
  size?: number
  mimeType?: string
}

export interface SharedPostDoc {
  postId?: string
  authorName?: string
  authorHandle?: string
  authorAvatar?: string
  excerpt?: string
  mediaUrl?: string
}

export interface MessageDoc {
  _id: mongoose.Types.ObjectId | string
  content?: string | null
  attachments?: MessageAttachment[]
  sharedPost?: SharedPostDoc
  readBy?: string[] | mongoose.Types.ObjectId[]
  deliveredAt?: string | Date
  readAt?: string | Date
  sender?: SenderPreview | null
  conversation?: mongoose.Types.ObjectId | string | null
  createdAt?: string | Date
}

const transformMessage = (message: MessageDoc) => {
  return {
    _id: message._id,
    id: message._id,
    content: message.content,
    attachments: message.attachments,
    sharedPost: message.sharedPost,
    readBy: message.readBy,
    deliveredAt: message.deliveredAt,
    readAt: message.readAt,
    sender: extractSender(message.sender),
    conversation: message.conversation,
    createdAt: formatTime(message.createdAt),
  }
}

export default transformMessage
