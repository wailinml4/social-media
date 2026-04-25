import {
    getCurrentProfileService,
    getProfileByIdService,
    updateProfileService,
    getSuggestedUsersService
} from "../services/userService.js"

export const getCurrentProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const user = await getCurrentProfileService(userId)

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user,
        })
    } catch (error) {
        next(error)
    }
}

export const getProfileById = async (req, res, next) => {
    try {
        const { userId } = req.params
        const user = await getProfileByIdService(userId)

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user,
        })
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { userId: targetUserId } = req.params

        if (targetUserId && targetUserId !== userId) {
            const error = new Error("You can only update your own profile")
            error.statusCode = 403
            throw error
        }

        const { fullName, bio, profilePicture, coverPicture } = req.body || {}
        const user = await updateProfileService(userId, { fullName, bio, profilePicture, coverPicture })

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        })
    } catch (error) {
        next(error)
    }
}

export const getSuggestedUsers = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { limit = 5 } = req.query
        const users = await getSuggestedUsersService({ userId, limit: parseInt(limit) })

        return res.status(200).json({
            success: true,
            message: "Suggested users retrieved successfully",
            data: users,
        })
    } catch (error) {
        next(error)
    }
}

