import Post from '../models/Post.js'
import User from '../models/User.js'
import Bookmark, { IBookmark } from '../models/Bookmark.js'
import Like, { ILike } from '../models/Like.js'
import Follow, { IFollow } from '../models/Follow.js'
import mongoose from 'mongoose'

interface CreatePostInput {
  description?: string
  author: string
  media?: Array<{ url: string; type?: string }>
  images?: string[]
}

interface UpdatePostInput {
  postId: string
  description?: string
  media?: Array<{ url: string; type?: string }>
  images?: string[]
}

interface PostPaginationInput {
  page?: number
  limit?: number
  userId?: string
}

type BookmarkWithPost = { post: { _id: mongoose.Types.ObjectId } | null }
type LikeWithPost = { post: { _id: mongoose.Types.ObjectId } | null }

export const createPostService = async ({ description, author, media = [], images = [] }: CreatePostInput) => {
  const normalizedMedia =
    Array.isArray(media) && media.length > 0
      ? media
      : (images || []).map((url: string) => ({
          url,
          type: /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image',
        }))

  const post = await Post.create({
    description,
    media: normalizedMedia,
    author,
  })
  await User.updateOne({ _id: author }, { $inc: { postCount: 1 } })
  const populatedPost = await Post.findById(post._id).populate('author', 'fullName email profilePicture')
  return populatedPost
}

export const getAllPostsService = async ({ page = 1, limit = 10 }: PostPaginationInput = {}) => {
  const p = Number(page || 1)
  const l = Number(limit || 10)
  const skip = (p - 1) * l
  const posts = await Post.find().populate('author', 'fullName email profilePicture').sort({ createdAt: -1 }).skip(skip).limit(l)

  const total = await Post.countDocuments()

  return {
    posts,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export const getFollowingPostsService = async ({ userId, page = 1, limit = 10 }: PostPaginationInput = {}) => {
  const follows = await Follow.find({ follower: userId }).lean<Pick<IFollow, 'following'>[]>()
  const followingIds = follows.map(f => f.following)

  const p = Number(page || 1)
  const l = Number(limit || 10)
  const skip = (p - 1) * l
  const posts = await Post.find({ author: { $in: followingIds } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(l)

  const total = await Post.countDocuments({ author: { $in: followingIds } })

  return {
    posts,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export const getExplorePostsService = async ({ userId, page = 1, limit = 10 }: PostPaginationInput = {}) => {
  const follows = await Follow.find({ follower: userId }).lean<Pick<IFollow, 'following'>[]>()
  const followingIds = follows.map(f => f.following)

  const excludeIds = [userId, ...followingIds].filter((id): id is string | mongoose.Types.ObjectId => id !== undefined)

  const p = Number(page || 1)
  const l = Number(limit || 10)
  const skip = (p - 1) * l
  const posts = await Post.find({ author: { $nin: excludeIds } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(l)

  const total = await Post.countDocuments({ author: { $nin: excludeIds } })

  return {
    posts,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export const getUserPostsService = async ({ userId, page = 1, limit = 10 }: PostPaginationInput = {}) => {
  const p = Number(page || 1)
  const l = Number(limit || 10)
  const skip = (p - 1) * l
  const posts = await Post.find({ author: userId })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(l)

  const total = await Post.countDocuments({ author: userId })

  return {
    posts,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export const getBookmarkedPostsService = async ({ userId, page = 1, limit = 10 }: PostPaginationInput = {}) => {
  const p = Number(page || 1)
  const l = Number(limit || 10)
  const skip = (p - 1) * l
  const bookmarks = await Bookmark.find({ user: userId })
    .populate('post')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(l)
    .lean<BookmarkWithPost[]>()

  const validBookmarks = bookmarks.filter(b => b.post !== null)

  const posts = await Post.find({ _id: { $in: validBookmarks.map(b => b.post!._id) } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })

  const total = await Bookmark.countDocuments({ user: userId })

  return {
    posts,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export const getLikedPostsService = async ({ userId, page = 1, limit = 10 }: PostPaginationInput = {}) => {
  const p = Number(page || 1)
  const l = Number(limit || 10)
  const skip = (p - 1) * l
  const likes = await Like.find({ user: userId }).populate('post').sort({ createdAt: -1 }).skip(skip).limit(l).lean<LikeWithPost[]>()

  const validLikes = likes.filter(lLike => lLike.post !== null)
  const likedPostIds = validLikes.map(lLike => lLike.post!._id.toString())

  const posts = await Post.find({ _id: { $in: likedPostIds } }).populate('author', 'fullName email profilePicture')

  const postsById = new Map(posts.map(post => [String(post._id), post]))
  const orderedPosts = likedPostIds.map(postId => postsById.get(postId)).filter((p): p is NonNullable<typeof p> => p !== undefined)

  const total = await Like.countDocuments({ user: userId })

  return {
    posts: orderedPosts,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}

export const getPostByIdService = async ({ postId }: { postId: string }) => {
  const post = await Post.findById(postId).populate('author', 'fullName email profilePicture')
  return post
}

export const updatePostService = async ({ postId, description, media = [], images = [] }: UpdatePostInput) => {
  const normalizedMedia =
    Array.isArray(media) && media.length > 0
      ? media
      : (images || []).map((url: string) => ({
          url,
          type: /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image',
        }))
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      description,
      media: normalizedMedia,
    },
    { new: true, runValidators: true },
  )
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }
  const populatedPost = await Post.findById(post._id).populate('author', 'fullName email profilePicture')
  return populatedPost
}

export const deletePostService = async ({ postId }: { postId: string }) => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }

  const authorId = post.author
  await Post.findByIdAndDelete(postId)

  await User.updateOne({ _id: authorId }, { $inc: { postCount: -1 } })

  return post
}

export const getFriendsPostsService = async ({ userId, page = 1, limit = 10 }: PostPaginationInput = {}) => {
  const following = await Follow.find({ follower: userId }).select('following').lean<Pick<IFollow, 'following'>[]>()

  const followingIds = following.map(f => f.following)

  const followers = await Follow.find({
    following: userId,
    follower: { $in: followingIds },
  })
    .select('follower')
    .lean<Pick<IFollow, 'follower'>[]>()

  const friendIds = followers.map(f => f.follower)

  const p = Number(page || 1)
  const l = Number(limit || 10)
  const skip = (p - 1) * l
  const posts = await Post.find({ author: { $in: friendIds } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(l)

  const total = await Post.countDocuments({ author: { $in: friendIds } })

  return {
    posts,
    pagination: {
      page: p,
      limit: l,
      total,
      pages: Math.ceil(total / l),
    },
  }
}
