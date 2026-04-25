import User from "../models/User.js"
import Follow from "../models/Follow.js"

export const followUserService = async (currentUserId, targetUserId) => {
    if (currentUserId === targetUserId) {
        const error = new Error("You cannot follow yourself")
        error.statusCode = 400
        throw error
    }

    const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId })
    if (existingFollow) {
        const error = new Error("Already following this user")
        error.statusCode = 400
        throw error
    }

    // Check if target user already follows current user (mutual follow)
    const targetFollowsCurrent = await Follow.findOne({ follower: targetUserId, following: currentUserId })

    await Follow.create({ follower: currentUserId, following: targetUserId })

    await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: 1 } })
    await User.updateOne({ _id: targetUserId }, { $inc: { followerCount: 1 } })

    // If this creates a mutual follow, increment friendsCount for both
    if (targetFollowsCurrent) {
        await User.updateOne({ _id: currentUserId }, { $inc: { friendsCount: 1 } })
        await User.updateOne({ _id: targetUserId }, { $inc: { friendsCount: 1 } })
    }

    const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(targetUserId)
    ])

    return { currentUser, targetUser }
}

export const unfollowUserService = async (currentUserId, targetUserId) => {
    const follow = await Follow.findOneAndDelete({ follower: currentUserId, following: targetUserId })

    if (follow) {
        // Check if target user follows current user (was a mutual follow)
        const targetFollowsCurrent = await Follow.findOne({ follower: targetUserId, following: currentUserId })

        await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: -1 } })
        await User.updateOne({ _id: targetUserId }, { $inc: { followerCount: -1 } })

        // If this was a mutual follow, decrement friendsCount for both
        if (targetFollowsCurrent) {
            await User.updateOne({ _id: currentUserId }, { $inc: { friendsCount: -1 } })
            await User.updateOne({ _id: targetUserId }, { $inc: { friendsCount: -1 } })
        }
    }

    const [currentUser, targetUser] = await Promise.all([
        User.findById(currentUserId),
        User.findById(targetUserId)
    ])

    return { currentUser, targetUser }
}

export const getFollowersService = async (userId, offset = 0, limit = 10) => {
    const follows = await Follow.find({ following: userId })
        .populate('follower', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)

    return follows.map(follow => follow.follower)
}

export const getFolloweesService = async (userId, offset = 0, limit = 10) => {
    const follows = await Follow.find({ follower: userId })
        .populate('following', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)

    return follows.map(follow => follow.following)
}

export const checkFollowStatusService = async (currentUserId, targetUserId) => {
    const follow = await Follow.findOne({ follower: currentUserId, following: targetUserId })
    return !!follow
}

export const getFriendsService = async (userId, offset = 0, limit = 10) => {
    // Find users that the current user follows
    const following = await Follow.find({ follower: userId })
        .select('following')
        .skip(offset)
        .limit(limit)
    
    const followingIds = following.map(f => f.following)
    
    // Find users who also follow the current user (mutual follows)
    const followers = await Follow.find({ following: userId, follower: { $in: followingIds } })
        .populate('follower', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
    
    return followers.map(f => f.follower)
}
