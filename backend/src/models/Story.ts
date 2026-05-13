import mongoose from 'mongoose'

const storySlideSchema = new mongoose.Schema(
  {
    mediaUrl: { type: String, required: true, trim: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    caption: { type: String, trim: true, default: '' },
    duration: { type: Number, default: 5000 },
    timestamp: { type: String, trim: true, default: '' },
  },
  { _id: true },
)

const storySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    slides: [storySlideSchema],
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
storySchema.index({ author: 1 })

export interface IStorySlide {
  _id: mongoose.Types.ObjectId
  mediaUrl: string
  type: 'image' | 'video'
  caption?: string
  duration?: number
  timestamp?: string
}

export interface IStory extends mongoose.Document {
  author: mongoose.Types.ObjectId | string
  expiresAt: Date
  slides: IStorySlide[]
  viewedBy: Array<mongoose.Types.ObjectId | string>
  createdAt?: Date
  updatedAt?: Date
}

const Story = mongoose.model<IStory>('Story', storySchema)
export default Story
