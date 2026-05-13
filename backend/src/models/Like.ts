import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true },
)

likeSchema.index({ user: 1, post: 1 }, { unique: true })
likeSchema.index({ post: 1 })
likeSchema.index({ user: 1 })

export interface ILike extends mongoose.Document {
  user: mongoose.Types.ObjectId | string
  post: mongoose.Types.ObjectId | string
  createdAt?: Date
  updatedAt?: Date
}

const Like = mongoose.model<ILike>('Like', likeSchema)
export default Like
