import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['like', 'comment', 'follow', 'mention', 'reply', 'message'] },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', default: null },
    message: { type: String, trim: true, default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

notificationSchema.index({ recipient: 1, createdAt: -1 })
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })

export interface INotification extends mongoose.Document {
  recipient: mongoose.Types.ObjectId | string
  sender: mongoose.Types.ObjectId | string
  type: string
  post?: mongoose.Types.ObjectId | string | null
  comment?: mongoose.Types.ObjectId | string | null
  conversation?: mongoose.Types.ObjectId | string | null
  message?: string | null
  isRead: boolean
  createdAt?: Date
  updatedAt?: Date
}

const Notification = mongoose.model<INotification>('Notification', notificationSchema)
export default Notification
