import type { Request, Response, NextFunction } from 'express'
import { parsePaginationParams } from '../types/index.js'
import {
  bookmarkPostService,
  unbookmarkPostService,
  getUserBookmarkedPostsService,
  getPostBookmarkCountService,
  checkBookmarkStatusService,
} from '../services/bookmarkService.js'

export const bookmarkPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const userId = req.user!.userId
    const post = await bookmarkPostService({ postId, userId })

    return res.status(200).json({
      success: true,
      message: 'Post bookmarked successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const unbookmarkPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const userId = req.user!.userId
    const post = await unbookmarkPostService({ postId, userId })

    return res.status(200).json({
      success: true,
      message: 'Post unbookmarked successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserBookmarkedPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId
    const { page, limit } = parsePaginationParams(req.query)
    const result = await getUserBookmarkedPostsService({ userId, page: page, limit: limit })

    return res.status(200).json({
      success: true,
      message: 'User bookmarked posts retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getPostBookmarkCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const bookmarkCount = await getPostBookmarkCountService({ postId })

    return res.status(200).json({
      success: true,
      message: 'Post bookmark count retrieved successfully',
      data: { bookmarkCount },
    })
  } catch (error) {
    next(error)
  }
}

export const checkBookmarkStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const userId = req.user!.userId
    const isBookmarked = await checkBookmarkStatusService({ postId, userId })

    return res.status(200).json({
      success: true,
      message: 'Bookmark status retrieved successfully',
      data: { isBookmarked },
    })
  } catch (error) {
    next(error)
  }
}
