import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for efficient querying
conversationSchema.index({ participants: 1 })
conversationSchema.index({ updatedAt: -1 })
conversationSchema.index({ participants: 1, updatedAt: -1 })

const Conversation = mongoose.model('Conversation', conversationSchema)
export default Conversation
