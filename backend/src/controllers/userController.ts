import type { Request, Response, NextFunction } from 'express'
import { parsePaginationParams } from '../types/index.js'
import {
  getCurrentProfileService,
  getProfileByIdService,
  updateProfileService,
  getSuggestedUsersService,
  searchUsersService,
} from '../services/userService.js'

export const getCurrentProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const user = await getCurrentProfileService({ userId })

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const getProfileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = String(req.params.userId)
    const user = await getProfileByIdService({ userId })

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const targetUserId = req.params.userId

    if (targetUserId && String(targetUserId) !== String(userId)) {
      const error = new Error('You can only update your own profile')
      error.statusCode = 403
      throw error
    }

    const { fullName, username, bio, profilePicture, coverPicture } = req.body || {}
    const user = await updateProfileService({ userId, fullName, username, bio, profilePicture, coverPicture })

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const getSuggestedUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const { page, limit } = parsePaginationParams(req.query)
    const result = await getSuggestedUsersService({
      userId,
      page: page,
      limit: limit,
    })

    return res.status(200).json({
      success: true,
      message: 'Suggested users retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const { query = '', limit = 10 } = req.query
    const result = await searchUsersService({
      userId,
      query: String(query),
      limit: typeof limit === 'string' ? parseInt(limit) : 10,
    })

    return res.status(200).json({
      success: true,
      message: 'Search results retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
