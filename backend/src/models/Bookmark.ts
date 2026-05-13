import mongoose from 'mongoose'

const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true },
)

bookmarkSchema.index({ user: 1, post: 1 }, { unique: true })
bookmarkSchema.index({ post: 1 })
bookmarkSchema.index({ user: 1 })

export interface IBookmark extends mongoose.Document {
  user: mongoose.Types.ObjectId | string
  post: mongoose.Types.ObjectId | string
  createdAt?: Date
  updatedAt?: Date
}

const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema)
export default Bookmark
