import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  attachments: [
    {
      type: {
        type: String,
        enum: ['image', 'video', 'audio', 'file'],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
      },
    }
  ],
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  deliveredAt: {
    type: Date,
  },
  readAt: {
    type: Date,
  },
}, {
  timestamps: true,
})

// Indexes for efficient querying
messageSchema.index({ conversation: 1, createdAt: -1 })
messageSchema.index({ sender: 1 })
messageSchema.index({ conversation: 1, sender: 1 })

export const Message = mongoose.model('Message', messageSchema)
