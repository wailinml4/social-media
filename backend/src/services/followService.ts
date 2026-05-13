import mongoose from 'mongoose'
import User, { IUser } from '../models/User.js'
import Follow, { IFollow } from '../models/Follow.js'
import { createNotificationService } from './notificationService.js'
import normalizePagination from '../utils/pagination.js'

export const followUserService = async ({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string
  targetUserId: string
}): Promise<{ currentUser: IUser | null; targetUser: IUser | null }> => {
  if (currentUserId === targetUserId) {
    const error = new Error('You cannot follow yourself')
    error.statusCode = 400
    throw error
  }

  const existingFollow = await Follow.findOne({ follower: currentUserId, following: targetUserId })
  if (existingFollow) {
    const error = new Error('Already following this user')
    error.statusCode = 400
    throw error
  }

  const targetFollowsCurrent = await Follow.findOne({ follower: targetUserId, following: currentUserId })

  await Follow.create({ follower: currentUserId, following: targetUserId })

  await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: 1 } })
  await User.updateOne({ _id: targetUserId }, { $inc: { followerCount: 1 } })

  try {
    await createNotificationService({ recipientId: targetUserId, senderId: currentUserId, type: 'follow' })
  } catch (error) {
    console.error('Failed to create follow notification:', error)
  }

  if (targetFollowsCurrent) {
    await User.updateOne({ _id: currentUserId }, { $inc: { friendsCount: 1 } })
    await User.updateOne({ _id: targetUserId }, { $inc: { friendsCount: 1 } })
  }

  const [currentUser, targetUser] = await Promise.all([User.findById(currentUserId), User.findById(targetUserId)])

  return { currentUser, targetUser }
}

export const unfollowUserService = async ({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string
  targetUserId: string
}): Promise<{ currentUser: IUser | null; targetUser: IUser | null }> => {
  const follow = await Follow.findOneAndDelete({
    follower: currentUserId,
    following: targetUserId,
  })

  if (follow) {
    const targetFollowsCurrent = await Follow.findOne({
      follower: targetUserId,
      following: currentUserId,
    })

    await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: -1 } })
    await User.updateOne({ _id: targetUserId }, { $inc: { followerCount: -1 } })

    if (targetFollowsCurrent) {
      await User.updateOne({ _id: currentUserId }, { $inc: { friendsCount: -1 } })
      await User.updateOne({ _id: targetUserId }, { $inc: { friendsCount: -1 } })
    }
  }

  const [currentUser, targetUser] = await Promise.all([User.findById(currentUserId), User.findById(targetUserId)])

  return { currentUser, targetUser }
}

export const getFollowersService = async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }) => {
  const { page: normalizedPage, limit: normalizedLimit, skip } = normalizePagination(page, limit)

  const follows = await Follow.find({ following: userId })
    .populate<{ follower: IUser }>('follower', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(normalizedLimit)

  const total = await Follow.countDocuments({ following: userId })
  const followers = follows.map(follow => follow.follower)

  return {
    followers,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages: Math.ceil(total / normalizedLimit),
    },
  }
}

export const getFolloweesService = async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }) => {
  const { page: normalizedPage, limit: normalizedLimit, skip } = normalizePagination(page, limit)

  const follows = await Follow.find({ follower: userId })
    .populate<{ following: IUser }>('following', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(normalizedLimit)

  const total = await Follow.countDocuments({ follower: userId })
  const followees = follows.map(follow => follow.following)

  return {
    followees,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages: Math.ceil(total / normalizedLimit),
    },
  }
}

export const checkFollowStatusService = async ({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string
  targetUserId: string
}): Promise<boolean> => {
  const follow = await Follow.findOne({ follower: currentUserId, following: targetUserId })
  return Boolean(follow)
}

export const getFriendsService = async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }) => {
  const { page: normalizedPage, limit: normalizedLimit, skip } = normalizePagination(page, limit)

  // Get IDs of users that userId follows
  const following = await Follow.find({ follower: userId }).select('following').lean<{ following: mongoose.Types.ObjectId | string }[]>()
  const followingIds = following.map(f => String(f.following))

  // Get IDs of users that follow userId
  const followers = await Follow.find({ following: userId }).select('follower').lean<{ follower: mongoose.Types.ObjectId | string }[]>()
  const followerIds = followers.map(f => String(f.follower))

  // Friends = mutual: userId follows them AND they follow userId
  const friendIds = followingIds.filter(id => followerIds.some(fid => fid === id))

  const friendDocs = await Follow.find({ follower: userId, following: { $in: friendIds } })
    .populate<{ following: IUser }>('following', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(normalizedLimit)

  const total = friendIds.length
  const friends = friendDocs.map(f => f.following)

  return {
    friends,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages: Math.ceil(total / normalizedLimit),
    },
  }
}
