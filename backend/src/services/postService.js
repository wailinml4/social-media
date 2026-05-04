import Post from '../models/Post.js'
import User from '../models/User.js'
import Bookmark from '../models/Bookmark.js'
import Like from '../models/Like.js'
import Follow from '../models/Follow.js'

export const createPostService = async ({ description, author, media = [], images = [] }) => {
  const normalizedMedia =
    Array.isArray(media) && media.length > 0
      ? media
      : (images || []).map(url => ({
          url,
          type: /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image',
        }))

  const post = await Post.create({
    description,
    media: normalizedMedia,
    author,
  })
  await User.updateOne({ _id: author }, { $inc: { postCount: 1 } })
  const populatedPost = await Post.findById(post._id).populate(
    'author',
    'fullName email profilePicture',
  )
  return populatedPost
}

export const getAllPostsService = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit
  const posts = await Post.find()
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Post.countDocuments()

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

export const getFollowingPostsService = async ({ userId, page = 1, limit = 10 } = {}) => {
  const follows = await Follow.find({ follower: userId })
  const followingIds = follows.map(f => f.following)

  const skip = (page - 1) * limit
  const posts = await Post.find({ author: { $in: followingIds } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Post.countDocuments({ author: { $in: followingIds } })

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

export const getExplorePostsService = async ({ userId, page = 1, limit = 10 } = {}) => {
  // Find users that the current user follows
  const follows = await Follow.find({ follower: userId })
  const followingIds = follows.map(f => f.following)

  // Exclude current user and users they already follow
  const excludeIds = [userId, ...followingIds]

  const skip = (page - 1) * limit
  const posts = await Post.find({ author: { $nin: excludeIds } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Post.countDocuments({ author: { $nin: excludeIds } })

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

export const getUserPostsService = async ({ userId, page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit
  const posts = await Post.find({ author: userId })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Post.countDocuments({ author: userId })

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

export const getBookmarkedPostsService = async ({ userId, page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit
  const bookmarks = await Bookmark.find({ user: userId })
    .populate('post')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  // Filter out bookmarks where post is null (orphaned bookmarks)
  const validBookmarks = bookmarks.filter(b => b.post !== null)

  const posts = await Post.find({ _id: { $in: validBookmarks.map(b => b.post._id) } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })

  const total = await Bookmark.countDocuments({ user: userId })

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

export const getLikedPostsService = async ({ userId, page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit
  const likes = await Like.find({ user: userId })
    .populate('post')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const validLikes = likes.filter(l => l.post !== null)
  const likedPostIds = validLikes.map(l => l.post._id.toString())

  const posts = await Post.find({ _id: { $in: likedPostIds } }).populate(
    'author',
    'fullName email profilePicture',
  )

  const postsById = new Map(posts.map(post => [post._id.toString(), post]))
  const orderedPosts = likedPostIds.map(postId => postsById.get(postId)).filter(Boolean)

  const total = await Like.countDocuments({ user: userId })

  return {
    posts: orderedPosts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const getPostByIdService = async postId => {
  const post = await Post.findById(postId).populate('author', 'fullName email profilePicture')
  return post
}

export const updatePostService = async (postId, { description, media = [], images = [] }) => {
  const normalizedMedia =
    Array.isArray(media) && media.length > 0
      ? media
      : (images || []).map(url => ({
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
  const populatedPost = await Post.findById(post._id).populate(
    'author',
    'fullName email profilePicture',
  )
  return populatedPost
}

export const deletePostService = async postId => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }

  const authorId = post.author
  await Post.findByIdAndDelete(postId)

  // Decrement user's postCount
  await User.updateOne({ _id: authorId }, { $inc: { postCount: -1 } })

  return post
}

export const getFriendsPostsService = async ({ userId, page = 1, limit = 10 }) => {
  const Follow = (await import('../models/Follow.js')).default

  // Find users that the current user follows
  const following = await Follow.find({ follower: userId }).select('following')

  const followingIds = following.map(f => f.following)

  // Find users who also follow the current user (mutual follows)
  const followers = await Follow.find({
    following: userId,
    follower: { $in: followingIds },
  }).select('follower')

  const friendIds = followers.map(f => f.follower)

  // Get posts from friends with pagination
  const skip = (page - 1) * limit
  const posts = await Post.find({ author: { $in: friendIds } })
    .populate('author', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Post.countDocuments({ author: { $in: friendIds } })

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
