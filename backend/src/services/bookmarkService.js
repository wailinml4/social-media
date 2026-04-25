import Bookmark from "../models/Bookmark.js"
import Post from "../models/Post.js"

export const bookmarkPostService = async (postId, userId) => {
    const post = await Post.findById(postId)
    if (!post) {
        throw new Error("Post not found")
    }

    const existingBookmark = await Bookmark.findOne({ user: userId, post: postId })
    if (existingBookmark) {
        return post
    }

    await Bookmark.create({ user: userId, post: postId })
    post.bookmarkCount += 1
    await post.save()

    return post
}

export const unbookmarkPostService = async (postId, userId) => {
    const post = await Post.findById(postId)
    if (!post) {
        throw new Error("Post not found")
    }

    const bookmark = await Bookmark.findOneAndDelete({ user: userId, post: postId })
    if (bookmark) {
        post.bookmarkCount = Math.max(0, post.bookmarkCount - 1)
        await post.save()
    }

    return post
}

export const getUserBookmarkedPostsService = async (userId, offset = 0, limit = 10) => {
    const bookmarks = await Bookmark.find({ user: userId })
        .populate('post')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
    return bookmarks.map(bookmark => bookmark.post)
}

export const getPostBookmarkCountService = async (postId) => {
    const post = await Post.findById(postId)
    if (!post) {
        throw new Error("Post not found")
    }
    return post.bookmarkCount
}

export const checkBookmarkStatusService = async (postId, userId) => {
    const bookmark = await Bookmark.findOne({ user: userId, post: postId })
    return !!bookmark
}
