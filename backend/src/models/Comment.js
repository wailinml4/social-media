import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        content: { type: String, required: true, trim: true, maxLength: 1000 },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    },
    { timestamps: true },
)

// Efficient queries for getting post comments
commentSchema.index({ post: 1, createdAt: -1 })
// Efficient queries for getting user's comments
commentSchema.index({ user: 1 })
// Efficient queries for nested comments
commentSchema.index({ parent: 1, createdAt: -1 })

const Comment = mongoose.model("Comment", commentSchema)
export default Comment
