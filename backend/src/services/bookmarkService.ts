import Bookmark, { IBookmark } from '../models/Bookmark.js'
import Post from '../models/Post.js'
import mongoose from 'mongoose'

export const bookmarkPostService = async ({ postId, userId }: { postId: string; userId: string }) => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
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

export const unbookmarkPostService = async ({ postId, userId }: { postId: string; userId: string }) => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }

  const bookmark = await Bookmark.findOneAndDelete({ user: userId, post: postId })
  if (bookmark) {
    post.bookmarkCount = Math.max(0, post.bookmarkCount - 1)
    await post.save()
  }

  return post
}

export const getUserBookmarkedPostsService = async ({
  userId,
  page = 1,
  limit = 10,
}: {
  userId: string
  page?: number
  limit?: number
}) => {
  const skip = (page - 1) * limit
  const bookmarks = await Bookmark.find({ user: userId })
    .populate('post')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<Pick<IBookmark, 'post'>[]>()

  const total = await Bookmark.countDocuments({ user: userId })
  const posts = bookmarks.map(bookmark => bookmark.post).filter((p): p is mongoose.Types.ObjectId => p !== null)

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getPostBookmarkCountService = async ({ postId }: { postId: string }) => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }
  return post.bookmarkCount
}

export const checkBookmarkStatusService = async ({ postId, userId }: { postId: string; userId: string }) => {
  const bookmark = await Bookmark.findOne({ user: userId, post: postId })
  return !!bookmark
}
