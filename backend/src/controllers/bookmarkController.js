import { bookmarkPostService, unbookmarkPostService, getUserBookmarkedPostsService, getPostBookmarkCountService, checkBookmarkStatusService } from "../services/bookmarkService.js"

export const bookmarkPost = async (req, res, next) => {
    try {
        const { postId } = req.params
        const userId = req.user.userId
        const post = await bookmarkPostService(postId, userId)

        return res.status(200).json({
            success: true,
            message: "Post bookmarked successfully",
            data: post,
        })
    } catch (error) {
        next(error)
    }
}

export const unbookmarkPost = async (req, res, next) => {
    try {
        const { postId } = req.params
        const userId = req.user.userId
        const post = await unbookmarkPostService(postId, userId)

        return res.status(200).json({
            success: true,
            message: "Post unbookmarked successfully",
            data: post,
        })
    } catch (error) {
        next(error)
    }
}

export const getUserBookmarkedPosts = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { page = 1, limit = 10 } = req.query
        const result = await getUserBookmarkedPostsService(userId, parseInt(page), parseInt(limit))

        return res.status(200).json({
            success: true,
            message: "User bookmarked posts retrieved successfully",
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

export const getPostBookmarkCount = async (req, res, next) => {
    try {
        const { postId } = req.params
        const bookmarkCount = await getPostBookmarkCountService(postId)

        return res.status(200).json({
            success: true,
            message: "Post bookmark count retrieved successfully",
            data: { bookmarkCount },
        })
    } catch (error) {
        next(error)
    }
}

export const checkBookmarkStatus = async (req, res, next) => {
    try {
        const { postId } = req.params
        const userId = req.user.userId
        const isBookmarked = await checkBookmarkStatusService(postId, userId)

        return res.status(200).json({
            success: true,
            message: "Bookmark status retrieved successfully",
            data: { isBookmarked },
        })
    } catch (error) {
        next(error)
    }
}
