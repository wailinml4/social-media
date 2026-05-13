import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true, trim: true, maxLength: 1000 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true },
)

commentSchema.index({ post: 1, createdAt: -1 })
commentSchema.index({ user: 1 })
commentSchema.index({ parent: 1, createdAt: -1 })

export interface IComment extends mongoose.Document {
  user: mongoose.Types.ObjectId | string
  post: mongoose.Types.ObjectId | string
  content: string
  parent?: mongoose.Types.ObjectId | string | null
  createdAt?: Date
  updatedAt?: Date
}

const Comment = mongoose.model<IComment>('Comment', commentSchema)
export default Comment
