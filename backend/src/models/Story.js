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
    slides: [storySlideSchema],
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
)

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
storySchema.index({ author: 1 })

const Story = mongoose.model('Story', storySchema)
export default Story
