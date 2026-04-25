import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: false, trim: true, maxLength: 280 },
        images: [{ type: String, trim: true }],
        
        likeCount: { type: Number, default: 0 },
        bookmarkCount: { type: Number, default: 0 },

        // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] }], // TODO: check if this is correct
    },
    { timestamps: true },
)

const Post = mongoose.model("Post", postSchema)
export default Post
