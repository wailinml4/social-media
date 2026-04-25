import {
    createPostService,
    getAllPostsService,
    getFollowingPostsService,
    getUserPostsService,
    getBookmarkedPostsService,
    getPostByIdService,
    updatePostService,
    deletePostService,
    getFriendsPostsService
} from "../services/postService.js"

export const createPost = async (req, res, next) => {
    try {
        const { content, images } = req.body
        const author = req.user.userId

        // Validate that at least content or images is provided
        if (!content?.trim() && (!images || images.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Post must have content or images",
            })
        }

        const post = await createPostService({ content, author, images })

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post,
        })
    } catch (error) {
        next(error)
    }
}

export const getAllPosts = async (req, res, next) => {
    try {
        const { offset = 0, limit = 10, filter = 'for_you' } = req.query
        const posts = await getAllPostsService({ offset: parseInt(offset), limit: parseInt(limit), filter })

        return res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            data: posts,
        })
    } catch (error) {
        next(error)
    }
}

export const getFollowingPosts = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { offset = 0, limit = 10 } = req.query
        const posts = await getFollowingPostsService({ userId, offset: parseInt(offset), limit: parseInt(limit) })

        return res.status(200).json({
            success: true,
            message: "Following posts retrieved successfully",
            data: posts,
        })
    } catch (error) {
        next(error)
    }
}

export const getUserPosts = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { offset = 0, limit = 10 } = req.query
        const posts = await getUserPostsService({ userId, offset: parseInt(offset), limit: parseInt(limit) })

        return res.status(200).json({
            success: true,
            message: "User posts retrieved successfully",
            data: posts,
        })
    } catch (error) {
        next(error)
    }
}

export const getBookmarkedPosts = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { offset = 0, limit = 10 } = req.query
        const posts = await getBookmarkedPostsService({ userId, offset: parseInt(offset), limit: parseInt(limit) })

        return res.status(200).json({
            success: true,
            message: "Bookmarked posts retrieved successfully",
            data: posts,
        })
    } catch (error) {
        next(error)
    }
}

export const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params
        const post = await getPostByIdService(postId)

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Post retrieved successfully",
            data: post,
        })
    } catch (error) {
        next(error)
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params
        const { content, images } = req.body
        const userId = req.user.userId

        const existingPost = await getPostByIdService(postId)
        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }

        if (existingPost.author._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own posts",
            })
        }

        const post = await updatePostService(postId, { content, images })

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: post,
        })
    } catch (error) {
        next(error)
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params
        const userId = req.user.userId

        const post = await getPostByIdService(postId)
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        }

        if (post.author._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts",
            })
        }

        await deletePostService(postId)

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const getFriendsPosts = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { offset = 0, limit = 10 } = req.query
        const posts = await getFriendsPostsService({ userId, offset: parseInt(offset), limit: parseInt(limit) })

        return res.status(200).json({
            success: true,
            message: "Friends posts retrieved successfully",
            data: posts,
        })
    } catch (error) {
        next(error)
    }
}
