import mongoose from 'mongoose'

const followSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

followSchema.index({ follower: 1, following: 1 }, { unique: true })
followSchema.index({ following: 1 })
followSchema.index({ follower: 1 })

export interface IFollow extends mongoose.Document {
  follower: mongoose.Types.ObjectId | string
  following: mongoose.Types.ObjectId | string
  createdAt?: Date
  updatedAt?: Date
}

const Follow = mongoose.model<IFollow>('Follow', followSchema)
export default Follow
