import Post from "../models/Post.js"
import User from "../models/User.js"
import Bookmark from "../models/Bookmark.js"
import Follow from "../models/Follow.js"

export const createPostService = async ({ content, author, images }) => {
    const post = await Post.create({ content, author, images })
    await User.updateOne({ _id: author }, { $inc: { postCount: 1 } })
    const populatedPost = await Post.findById(post._id).populate('author', 'fullName email profilePicture')
    return populatedPost
}

export const getAllPostsService = async ({ offset = 0, limit = 10, filter = 'for_you' } = {}) => {
    const posts = await Post.find()
        .populate('author', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
    return posts
}

export const getFollowingPostsService = async ({ userId, offset = 0, limit = 10 } = {}) => {
    const follows = await Follow.find({ follower: userId })
    const followingIds = follows.map(f => f.following)
    
    const posts = await Post.find({ author: { $in: followingIds } })
        .populate('author', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
    return posts
}

export const getUserPostsService = async ({ userId, offset = 0, limit = 10 } = {}) => {
    const posts = await Post.find({ author: userId })
        .populate('author', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
    return posts
}

export const getBookmarkedPostsService = async ({ userId, offset = 0, limit = 10 } = {}) => {
    const bookmarks = await Bookmark.find({ user: userId })
        .populate('post')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
    
    // Filter out bookmarks where post is null (orphaned bookmarks)
    const validBookmarks = bookmarks.filter(b => b.post !== null)
    
    const posts = await Post.find({ _id: { $in: validBookmarks.map(b => b.post._id) } })
        .populate('author', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
    
    return posts
}

export const getPostByIdService = async (postId) => {
    const post = await Post.findById(postId)
        .populate('author', 'fullName email profilePicture')
    return post
}

export const updatePostService = async (postId, { content, images }) => {
    const post = await Post.findByIdAndUpdate(
        postId,
        { content, images },
        { new: true, runValidators: true }
    )
    const populatedPost = await Post.findById(post._id).populate('author', 'fullName email profilePicture')
    return populatedPost
}

export const deletePostService = async (postId) => {
    const post = await Post.findById(postId)
    if (!post) {
        throw new Error("Post not found")
    }

    const authorId = post.author
    await Post.findByIdAndDelete(postId)

    // Decrement user's postCount
    await User.updateOne({ _id: authorId }, { $inc: { postCount: -1 } })

    return post
}

export const getFriendsPostsService = async ({ userId, offset = 0, limit = 10 }) => {
    const Follow = (await import('../models/Follow.js')).default

    // Find users that the current user follows
    const following = await Follow.find({ follower: userId })
        .select('following')

    const followingIds = following.map(f => f.following)

    // Find users who also follow the current user (mutual follows)
    const followers = await Follow.find({ following: userId, follower: { $in: followingIds } })
        .select('follower')

    const friendIds = followers.map(f => f.follower)

    // Get posts from friends with pagination
    const posts = await Post.find({ author: { $in: friendIds } })
        .populate('author', 'fullName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)

    return posts
}
