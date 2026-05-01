import Comment from "../models/Comment.js"
import Post from "../models/Post.js"
import { createNotificationService } from "./notificationService.js"

const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
}

export const createCommentService = async (postId, userId, content, parentId = null) => {
    const post = await Post.findById(postId)
    if (!post) {
        const error = new Error("Post not found")
        error.statusCode = 404
        throw error
    }

    if (parentId) {
        const parentComment = await Comment.findById(parentId)
        if (!parentComment) {
            const error = new Error("Parent comment not found")
            error.statusCode = 404
            throw error
        }
        if (parentComment.post.toString() !== postId) {
            const error = new Error("Parent comment does not belong to this post")
            error.statusCode = 400
            throw error
        }
    }

    const comment = await Comment.create({
        user: userId,
        post: postId,
        content,
        parent: parentId,
    })

    // Increment post comment count
    post.commentCount = (post.commentCount || 0) + 1
    await post.save()

    // Create notification for post author (if not commenting on own post)
    if (post.author.toString() !== userId) {
        try {
            const notificationType = parentId ? 'reply' : 'comment'
            await createNotificationService(post.author, userId, notificationType, postId, comment._id)
        } catch (error) {
            // Don't throw error if notification creation fails
            console.error('Failed to create comment notification:', error)
        }
    }

    // Populate user data
    await comment.populate("user", "fullName email profilePicture")

    // Transform to match frontend expectations
    const transformedComment = {
        _id: comment._id,
        id: comment._id,
        text: comment.content,
        time: formatTime(comment.createdAt),
        likes: 0,
        user: {
            _id: comment.user._id,
            name: comment.user.fullName,
            handle: comment.user.email?.split('@')[0] || 'user',
            avatar: comment.user.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comment.user.fullName,
        },
        replies: []
    }

    return transformedComment
}

export const getPostCommentsService = async (postId, page = 1, limit = 20) => {
    const post = await Post.findById(postId)
    if (!post) {
        const error = new Error("Post not found")
        error.statusCode = 404
        throw error
    }

    const skip = (page - 1) * limit
    const comments = await Comment.find({ post: postId, parent: null })
        .populate("user", "fullName email profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    const total = await Comment.countDocuments({ post: postId, parent: null })

    // Transform comments to match frontend expectations
    const transformedComments = comments.map(comment => ({
        _id: comment._id,
        id: comment._id,
        text: comment.content,
        time: formatTime(comment.createdAt),
        likes: 0,
        user: {
            _id: comment.user._id,
            name: comment.user.fullName,
            handle: comment.user.email?.split('@')[0] || 'user',
            avatar: comment.user.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comment.user.fullName,
        },
        replies: []
    }))

    return {
        comments: transformedComments,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    }
}

export const getCommentRepliesService = async (commentId, page = 1, limit = 10) => {
    const parentComment = await Comment.findById(commentId)
    if (!parentComment) {
        const error = new Error("Comment not found")
        error.statusCode = 404
        throw error
    }

    const skip = (page - 1) * limit
    const replies = await Comment.find({ parent: commentId })
        .populate("user", "fullName email profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    const total = await Comment.countDocuments({ parent: commentId })

    // Transform replies to match frontend expectations
    const transformedReplies = replies.map(reply => ({
        _id: reply._id,
        id: reply._id,
        text: reply.content,
        time: formatTime(reply.createdAt),
        likes: 0,
        user: {
            _id: reply.user._id,
            name: reply.user.fullName,
            handle: reply.user.email?.split('@')[0] || 'user',
            avatar: reply.user.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + reply.user.fullName,
        },
        replies: []
    }))

    return {
        replies: transformedReplies,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    }
}

export const updateCommentService = async (commentId, userId, content) => {
    const comment = await Comment.findById(commentId)
    if (!comment) {
        const error = new Error("Comment not found")
        error.statusCode = 404
        throw error
    }

    if (comment.user.toString() !== userId) {
        const error = new Error("You can only edit your own comments")
        error.statusCode = 403
        throw error
    }

    comment.content = content
    await comment.save()

    // Populate user data
    await comment.populate("user", "fullName email profilePicture")

    // Transform to match frontend expectations
    const transformedComment = {
        _id: comment._id,
        id: comment._id,
        text: comment.content,
        time: formatTime(comment.createdAt),
        likes: 0,
        user: {
            _id: comment.user._id,
            name: comment.user.fullName,
            handle: comment.user.email?.split('@')[0] || 'user',
            avatar: comment.user.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comment.user.fullName,
        },
        replies: []
    }

    return transformedComment
}

export const deleteCommentService = async (commentId, userId) => {
    const comment = await Comment.findById(commentId)
    if (!comment) {
        const error = new Error("Comment not found")
        error.statusCode = 404
        throw error
    }

    if (comment.user.toString() !== userId) {
        const error = new Error("You can only delete your own comments")
        error.statusCode = 403
        throw error
    }

    const post = await Post.findById(comment.post)
    if (!post) {
        const error = new Error("Post not found")
        error.statusCode = 404
        throw error
    }

    // Delete all replies to this comment
    const replyCount = await Comment.countDocuments({ parent: commentId })
    await Comment.deleteMany({ parent: commentId })

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId)

    // Decrement post comment count (comment + replies)
    post.commentCount = Math.max(0, (post.commentCount || 0) - 1 - replyCount)
    await post.save()

    return { message: "Comment deleted successfully" }
}

