import type { Request, Response, NextFunction } from 'express'
import { likePostService, unlikePostService, getPostLikeCountService, checkLikeStatusService } from '../services/likeService.js'

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const userId = req.user!.userId
    const post = await likePostService({ postId, userId })

    return res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const userId = req.user!.userId
    const post = await unlikePostService({ postId, userId })

    return res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

export const getPostLikeCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const likeCount = await getPostLikeCountService({ postId })

    return res.status(200).json({
      success: true,
      message: 'Post like count retrieved successfully',
      data: { likeCount },
    })
  } catch (error) {
    next(error)
  }
}

export const checkLikeStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = String(req.params.postId)
    const userId = req.user!.userId
    const isLiked = await checkLikeStatusService({ postId, userId })

    return res.status(200).json({
      success: true,
      message: 'Like status retrieved successfully',
      data: { isLiked },
    })
  } catch (error) {
    next(error)
  }
}
