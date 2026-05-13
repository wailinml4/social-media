import type { Request, Response, NextFunction } from 'express'
import { parsePaginationParams } from '../types/index.js'
import {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFolloweesService,
  checkFollowStatusService,
  getFriendsService,
} from '../services/followService.js'

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user!.userId
    const targetUserId = String(req.params.userId)

    const { currentUser, targetUser } = await followUserService({ currentUserId, targetUserId })
    if (!currentUser || !targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'User followed successfully',
      data: {
        followingCount: currentUser.followingCount,
        followerCount: targetUser.followerCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user!.userId
    const targetUserId = String(req.params.userId)

    const { currentUser, targetUser } = await unfollowUserService({ currentUserId, targetUserId })
    if (!currentUser || !targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
      data: {
        followingCount: currentUser.followingCount,
        followerCount: targetUser.followerCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(req.params.userId)
    const { page, limit } = parsePaginationParams(req.query)
    const result = await getFollowersService({ userId, page: page, limit: limit })

    return res.status(200).json({
      success: true,
      message: 'Followers retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getFollowees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(req.params.userId)
    const { page, limit } = parsePaginationParams(req.query)
    const result = await getFolloweesService({ userId, page: page, limit: limit })

    return res.status(200).json({
      success: true,
      message: 'Followees retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const checkFollowStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user!.userId
    const targetUserId = String(req.params.userId)

    const isFollowing = await checkFollowStatusService({ currentUserId, targetUserId })

    return res.status(200).json({
      success: true,
      message: 'Follow status retrieved successfully',
      data: { isFollowing },
    })
  } catch (error) {
    next(error)
  }
}

export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(req.params.userId)
    const { page, limit } = parsePaginationParams(req.query)
    const result = await getFriendsService({ userId, page: page, limit: limit })

    return res.status(200).json({
      success: true,
      message: 'Friends retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
