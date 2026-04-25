import { followUserService, unfollowUserService, getFollowersService, getFolloweesService, checkFollowStatusService, getFriendsService } from "../services/followService.js"

export const followUser = async (req, res, next) => {
    try {
        const currentUserId = req.user.userId
        const { userId: targetUserId } = req.params

        const { currentUser, targetUser } = await followUserService(currentUserId, targetUserId)

        return res.status(200).json({
            success: true,
            message: "User followed successfully",
            data: {
                followingCount: currentUser.followingCount,
                followerCount: targetUser.followerCount
            }
        })
    } catch (error) {
        next(error)
    }
}

export const unfollowUser = async (req, res, next) => {
    try {
        const currentUserId = req.user.userId
        const { userId: targetUserId } = req.params

        const { currentUser, targetUser } = await unfollowUserService(currentUserId, targetUserId)

        return res.status(200).json({
            success: true,
            message: "User unfollowed successfully",
            data: {
                followingCount: currentUser.followingCount,
                followerCount: targetUser.followerCount
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getFollowers = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { offset = 0, limit = 10 } = req.query
        const followers = await getFollowersService(userId, parseInt(offset), parseInt(limit))

        return res.status(200).json({
            success: true,
            message: "Followers retrieved successfully",
            data: followers,
        })
    } catch (error) {
        next(error)
    }
}

export const getFollowees = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { offset = 0, limit = 10 } = req.query
        const followees = await getFolloweesService(userId, parseInt(offset), parseInt(limit))

        return res.status(200).json({
            success: true,
            message: "Followees retrieved successfully",
            data: followees,
        })
    } catch (error) {
        next(error)
    }
}

export const checkFollowStatus = async (req, res, next) => {
    try {
        const currentUserId = req.user.userId
        const { userId: targetUserId } = req.params

        const isFollowing = await checkFollowStatusService(currentUserId, targetUserId)

        return res.status(200).json({
            success: true,
            data: { isFollowing },
        })
    } catch (error) {
        next(error)
    }
}

export const getFriends = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { offset = 0, limit = 10 } = req.query
        const friends = await getFriendsService(userId, parseInt(offset), parseInt(limit))

        return res.status(200).json({
            success: true,
            message: "Friends retrieved successfully",
            data: friends,
        })
    } catch (error) {
        next(error)
    }
}
