import User from "../models/User.js"
import Post from "../models/Post.js"
import Follow from "../models/Follow.js"

export const getCurrentProfileService = async (userId) => {
    const user = await User.findById(userId).select("-password -verificationCode -verificationCodeExpiresAt -resetPasswordToken -resetPasswordTokenExpiresAt")
    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }
    
    // Always calculate and update post count for accuracy
    const postCount = await Post.countDocuments({ author: userId })
    user.postCount = postCount
    await User.updateOne({ _id: userId }, { postCount })
    
    // Initialize friendsCount if undefined
    if (user.friendsCount === undefined) {
        // Calculate friends count (mutual follows)
        const following = await Follow.find({ follower: userId }).select('following')
        const followingIds = following.map(f => f.following)
        const followers = await Follow.find({ following: userId, follower: { $in: followingIds } })
        const friendsCount = followers.length
        user.friendsCount = friendsCount
        await User.updateOne({ _id: userId }, { friendsCount })
    }
    
    return user
}

export const getProfileByIdService = async (userId) => {
    const user = await User.findById(userId).select("-password -verificationCode -verificationCodeExpiresAt -resetPasswordToken -resetPasswordTokenExpiresAt")
    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }
    
    // Always calculate and update post count for accuracy
    const postCount = await Post.countDocuments({ author: userId })
    user.postCount = postCount
    await User.updateOne({ _id: userId }, { postCount })
    
    // Initialize friendsCount if undefined
    if (user.friendsCount === undefined) {
        // Calculate friends count (mutual follows)
        const following = await Follow.find({ follower: userId }).select('following')
        const followingIds = following.map(f => f.following)
        const followers = await Follow.find({ following: userId, follower: { $in: followingIds } })
        const friendsCount = followers.length
        user.friendsCount = friendsCount
        await User.updateOne({ _id: userId }, { friendsCount })
    }
    
    return user
}

export const updateProfileService = async (userId, { fullName, bio, profilePicture, coverPicture }) => {
    const user = await User.findById(userId)
    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }

    if (fullName !== undefined) user.fullName = fullName
    if (bio !== undefined) user.bio = bio
    if (profilePicture !== undefined) user.profilePicture = profilePicture
    if (coverPicture !== undefined) user.coverPicture = coverPicture

    await user.save()
    return user
}

export const getSuggestedUsersService = async ({ userId, limit = 5 } = {}) => {
    // Get users that the current user follows
    const following = await Follow.find({ follower: userId }).select('following')
    const followingIds = following.map(f => f.following)
    
    // Add current user to excluded list
    const excludedIds = [...followingIds, userId]
    
    // Get users not followed by current user (excluding self)
    const suggestedUsers = await User.find({
        _id: { $nin: excludedIds }
    })
    .select('fullName email profilePicture bio')
    .limit(limit)
    
    return suggestedUsers
}
