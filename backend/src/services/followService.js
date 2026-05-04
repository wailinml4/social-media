import User from '../models/User.js'
import Follow from '../models/Follow.js'
import { createNotificationService } from './notificationService.js'

export const followUserService = async (currentUserId, targetUserId) => {
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

  // Check if target user already follows current user (mutual follow)
  const targetFollowsCurrent = await Follow.findOne({
    follower: targetUserId,
    following: currentUserId,
  })

  await Follow.create({ follower: currentUserId, following: targetUserId })

  await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: 1 } })
  await User.updateOne({ _id: targetUserId }, { $inc: { followerCount: 1 } })

  // Create notification for target user
  try {
    await createNotificationService(targetUserId, currentUserId, 'follow')
  } catch (error) {
    // Don't throw error if notification creation fails
    console.error('Failed to create follow notification:', error)
  }

  // If this creates a mutual follow, increment friendsCount for both
  if (targetFollowsCurrent) {
    await User.updateOne({ _id: currentUserId }, { $inc: { friendsCount: 1 } })
    await User.updateOne({ _id: targetUserId }, { $inc: { friendsCount: 1 } })
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findById(targetUserId),
  ])

  return { currentUser, targetUser }
}

export const unfollowUserService = async (currentUserId, targetUserId) => {
  const follow = await Follow.findOneAndDelete({
    follower: currentUserId,
    following: targetUserId,
  })

  if (follow) {
    // Check if target user follows current user (was a mutual follow)
    const targetFollowsCurrent = await Follow.findOne({
      follower: targetUserId,
      following: currentUserId,
    })

    await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: -1 } })
    await User.updateOne({ _id: targetUserId }, { $inc: { followerCount: -1 } })

    // If this was a mutual follow, decrement friendsCount for both
    if (targetFollowsCurrent) {
      await User.updateOne({ _id: currentUserId }, { $inc: { friendsCount: -1 } })
      await User.updateOne({ _id: targetUserId }, { $inc: { friendsCount: -1 } })
    }
  }

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId),
    User.findById(targetUserId),
  ])

  return { currentUser, targetUser }
}

const normalizePagination = (page = 1, limit = 10) => {
  const normalizedPage = Math.max(1, parseInt(page, 10) || 1)
  const normalizedLimit = Math.max(1, parseInt(limit, 10) || 10)
  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  }
}

export const getFollowersService = async (userId, page = 1, limit = 10) => {
  const { page: normalizedPage, limit: normalizedLimit, skip } = normalizePagination(page, limit)

  const follows = await Follow.find({ following: userId })
    .populate('follower', 'fullName email profilePicture')
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

export const getFolloweesService = async (userId, page = 1, limit = 10) => {
  const { page: normalizedPage, limit: normalizedLimit, skip } = normalizePagination(page, limit)

  const follows = await Follow.find({ follower: userId })
    .populate('following', 'fullName email profilePicture')
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

export const checkFollowStatusService = async (currentUserId, targetUserId) => {
  const follow = await Follow.findOne({ follower: currentUserId, following: targetUserId })
  return !!follow
}

export const getFriendsService = async (userId, page = 1, limit = 10) => {
  const { page: normalizedPage, limit: normalizedLimit, skip } = normalizePagination(page, limit)

  const following = await Follow.find({ follower: userId }).select('following')
  const followingIds = following.map(f => f.following)

  const followers = await Follow.find({ following: userId, follower: { $in: followingIds } })
    .populate('follower', 'fullName email profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(normalizedLimit)

  const total = await Follow.countDocuments({ following: userId, follower: { $in: followingIds } })
  const friends = followers.map(f => f.follower)

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
