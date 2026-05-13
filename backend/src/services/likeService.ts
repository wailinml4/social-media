import Like, { ILike } from '../models/Like.js'
import Post, { IPost } from '../models/Post.js'
import { createNotificationService } from './notificationService.js'

export const likePostService = async ({ postId, userId }: { postId: string; userId: string }): Promise<IPost> => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }
  const existingLike = await Like.findOne({ user: userId, post: postId })
  if (existingLike) return post

  await Like.create({ user: userId, post: postId })
  post.likeCount += 1
  await post.save()

  const authorIdString = String(post.author)
  if (authorIdString !== userId) {
    try {
      await createNotificationService({ recipientId: authorIdString, senderId: userId, type: 'like', postId })
    } catch (err) {
      console.error('Failed to create like notification:', err)
    }
  }

  return post
}

export const unlikePostService = async ({ postId, userId }: { postId: string; userId: string }): Promise<IPost> => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
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

export const getPostLikeCountService = async ({ postId }: { postId: string }): Promise<number> => {
  const post = await Post.findById(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }
  return post.likeCount
}

export const checkLikeStatusService = async ({ postId, userId }: { postId: string; userId: string }): Promise<boolean> => {
  const like = await Like.findOne({ user: userId, post: postId })
  return Boolean(like)
}
