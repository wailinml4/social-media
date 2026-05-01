import Like from "../models/Like.js"
import Post from "../models/Post.js"
import { createNotificationService } from "./notificationService.js"

export const likePostService = async (postId, userId) => {
    const post = await Post.findById(postId)
    if (!post) {
        const error = new Error("Post not found")
        error.statusCode = 404
        throw error
    }

    const existingLike = await Like.findOne({ user: userId, post: postId })
    if (existingLike) {
        return post
    }

    await Like.create({ user: userId, post: postId })
    post.likeCount += 1
    await post.save()

    // Create notification for post author (if not liking own post)
    if (post.author.toString() !== userId) {
        try {
            await createNotificationService(post.author, userId, 'like', postId)
        } catch (error) {
            // Don't throw error if notification creation fails
            console.error('Failed to create like notification:', error)
        }
    }

    return post
}

export const unlikePostService = async (postId, userId) => {
    const post = await Post.findById(postId)
    if (!post) {
        const error = new Error("Post not found")
        error.statusCode = 404
        throw error
    }

    const like = await Like.findOneAndDelete({ user: userId, post: postId })
    if (like) {
        post.likeCount = Math.max(0, post.likeCount - 1)
        await post.save()
    }

    return post
}

export const getPostLikeCountService = async (postId) => {
    const post = await Post.findById(postId)
    if (!post) {
        const error = new Error("Post not found")
        error.statusCode = 404
        throw error
    }
    return post.likeCount
}

export const checkLikeStatusService = async (postId, userId) => {
    const like = await Like.findOne({ user: userId, post: postId })
    return !!like
}
