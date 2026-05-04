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

const Post = mongoose.model('Post', postSchema)
export default Post
