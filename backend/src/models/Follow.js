import mongoose from "mongoose"

const followSchema = new mongoose.Schema(
    {
        follower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
)

// Prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true })
// Efficient queries for getting user's followers
followSchema.index({ following: 1 })
// Efficient queries for getting user's following
followSchema.index({ follower: 1 })

const Follow = mongoose.model("Follow", followSchema)
export default Follow
