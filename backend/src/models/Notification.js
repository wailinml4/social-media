import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: ['like', 'comment', 'follow', 'mention', 'reply', 'message'],
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', default: null },
    message: { type: String, trim: true, default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Efficient queries for getting user notifications
notificationSchema.index({ recipient: 1, createdAt: -1 })
// Efficient queries for unread notifications
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
