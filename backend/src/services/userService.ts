import User from '../models/User.js'
import Post from '../models/Post.js'
import Follow, { IFollow } from '../models/Follow.js'
import mongoose from 'mongoose'

export const getCurrentProfileService = async ({ userId }: { userId: string }) => {
  const user = await User.findById(userId).select(
    '-password -verificationCode -verificationCodeExpiresAt -resetPasswordToken -resetPasswordTokenExpiresAt',
  )
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const postCount = await Post.countDocuments({ author: userId })
  user.postCount = postCount
  await User.updateOne({ _id: userId }, { postCount })

  const following = await Follow.find({ follower: userId }).select('following').lean<Pick<IFollow, 'following'>[]>()
  const followingIds = following.map(f => f.following)
  const followers = await Follow.find({ following: userId, follower: { $in: followingIds } })
  const friendsCount = followers.length
  user.friendsCount = friendsCount
  await User.updateOne({ _id: userId }, { friendsCount })

  return user
}

export const getProfileByIdService = async ({ userId }: { userId: string }) => {
  const user = await User.findById(userId).select(
    '-password -verificationCode -verificationCodeExpiresAt -resetPasswordToken -resetPasswordTokenExpiresAt',
  )
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const postCount = await Post.countDocuments({ author: userId })
  user.postCount = postCount
  await User.updateOne({ _id: userId }, { postCount })

  const following = await Follow.find({ follower: userId }).select('following').lean<Pick<IFollow, 'following'>[]>()
  const followingIds = following.map(f => f.following)
  const followers = await Follow.find({ following: userId, follower: { $in: followingIds } })
  const friendsCount = followers.length
  user.friendsCount = friendsCount
  await User.updateOne({ _id: userId }, { friendsCount })

  return user
}

export const updateProfileService = async ({
  userId,
  fullName,
  username,
  bio,
  profilePicture,
  coverPicture,
}: {
  userId: string
  fullName?: string
  username?: string
  bio?: string
  profilePicture?: string
  coverPicture?: string
}) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  if (username !== undefined) {
    const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: userId } })
    if (existing) {
      const error = new Error('Username already taken')
      error.statusCode = 400
      throw error
    }
    user.username = username.toLowerCase()
  }
  if (fullName !== undefined) user.fullName = fullName
  if (bio !== undefined) user.bio = bio
  if (profilePicture !== undefined) user.profilePicture = profilePicture
  if (coverPicture !== undefined) user.coverPicture = coverPicture

  await user.save()
  return user
}

export const getSuggestedUsersService = async ({ userId, page = 1, limit = 5 }: { userId: string; page?: number; limit?: number }) => {
  const following = await Follow.find({ follower: userId }).select('following').lean<Pick<IFollow, 'following'>[]>()
  const followingIds = following.map(f => f.following)

  const excludedIds: Array<mongoose.Types.ObjectId | string> = [...followingIds, userId]

  const skip = (page - 1) * limit
  const suggestedUsers = await User.find({
    _id: { $nin: excludedIds },
  })
    .select('fullName email profilePicture bio')
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments({ _id: { $nin: excludedIds } })

  return {
    users: suggestedUsers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const searchUsersService = async ({ userId, query = '', limit = 10 }: { userId: string; query?: string; limit?: number }) => {
  const searchTerm = query.trim()
  if (!searchTerm) {
    return { users: [] }
  }

  const regex = new RegExp(searchTerm, 'i')
  const users = await User.find({
    _id: { $ne: userId },
    $or: [{ fullName: regex }, { email: regex }],
  })
    .select('fullName email profilePicture bio')
    .limit(limit)

  return { users }
}
