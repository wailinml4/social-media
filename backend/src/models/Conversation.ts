import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    unreadCount: { type: Map, of: Number, default: {} },
  },
  { timestamps: true },
)

conversationSchema.index({ participants: 1 })
conversationSchema.index({ updatedAt: -1 })
conversationSchema.index({ participants: 1, updatedAt: -1 })

export interface IConversation extends mongoose.Document {
  participants: Array<mongoose.Types.ObjectId | string>
  lastMessage?: mongoose.Types.ObjectId | string | null
  unreadCount: Map<string, number>
  createdAt?: Date
  updatedAt?: Date
}

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema)
export default Conversation
