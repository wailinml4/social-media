import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: false, trim: true, maxLength: 2200 },
    media: [
      {
        url: { type: String, trim: true },
        type: { type: String, enum: ['image', 'video'], default: 'image' },
        altText: { type: String, trim: true, default: '' },
      },
    ],
    likeCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export interface IPost extends mongoose.Document {
  author: mongoose.Types.ObjectId | string
  description?: string
  media?: Array<{ url?: string; type?: string; altText?: string }>
  likeCount: number
  bookmarkCount: number
  commentCount: number
  shareCount: number
  createdAt?: Date
  updatedAt?: Date
}

const Post = mongoose.model<IPost>('Post', postSchema)
export default Post
