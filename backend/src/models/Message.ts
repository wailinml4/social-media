import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    content: { type: String, required: false },
    sharedPost: {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      authorName: { type: String, trim: true },
      authorHandle: { type: String, trim: true },
      authorAvatar: { type: String, trim: true },
      excerpt: { type: String, trim: true },
      mediaUrl: { type: String, trim: true },
    },
    attachments: [
      {
        type: { type: String, enum: ['image', 'video', 'audio', 'file'], required: true },
        url: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: Number, required: true },
        mimeType: { type: String, required: true },
      },
    ],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deliveredAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true },
)

messageSchema.index({ conversation: 1, createdAt: -1 })
messageSchema.index({ sender: 1 })
messageSchema.index({ conversation: 1, sender: 1 })

interface ISharedPost {
  postId?: mongoose.Types.ObjectId | string
  authorName?: string
  authorHandle?: string
  authorAvatar?: string
  excerpt?: string
  mediaUrl?: string
}

export interface IMessage extends mongoose.Document {
  sender: mongoose.Types.ObjectId | string
  conversation: mongoose.Types.ObjectId | string
  content?: string
  sharedPost?: ISharedPost
  attachments?: Array<{ type?: string; url?: string; name?: string; size?: number; mimeType?: string }>
  readBy?: Array<mongoose.Types.ObjectId | string>
  deliveredAt?: Date
  readAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

const Message = mongoose.model<IMessage>('Message', messageSchema)
export default Message
