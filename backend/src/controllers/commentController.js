import {
    createCommentService,
    getPostCommentsService,
    getCommentRepliesService,
    updateCommentService,
    deleteCommentService,
} from "../services/commentService.js"

export const createComment = async (req, res, next) => {
    try {
        const { postId } = req.params
        const { content, parentId } = req.body
        const userId = req.user.userId

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required",
            })
        }

        const comment = await createCommentService(postId, userId, content, parentId)

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: comment,
        })
    } catch (error) {
        next(error)
    }
}

export const getPostComments = async (req, res, next) => {
    try {
        const { postId } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 20

        const result = await getPostCommentsService(postId, page, limit)

        return res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

export const getCommentReplies = async (req, res, next) => {
    try {
        const { commentId } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const result = await getCommentRepliesService(commentId, page, limit)

        return res.status(200).json({
            success: true,
            message: "Replies retrieved successfully",
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

export const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params
        const { content } = req.body
        const userId = req.user.userId

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required",
            })
        }

        const comment = await updateCommentService(commentId, userId, content)

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: comment,
        })
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params
        const userId = req.user.userId

        const result = await deleteCommentService(commentId, userId)

        return res.status(200).json({
            success: true,
            message: result.message,
        })
    } catch (error) {
        next(error)
    }
}
