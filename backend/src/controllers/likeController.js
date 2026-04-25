import { likePostService, unlikePostService, getPostLikeCountService, checkLikeStatusService } from "../services/likeService.js"

export const likePost = async (req, res, next) => {
    try {
        const { postId } = req.params
        const userId = req.user.userId
        const post = await likePostService(postId, userId)

        return res.status(200).json({
            success: true,
            message: "Post liked successfully",
            data: post,
        })
    } catch (error) {
        next(error)
    }
}

export const unlikePost = async (req, res, next) => {
    try {
        const { postId } = req.params
        const userId = req.user.userId
        const post = await unlikePostService(postId, userId)

        return res.status(200).json({
            success: true,
            message: "Post unliked successfully",
            data: post,
        })
    } catch (error) {
        next(error)
    }
}

export const getPostLikeCount = async (req, res, next) => {
    try {
        const { postId } = req.params
        const likeCount = await getPostLikeCountService(postId)

        return res.status(200).json({
            success: true,
            message: "Post like count retrieved successfully",
            data: { likeCount },
        })
    } catch (error) {
        next(error)
    }
}

export const checkLikeStatus = async (req, res, next) => {
    try {
        const { postId } = req.params
        const userId = req.user.userId
        const isLiked = await checkLikeStatusService(postId, userId)

        return res.status(200).json({
            success: true,
            data: { isLiked },
        })
    } catch (error) {
        next(error)
    }
}
